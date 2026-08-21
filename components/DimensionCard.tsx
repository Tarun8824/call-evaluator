'use client';

import { useState } from 'react';
import { DimensionResult } from '@/lib/types';

interface Props {
  dimension: DimensionResult;
}

export default function DimensionCard({ dimension }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (dimension.disabled) {
    return (
      <div className="rounded-lg border border-outline-variant bg-surface-container-low p-4 opacity-60">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-secondary">{dimension.name}</h3>
          <span className="text-sm text-secondary">N/A</span>
        </div>
        <p className="mt-1 text-sm text-secondary">{dimension.disabledReason}</p>
      </div>
    );
  }

  const percentage = Math.round((dimension.score / dimension.maxScore) * 100);
  const scoreColor = percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-blue-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-surface-container-low"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className={`flex h-10 w-14 shrink-0 items-center justify-center rounded font-semibold ${percentage >= 80 ? 'bg-surface-container-high text-primary' : percentage >= 60 ? 'bg-[#fff3cd] text-[#856404]' : 'bg-error-container text-error'}`}>
            {dimension.score}/{dimension.maxScore}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="truncate font-semibold text-on-surface">{dimension.name}</h3>
            <div className="mt-1 h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-surface-container-high">
              <div 
                className={`h-full ${scoreColor} rounded-full transition-all`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
        <span className="material-symbols-outlined text-secondary">{isOpen ? 'expand_less' : 'expand_more'}</span>
      </button>

      {isOpen && (
        <div className="border-t border-outline-variant bg-surface-container-lowest px-5 pb-6 pt-5">
          <div className="mb-4">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-secondary">AI Reasoning</h4>
            <p className="text-sm leading-relaxed text-on-surface-variant">{dimension.reasoning}</p>
          </div>

          {dimension.evidence.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-secondary">Verbatim Evidence</h4>
              <div className="space-y-2">
                {dimension.evidence.map((ev, i) => (
                  <blockquote key={i} className="rounded border border-surface-dim bg-surface p-4">
                    <p className="text-sm italic text-on-surface">&ldquo;{ev.quote}&rdquo;</p>
                    {ev.speaker && <p className="mt-1 text-xs text-secondary">{ev.speaker}</p>}
                  </blockquote>
                ))}
              </div>
            </div>
          )}

          {dimension.evidence.length === 0 && (
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-secondary">Verbatim Evidence</h4>
              <p className="text-sm italic text-secondary">No direct transcript evidence found for this behavior.</p>
            </div>
          )}

          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-secondary">Quick Fix for Coach</h4>
            <p className="rounded-lg bg-surface-container-low p-3 text-sm text-on-surface">{dimension.quickFix}</p>
          </div>
        </div>
      )}
    </div>
  );
}
