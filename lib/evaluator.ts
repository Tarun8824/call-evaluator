import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { join } from 'path';
import { EvaluationResult } from './types';
import { CONFIG } from './config';

const client = new OpenAI({
  apiKey: CONFIG.nvidia.apiKey,
  baseURL: CONFIG.nvidia.baseURL,
});

const JSON_SCHEMA_DESCRIPTION = `You must respond with a single valid JSON object matching this exact structure:

{
  "totalScore": number,
  "maxPossibleScore": number,
  "band": "ELITE" | "STRONG" | "INCONSISTENT" | "AT_RISK" | "FAIL",
  "theOneThing": {
    "change": string,
    "wouldHaveScored": number
  },
  "theBrief": string,
  "redFlags": [
    { "flag": string, "why": string }
  ],
  "appliedCaps": [string],
  "dimensions": [
    {
      "id": number,
      "name": string,
      "score": number,
      "maxScore": number,
      "band": string,
      "reasoning": string,
      "evidence": [
        { "quote": string, "speaker": string }
      ],
      "quickFix": string,
      "disabled": boolean (optional),
      "disabledReason": string (optional)
    }
  ]
}

Rules for the JSON:
- totalScore must equal the sum of all dimension scores.
- maxPossibleScore is 100 when D4 is active, 85 when D4 is disabled.
- band must be one of: ELITE (90-100), STRONG (80-89), INCONSISTENT (70-79), AT RISK (60-69), FAIL (<60).
- Every dimension must have at least one evidence item with a VERBATIM quote from the transcript.
- If a behavior is not in the transcript, set evidence to [{"quote": "No direct transcript evidence found for this behavior."}] and score conservatively.
- Do not include markdown code blocks. Return raw JSON only.`;

function stripMarkdownJson(raw: string): string {
  const cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    return cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  }
  if (cleaned.startsWith('```')) {
    return cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
}

function validateResult(parsed: any): EvaluationResult {
  if (!parsed.dimensions || !Array.isArray(parsed.dimensions) || parsed.dimensions.length === 0) {
    throw new Error('Invalid evaluation: no dimensions returned');
  }
  if (typeof parsed.totalScore !== 'number') {
    throw new Error('Invalid evaluation: totalScore missing');
  }
  if (typeof parsed.maxPossibleScore !== 'number') {
    throw new Error('Invalid evaluation: maxPossibleScore missing');
  }
  if (!['ELITE', 'STRONG', 'INCONSISTENT', 'AT RISK', 'FAIL'].includes(parsed.band)) {
    throw new Error('Invalid evaluation: band missing or invalid');
  }
  if (!parsed.theOneThing || typeof parsed.theOneThing.change !== 'string') {
    throw new Error('Invalid evaluation: theOneThing missing');
  }
  if (typeof parsed.theBrief !== 'string') {
    throw new Error('Invalid evaluation: theBrief missing');
  }
  if (!Array.isArray(parsed.redFlags)) {
    throw new Error('Invalid evaluation: redFlags missing');
  }
  if (!Array.isArray(parsed.appliedCaps)) {
    throw new Error('Invalid evaluation: appliedCaps missing');
  }

  // Validate dimension structure
  for (const dim of parsed.dimensions) {
    if (typeof dim.id !== 'number' || typeof dim.name !== 'string' || typeof dim.score !== 'number') {
      throw new Error(`Invalid dimension: ${JSON.stringify(dim)}`);
    }
    if (!Array.isArray(dim.evidence) || dim.evidence.length === 0) {
      throw new Error(`Dimension ${dim.name} missing evidence`);
    }
  }

  return parsed as EvaluationResult;
}

export async function evaluateTranscript(
  transcript: string, 
  callType: 'kickoff' | 'coaching'
): Promise<EvaluationResult> {
  const rubricPath = join(process.cwd(), 'rubrics', `${callType}-call-rubric.md`);
  const rubric = readFileSync(rubricPath, 'utf-8');

  const systemPrompt = `You are an expert call quality evaluator for a coaching company. You score calls with extreme rigor based ONLY on verifiable transcript evidence.

CRITICAL RULES:
1. NEVER guess or infer. If a behavior is not clearly present in the transcript, score conservatively and explicitly state "No direct evidence found" in reasoning.
2. Every dimension score MUST be supported by verbatim transcript quotes in the evidence array. Do not paraphrase.
3. Apply all automatic caps listed in the rubric BEFORE finalizing scores. List all applied caps in the appliedCaps array.
4. Score each dimension using ONLY the exact bucket values listed in its table. No interpolation between buckets.
5. The transcript format is: [Speaker Name]: what they said. Use exact lines from the transcript as evidence.
6. If a dimension is not applicable, set disabled=true and provide disabledReason.
7. For coaching calls, carefully check if D4 (Movement Coaching) should be disabled based on the criteria in the rubric.
8. "The One Thing" must be the single most impactful change the coach could have made, with a realistic score calculation.
9. "The Brief" should be 2-3 sentences written directly to the coach, summarizing call quality.
10. "Red Flags" should identify specific client retention risks visible in the transcript, not generic concerns.
11. When scoring, prefer the lower tier if evidence is ambiguous. Never score from impressions.
12. totalScore must exactly equal the sum of all dimension scores.
13. maxPossibleScore is 100 when no dimensions are disabled, 85 when D4 is disabled.
14. Keep reasoning, quickFix, and theBrief concise so the evaluation completes quickly.

${JSON_SCHEMA_DESCRIPTION}

Remember: Evidence or nothing. When a behavior is not in the transcript, the dimension must say so.`;

  const userPrompt = `RUBRIC:
${rubric}

TRANSCRIPT TO EVALUATE:
${transcript}

Evaluate this ${callType} call transcript against the rubric above. Return ONLY raw JSON — no markdown, no explanations outside the JSON.`;

  let lastError: Error | null = null;

  // Retry up to 3 times
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: CONFIG.nvidia.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 5000,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('Empty response from NVIDIA NIM');

      const cleaned = stripMarkdownJson(content);
      const parsed = JSON.parse(cleaned);

      return validateResult(parsed);
    } catch (error: any) {
      lastError = error;
      console.error(`NVIDIA NIM attempt ${attempt} failed:`, error.message);
      if (attempt < 3) {
        // Wait before retry
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  throw new Error(`NVIDIA NIM evaluation failed after 3 attempts: ${lastError?.message}`);
}
