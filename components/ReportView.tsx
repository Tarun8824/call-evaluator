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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Evaluation Report</h1>
              <p className="text-sm text-gray-500 mt-1">
                {run.call_type === 'kickoff' ? 'Kick-off Call' : 'Coaching Call'} • {new Date(run.created_at).toLocaleDateString()}
              </p>
            </div>
            <PdfButton run={run} />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className={`text-4xl font-bold px-4 py-2 rounded-lg border ${getBandColor(result.band)}`}>
              {result.totalScore}/{result.maxPossibleScore}
            </div>
            <div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getBandColor(result.band)}`}>
                {result.band}
              </div>
              <p className="text-sm text-gray-500 mt-1">{percentage}%</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">The Brief</h2>
            <p className="text-gray-700 leading-relaxed">{result.theBrief}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">The One Thing</h2>
            <p className="text-blue-800 mb-2">{result.theOneThing.change}</p>
            <p className="text-sm text-blue-600">
              Would have scored: <span className="font-semibold">{result.theOneThing.wouldHaveScored}/{result.maxPossibleScore}</span>
            </p>
          </div>

          {result.redFlags.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Red Flags</h2>
              <div className="space-y-3">
                {result.redFlags.map((flag, i) => (
                  <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-medium text-red-900 mb-1">{flag.flag}</h3>
                    <p className="text-sm text-red-700">{flag.why}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.appliedCaps.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Automatic Caps Applied</h2>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {result.appliedCaps.map((cap, i) => (
                  <li key={i}>{cap}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 px-1">Dimensions</h2>
          {result.dimensions.map((dim) => (
            <DimensionCard key={dim.id} dimension={dim} />
          ))}
        </div>
      </div>
    </div>
  );
}
