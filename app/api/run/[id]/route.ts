import { getRun, updateRunStatus } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const run = await getRun(params.id);
  if (!run) {
    return Response.json({ error: 'Run not found' }, { status: 404 });
  }

  const isActive = run.status === 'pending' || run.status === 'running';
  const isStale = Date.now() - new Date(run.updated_at).getTime() > 10 * 60 * 1000;
  if (isActive && isStale) {
    const message = 'Evaluation timed out before the evaluator completed. Please submit the transcript again.';
    await updateRunStatus(run.id, 'failed', undefined, message);
    run.status = 'failed';
    run.error_message = message;
  }

  return Response.json(run);
}
