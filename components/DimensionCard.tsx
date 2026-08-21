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
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 opacity-60">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-500">{dimension.name}</h3>
          <span className="text-sm text-gray-400">N/A</span>
        </div>
        <p className="text-sm text-gray-400 mt-1">{dimension.disabledReason}</p>
      </div>
    );
  }

  const percentage = Math.round((dimension.score / dimension.maxScore) * 100);
  const scoreColor = percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-blue-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="text-lg font-bold text-gray-900 w-16 shrink-0">
            {dimension.score}/{dimension.maxScore}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{dimension.name}</h3>
            <div className="w-full max-w-[200px] h-2 bg-gray-200 rounded-full mt-1">
              <div 
                className={`h-full ${scoreColor} rounded-full transition-all`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transform transition-transform shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Reasoning</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{dimension.reasoning}</p>
          </div>

          {dimension.evidence.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Evidence</h4>
              <div className="space-y-2">
                {dimension.evidence.map((ev, i) => (
                  <blockquote key={i} className="border-l-4 border-blue-300 pl-4 py-1 bg-blue-50 rounded-r">
                    <p className="text-sm text-gray-700 italic">&ldquo;{ev.quote}&rdquo;</p>
                    {ev.speaker && <p className="text-xs text-gray-500 mt-1">— {ev.speaker}</p>}
                  </blockquote>
                ))}
              </div>
            </div>
          )}

          {dimension.evidence.length === 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Evidence</h4>
              <p className="text-sm text-gray-500 italic">No direct transcript evidence found for this behavior.</p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Fix</h4>
            <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">{dimension.quickFix}</p>
          </div>
        </div>
      )}
    </div>
  );
}
