import { createClient } from '@supabase/supabase-js';
import { Run, EvaluationResult } from './types';
import { CONFIG } from './config';

export const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.serviceRoleKey);

export async function createRun(callType: 'kickoff' | 'coaching', transcript: string): Promise<Run> {
  const { data, error } = await supabase
    .from('runs')
    .insert({ call_type: callType, transcript, status: 'pending' })
    .select()
    .single();

  if (error) throw error;
  return data as Run;
}

export async function updateRunStatus(
  id: string, 
  status: Run['status'], 
  result?: EvaluationResult, 
  errorMessage?: string
) {
  const update: any = { status, updated_at: new Date().toISOString() };
  if (result) update.result = result;
  if (errorMessage) update.error_message = errorMessage;

  const { error } = await supabase.from('runs').update(update).eq('id', id);
  if (error) throw error;
}

export async function getRun(id: string): Promise<Run | null> {
  const { data, error } = await supabase.from('runs').select('*').eq('id', id).single();
  if (error) return null;
  return data as Run;
}
