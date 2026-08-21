'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TranscriptForm from '@/components/TranscriptForm';

export default function Home() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (transcript: string, callType: 'kickoff' | 'coaching') => {
    setIsSubmitting(true);
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
        alert(data.error || 'Something went wrong');
      }
    } catch (err) {
      alert('Failed to submit. Please try again.');
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
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-container">
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
            <a key={label as string} href="#" className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${active ? 'border-r-4 border-primary bg-surface-container-high text-primary' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>
              <span className={`material-symbols-outlined ${active ? 'fill' : ''}`}>{icon}</span>{label}
            </a>
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
            <div className="mb-8"><h2 className="text-2xl font-semibold">Dashboard</h2><p className="mt-1 text-sm text-on-surface-variant">Submit new transcripts and monitor evaluation progress.</p></div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <section className="lg:col-span-7"><TranscriptForm onSubmit={handleSubmit} isSubmitting={isSubmitting} /></section>
              <aside className="lg:col-span-5"><ActiveTasks /></aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ActiveTasks() {
  return <section className="h-full rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
    <div className="mb-6 flex items-center justify-between"><h3 className="text-xl font-semibold">Active Tasks</h3><button type="button" className="text-sm font-semibold text-primary">View All</button></div>
    <div className="space-y-4">
      <div className="rounded-lg border border-outline-variant bg-surface-bright p-4"><div className="mb-2 flex items-start justify-between gap-3"><h4 className="font-semibold">Q3 Review - Acme Corp</h4><span className="rounded-full bg-surface-container px-2.5 py-1 text-[10px] font-bold uppercase text-primary">Processing</span></div><p className="mb-3 text-sm text-on-surface-variant">Coaching Session • Uploaded 10m ago</p><div className="mb-1 flex justify-between text-[11px] text-on-surface-variant"><span>Analyzing Sentiment...</span><span>Step 2 of 4</span></div><div className="h-1.5 overflow-hidden rounded-full bg-surface-variant"><div className="h-full w-1/2 rounded-full bg-primary" /></div></div>
      {['Onboarding Kickoff - TechFlow', 'Escalation Call - Global Net'].map((name, index) => <div key={name} className="rounded-lg border border-outline-variant bg-surface-bright p-4 hover:bg-surface-container-low"><div className="mb-2 flex items-start justify-between gap-3"><h4 className="font-semibold">{name}</h4><span className="rounded-full bg-surface-container-highest px-2.5 py-1 text-[10px] font-bold uppercase text-secondary">Ready</span></div><p className="text-sm text-on-surface-variant">{index ? 'Coaching Session • Uploaded 2h ago' : 'Kick-off Call • Uploaded 1h ago'}</p>{!index && <div className="mt-3 flex gap-2 text-xs text-on-surface-variant"><span className="rounded bg-surface-container px-2 py-1">Score: 92/100</span><span className="rounded bg-surface-container px-2 py-1">3 Insights</span></div>}</div>)}
    </div>
  </section>;
}
