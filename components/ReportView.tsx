'use client';

import { Run } from '@/lib/types';
import DimensionCard from './DimensionCard';
import PdfButton from './PdfButton';

function getBandColor(band: string): string {
  switch (band) {
    case 'ELITE': return 'bg-green-100 text-green-800 border-green-200';
    case 'STRONG': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'INCONSISTENT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'AT RISK': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'FAIL': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export default function ReportView({ run }: { run: Run }) {
  const result = run.result!;
  const percentage = Math.round((result.totalScore / result.maxPossibleScore) * 100);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-4 py-4 md:px-8">
        <div className="flex items-center gap-3"><a href="/" className="flex items-center gap-2 text-secondary hover:text-primary"><span className="material-symbols-outlined">arrow_back</span><span className="hidden text-sm sm:inline">Evaluations</span></a><div className="h-6 w-px bg-outline-variant" /><span className="material-symbols-outlined fill text-primary">analytics</span><strong className="text-xl text-primary">EvalAI</strong><span className="hidden border-l border-outline-variant pl-3 text-sm text-on-surface-variant md:inline">Evaluation Report</span></div>
        <div className="flex items-center gap-3"><button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)} aria-label="Share report" className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high"><span className="material-symbols-outlined">share</span></button><a href="/" className="rounded bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-primary-container">New Evaluation</a></div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-outline-variant pb-6 md:flex-row md:items-end">
          <div><p className="mb-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Evaluation Report</p><h1 className="text-3xl font-bold">{run.call_type === 'kickoff' ? 'Kick-off Call' : 'Coaching Call'} Evaluation</h1><p className="mt-2 flex items-center gap-2 text-sm text-secondary"><span className="material-symbols-outlined text-base">calendar_today</span>{new Date(run.created_at).toLocaleDateString()} • AI Assessor</p></div>
          <PdfButton run={run} />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="flex flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest p-6 text-center shadow-sm md:col-span-4"><span className="mb-2 text-xs font-bold uppercase tracking-widest text-secondary">Overall Score</span><span className="text-6xl font-bold text-primary-container">{result.totalScore}</span><span className="text-sm text-secondary">/ {result.maxPossibleScore}</span><span className={`mt-4 rounded-full bg-surface-container px-3 py-1 text-sm font-semibold ${getBandColor(result.band)}`}>{result.band}</span></div>
          <div className="flex flex-col justify-center rounded-lg border border-outline-variant border-l-4 border-l-primary bg-surface-container-lowest p-6 shadow-sm md:col-span-8"><span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary"><span className="material-symbols-outlined text-base">lightbulb</span>The One Thing</span><h2 className="mb-2 text-xl font-semibold">{result.theOneThing.change}</h2><p className="text-sm leading-relaxed text-on-surface-variant">Focus on this change first. It could have raised the score to {result.theOneThing.wouldHaveScored}/{result.maxPossibleScore}.</p></div>
        </div>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"><h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-secondary">The Brief</h2><p className="text-sm leading-relaxed text-on-surface-variant">{result.theBrief}</p></section>
          {result.redFlags.length > 0 && <section className="rounded-lg border border-red-200 bg-[#fffcfc] p-6 shadow-sm"><h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-error"><span className="material-symbols-outlined text-base">warning</span>Red Flags</h2><ul className="list-disc space-y-2 pl-5 text-sm text-on-surface-variant">{result.redFlags.map((flag, index) => <li key={index}><strong>{flag.flag}</strong> {flag.why}</li>)}</ul></section>}
        </div>
        <div className="mb-4"><h2 className="text-xl font-semibold">Dimensions Assessed</h2></div>
        <div className="space-y-4">{result.dimensions.map((dim) => <DimensionCard key={dim.id} dimension={dim} />)}</div>
        {result.appliedCaps.length > 0 && <div className="mt-8 rounded-lg border border-outline-variant bg-surface-container-low p-5"><h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-secondary">Automatic Caps Applied</h2><ul className="list-disc pl-5 text-sm text-on-surface-variant">{result.appliedCaps.map((cap, index) => <li key={index}>{cap}</li>)}</ul></div>}
      </main>
    </div>
  );
}
