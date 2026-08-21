'use client';

import { useState } from 'react';

interface Props {
  onSubmit: (transcript: string, callType: 'kickoff' | 'coaching') => void;
  isSubmitting: boolean;
}

export default function TranscriptForm({ onSubmit, isSubmitting }: Props) {
  const [transcript, setTranscript] = useState('');
  const [callType, setCallType] = useState<'kickoff' | 'coaching'>('kickoff');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    onSubmit(transcript, callType);
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
      <div>
        <div className="mb-6 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-primary"><span className="material-symbols-outlined">add_task</span></div><div><h3 className="text-xl font-semibold">New Evaluation</h3><p className="text-sm text-on-surface-variant">Paste transcript to initiate clinical AI analysis.</p></div></div>
        <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Evaluation Type</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className={`cursor-pointer rounded-lg border p-4 transition-colors ${callType === 'kickoff' ? 'border-primary bg-surface-container-low' : 'border-outline-variant'}`}>
            <input
              type="radio"
              value="kickoff"
              checked={callType === 'kickoff'}
              onChange={(e) => setCallType(e.target.value as 'kickoff')}
              className="sr-only"
            />
            <span className="flex items-center justify-between font-semibold"><span>Kick-off Call</span><span className="material-symbols-outlined text-primary">rocket_launch</span></span><span className="mt-2 block text-sm text-on-surface-variant">Standard onboarding and setup evaluation.</span>
          </label>
          <label className={`cursor-pointer rounded-lg border p-4 transition-colors ${callType === 'coaching' ? 'border-primary bg-surface-container-low' : 'border-outline-variant'}`}>
            <input
              type="radio"
              value="coaching"
              checked={callType === 'coaching'}
              onChange={(e) => setCallType(e.target.value as 'coaching')}
              className="sr-only"
            />
            <span className="flex items-center justify-between font-semibold"><span>Coaching Session</span><span className="material-symbols-outlined text-primary">psychology</span></span><span className="mt-2 block text-sm text-on-surface-variant">In-depth performance and feedback analysis.</span>
          </label>
        </div>
      </div>

      <div>
        <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Transcript Evidence</label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={8}
          className="min-h-36 w-full resize-none rounded-lg border border-outline-variant bg-surface-bright p-4 font-mono text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="Paste full call transcript here. Ensure timestamps are included for accurate citation mapping..."
        />
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => setTranscript('')} disabled={!transcript} className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50">Clear</button>
        <button
          type="submit"
          disabled={isSubmitting || !transcript.trim()}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-container disabled:cursor-not-allowed disabled:bg-outline"
        >
          <span className="material-symbols-outlined">memory</span>{isSubmitting ? 'Starting Evaluation...' : 'Run Analysis'}
        </button>
      </div>
    </form>
  );
}
