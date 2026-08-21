'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TranscriptForm from '@/components/TranscriptForm';
import { Run } from '@/lib/types';

type View = 'dashboard' | 'evaluations' | 'coaching' | 'running';

export default function Home() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<View>('dashboard');
  const [runs, setRuns] = useState<Run[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadRuns = async () => {
    try {
      const response = await fetch('/api/runs', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load evaluations');
      setRuns(data);
    } catch (loadError: any) {
      setError(loadError.message || 'Unable to load evaluations');
    }
  };

  useEffect(() => {
    loadRuns();
    const interval = setInterval(loadRuns, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (transcript: string, callType: 'kickoff' | 'coaching') => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, callType }),
      });

      const data = await res.json();
      if (data.runId) {
        router.push(`/run/${data.runId}`);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (submitError: any) {
      setError(submitError.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-outline-variant bg-surface-container-low py-8 md:flex">
        <div className="px-6 mb-8">
          <h1 className="text-xl font-bold text-primary">EvalAI</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Clinical Intelligence</p>
        </div>
        <div className="px-4 mb-8">
          <button type="button" onClick={() => setView('dashboard')} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-container">
            <span className="material-symbols-outlined">add</span> Submit Transcript
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-4 text-sm">
          {[
            ['dashboard', 'Dashboard', true],
            ['analytics', 'Evaluations', false],
            ['record_voice_over', 'Coaching', false],
            ['settings', 'Settings', false],
          ].map(([icon, label, active]) => (
            <button key={label as string} type="button" onClick={() => setView(label === 'Dashboard' ? 'dashboard' : label === 'Evaluations' ? 'evaluations' : label === 'Coaching' ? 'coaching' : 'dashboard')} className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${view === (label === 'Dashboard' ? 'dashboard' : label === 'Evaluations' ? 'evaluations' : label === 'Coaching' ? 'coaching' : 'dashboard') ? 'border-r-4 border-primary bg-surface-container-high text-primary' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>
              <span className={`material-symbols-outlined ${active ? 'fill' : ''}`}>{icon}</span>{label}
            </button>
          ))}
        </nav>
        <nav className="space-y-1 px-4 text-sm text-on-surface-variant">
          <a href="#" className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-surface-container-high"><span className="material-symbols-outlined">help</span>Help Center</a>
          <a href="#" className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-surface-container-high"><span className="material-symbols-outlined">logout</span>Logout</a>
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-4 md:px-8">
          <button type="button" className="text-on-surface-variant md:hidden" aria-label="Open navigation"><span className="material-symbols-outlined">menu</span></button>
          <div className="relative ml-auto hidden w-full max-w-md md:block">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline">search</span>
            <input aria-label="Search evaluations" className="w-full rounded-full bg-surface-container-low py-2 pl-10 pr-4 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-outline-variant" placeholder="Search evaluations..." />
          </div>
          <div className="ml-4 flex items-center gap-3 text-on-surface-variant">
            <button type="button" aria-label="Notifications" className="relative rounded-full p-2 hover:bg-surface-container-low"><span className="material-symbols-outlined">notifications</span><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-error" /></button>
            <button type="button" aria-label="Help" className="rounded-full p-2 hover:bg-surface-container-low"><span className="material-symbols-outlined">help_outline</span></button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-primary-fixed text-xs font-bold text-primary">TA</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-[1440px]">
            {error && <div role="alert" className="mb-6 flex items-start justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button type="button" onClick={() => setError(null)} aria-label="Dismiss error">×</button></div>}
            {view === 'dashboard' && <><div className="mb-8"><h2 className="text-2xl font-semibold">Dashboard</h2><p className="mt-1 text-sm text-on-surface-variant">Submit new transcripts and monitor evaluation progress.</p></div><div className="grid grid-cols-1 gap-6 lg:grid-cols-12"><section className="lg:col-span-7"><TranscriptForm onSubmit={handleSubmit} isSubmitting={isSubmitting} /></section><aside className="lg:col-span-5"><ActiveTasks runs={runs} /></aside></div></>}
            {view === 'evaluations' && <RunList title="All Evaluations" runs={runs} onRefresh={loadRuns} />}
            {view === 'coaching' && <RunList title="Coaching Evaluations" runs={runs.filter((run) => run.call_type === 'coaching')} onRefresh={loadRuns} />}
            {view === 'running' && <RunList title="Running Tasks" runs={runs.filter((run) => run.status === 'pending' || run.status === 'running')} onRefresh={loadRuns} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function ActiveTasks({ runs }: { runs: Run[] }) {
  const activeRuns = runs.filter((run) => run.status === 'pending' || run.status === 'running').slice(0, 5);
  return <section className="h-full rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
    <div className="mb-6 flex items-center justify-between"><h3 className="text-xl font-semibold">Active Tasks</h3><span className="text-sm text-on-surface-variant">{activeRuns.length} active</span></div>
    {activeRuns.length === 0 ? <p className="text-sm text-on-surface-variant">No evaluations are currently running.</p> : <div className="space-y-4">{activeRuns.map((run) => <RunCard key={run.id} run={run} />)}</div>}
  </section>;
}

function RunList({ title, runs, onRefresh }: { title: string; runs: Run[]; onRefresh: () => void }) {
  return <section><div className="mb-8 flex items-center justify-between"><div><h2 className="text-2xl font-semibold">{title}</h2><p className="mt-1 text-sm text-on-surface-variant">Persistent evaluation reports and processing status.</p></div><button type="button" onClick={onRefresh} className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold hover:bg-surface-container-low">Refresh</button></div><div className="space-y-3">{runs.length === 0 ? <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant">No evaluations found.</div> : runs.map((run) => <RunCard key={run.id} run={run} />)}</div></section>;
}

function RunCard({ run }: { run: Run }) {
  const label = run.call_type === 'coaching' ? 'Coaching Session' : 'Kick-off Call';
  const score = run.result ? `${run.result.totalScore}/${run.result.maxPossibleScore}` : null;
  return <a href={`/run/${run.id}`} className="block rounded-lg border border-outline-variant bg-surface-bright p-4 transition-colors hover:bg-surface-container-low"><div className="flex items-start justify-between gap-4"><div><h4 className="font-semibold">{label}</h4><p className="mt-1 text-sm text-on-surface-variant">{new Date(run.created_at).toLocaleString()}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${run.status === 'completed' ? 'bg-surface-container-highest text-secondary' : run.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-surface-container text-primary'}`}>{run.status}</span></div>{score && <span className="mt-3 inline-block rounded bg-surface-container px-2 py-1 text-xs text-on-surface-variant">Score: {score}</span>}{run.status === 'failed' && <p className="mt-2 text-sm text-red-700">{run.error_message || 'Evaluation failed'}</p>}</a>;
}
