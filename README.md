# Call Evaluator

An AI-powered call quality evaluation system. Paste a transcript, select the call type, and get a structured evaluation report with PDF export.

**Powered by:** NVIDIA NIM (Llama 3.1 405B) + Supabase + Vercel

---

## What it does

- Accepts kick-off or coaching call transcripts
- Scores them against the full rubric using **NVIDIA NIM Llama 3.1 405B** with structured JSON outputs
- Generates a shareable, persistent report URL for every evaluation (`/run/[id]`)
- Runs evaluation in the background via `waitUntil` (close the tab, come back later)
- Shows clear error messages when evaluation fails
- Every dimension score includes verbatim transcript evidence
- Exports a professional PDF matching the on-screen report

---

## Architecture Decisions

### Why NVIDIA NIM instead of OpenAI?

The user's credentials are for NVIDIA NIM. The API is **OpenAI-compatible**, so we use the same `openai` SDK with a custom `baseURL` pointing to `https://integrate.api.nvidia.com/v1`. This means:
- Zero SDK changes beyond config
- Same `json_object` response format
- Same retry and error handling patterns

**Model choice:** `meta/llama-3.1-405b-instruct` — 128k context window handles the 65k-character transcripts, and the 405B parameter count provides the reasoning depth needed for complex rubric scoring. If latency is an issue, swap to `meta/llama-3.1-70b-instruct` in `lib/config.ts`.

### Why `waitUntil` from `@vercel/functions`?

The evaluation can take 30-120 seconds for long transcripts. `waitUntil` lets the HTTP response return immediately (giving the client a run ID to poll) while keeping the serverless function alive to finish the NIM call. This satisfies the "close the tab" requirement without a separate worker queue.

### Why client-side PDF?

`html2canvas` + `jspdf` keeps the deployment simple (no Puppeteer/Playwright binary) and lets the PDF match the report DOM exactly. A hidden print-optimized component renders off-screen and gets captured.

### Why Supabase?

Simple, free at this scale, and provides both persistence and a real-time-friendly schema if we want to add WebSocket updates later.

---

## Setup

### 1. Supabase

The Supabase project is already configured in `lib/config.ts`. The SQL table should already exist, but if not, run this in the SQL Editor:

```sql
create table runs (
  id uuid default gen_random_uuid() primary key,
  call_type text not null check (call_type in ('kickoff', 'coaching')),
  transcript text not null,
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  result jsonb,
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 2. Local Development

```bash
npm install
npm run dev
```

### 3. Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

**No environment variables needed** — API keys are in `lib/config.ts`.

---

## Project Structure

```
lib/
  config.ts                  # API keys (Supabase + NVIDIA NIM)
  types.ts                   # TypeScript interfaces
  supabase.ts                # Supabase client + CRUD helpers
  evaluator.ts               # NVIDIA NIM evaluation logic
app/
  api/evaluate/route.ts      # Creates run, triggers background evaluation
  api/run/[id]/route.ts      # Fetches run by ID
  run/[id]/page.tsx          # Status page + report viewer
  page.tsx                   # Input form
components/
  TranscriptForm.tsx         # Call type selector + transcript input
  ReportView.tsx             # Full report display
  DimensionCard.tsx          # Expandable dimension with evidence
  PdfButton.tsx              # PDF generation trigger
  PdfReport.tsx              # Print-optimized report for PDF capture
rubrics/
  kickoff-call-rubric.md     # Full kick-off rubric
  coaching-call-rubric.md    # Full coaching rubric
```

---

## How Evaluation Works

1. Operator pastes transcript and picks call type
2. `POST /api/evaluate` creates a `runs` row with status `pending`
3. `waitUntil` fires the evaluator asynchronously
4. Evaluator reads the appropriate rubric file, builds a strict system prompt, and calls **NVIDIA NIM Llama 3.1 405B** via the OpenAI-compatible API
5. Model returns structured scores, evidence quotes, caps, brief, red flags, and "the one thing"
6. Status updates to `completed` (or `failed` with message)
7. Client polls `/api/run/[id]` every 3 seconds and renders the report

**Retry logic:** The evaluator retries up to 3 times with exponential backoff if the NIM API returns an error or invalid JSON.

---

## Constraints Satisfied

| Constraint | How it's handled |
|---|---|
| **Every run has its own URL** | `/run/[id]` — persistent, shareable |
| **Close the tab** | `waitUntil` keeps evaluation running after HTTP response |
| **Failed run says why** | Error message stored in DB and displayed on the status page |
| **Evidence or nothing** | Prompt explicitly forbids scoring without verbatim quotes; every dimension includes evidence array |
| **PDF is what the client sees** | `PdfReport` component renders a clean, professional document matching the screen |

---

## Trade-offs & Known Limitations

- **Vercel Hobby timeout**: `maxDuration` is set to 300s, but Hobby plan caps at 60s. For very long transcripts on Hobby, the evaluation might timeout. Upgrade to Pro or switch to `meta/llama-3.1-70b-instruct` for faster responses.
- **PDF is image-based**: `html2canvas` captures the DOM as an image. Text is not selectable in the PDF. For selectable text, switch to a server-side PDF renderer.
- **No auth**: Anyone with the run URL can view it. Add RLS + auth if needed.
- **NVIDIA NIM latency**: 405B can be slower than GPT-4o. The retry logic handles transient failures, but first-call latency may be 30-90s for long transcripts.
