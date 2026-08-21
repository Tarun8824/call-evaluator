import { NextRequest } from 'next/server';
import { waitUntil } from '@vercel/functions';
import { createRun, updateRunStatus } from '@/lib/supabase';
import { evaluateTranscript } from '@/lib/evaluator';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transcript, callType } = body;

    if (!transcript || !['kickoff', 'coaching'].includes(callType)) {
      return Response.json({ error: 'Missing transcript or callType' }, { status: 400 });
    }

    if (transcript.length > 100000) {
      return Response.json({ error: 'Transcript too long (max 100k chars)' }, { status: 400 });
    }

    const run = await createRun(callType, transcript);

    const processEval = async () => {
      try {
        await updateRunStatus(run.id, 'running');
        const result = await evaluateTranscript(transcript, callType);
        await updateRunStatus(run.id, 'completed', result);
      } catch (error: any) {
        console.error('Evaluation error:', error);
        await updateRunStatus(run.id, 'failed', undefined, error.message || 'Unknown error');
      }
    };

    waitUntil(processEval());

    return Response.json({ runId: run.id }, { status: 202 });
  } catch (error: any) {
    console.error('API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
