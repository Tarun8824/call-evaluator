import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('runs')
    .select('id, call_type, status, result, error_message, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return Response.json({ error: 'Unable to load evaluations' }, { status: 500 });
  }

  return Response.json(data || []);
}
