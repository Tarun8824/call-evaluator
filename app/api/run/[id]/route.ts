import { getRun } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const run = await getRun(params.id);
  if (!run) {
    return Response.json({ error: 'Run not found' }, { status: 404 });
  }
  return Response.json(run);
}
