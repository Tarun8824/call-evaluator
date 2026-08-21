import { Run } from '@/lib/types';

export default function PdfReport({ run }: { run: Run }) {
  const result = run.result!;
  const percentage = Math.round((result.totalScore / result.maxPossibleScore) * 100);

  return (
    <div className="p-8 bg-white" style={{ width: '800px' }}>
      <div className="border-b-2 border-gray-900 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Call Evaluation Report</h1>
        <p className="text-sm text-gray-500 mt-2">
          {run.call_type === 'kickoff' ? 'Kick-off Call' : 'Coaching Call'} • {new Date(run.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-6">
          <span className="text-4xl font-bold text-gray-900">{result.totalScore}/{result.maxPossibleScore}</span>
          <span className="px-4 py-2 bg-gray-900 text-white rounded-lg text-lg font-semibold">
            {result.band}
          </span>
          <span className="text-gray-500 text-lg">{percentage}%</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 border-b pb-2">The Brief</h2>
        <p className="text-gray-700 leading-relaxed">{result.theBrief}</p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold text-blue-900 mb-2">The One Thing</h2>
        <p className="text-blue-800 mb-2">{result.theOneThing.change}</p>
        <p className="text-sm text-blue-600">
          Would have scored: <span className="font-semibold">{result.theOneThing.wouldHaveScored}/{result.maxPossibleScore}</span>
        </p>
      </div>

      {result.redFlags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-red-900 mb-3 border-b pb-2">Red Flags</h2>
          {result.redFlags.map((flag, i) => (
            <div key={i} className="mb-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="font-medium text-red-900">{flag.flag}</p>
              <p className="text-sm text-red-700 mt-1">{flag.why}</p>
            </div>
          ))}
        </div>
      )}

      {result.appliedCaps.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b pb-2">Automatic Caps Applied</h2>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {result.appliedCaps.map((cap, i) => (
              <li key={i}>{cap}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Dimensions</h2>
        {result.dimensions.map((dim) => (
          <div key={dim.id} className="mb-6 border-b pb-4 last:border-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-900 text-lg">{dim.name}</h3>
              <span className="font-bold text-lg">{dim.score}/{dim.maxScore}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{dim.reasoning}</p>
            {dim.evidence.length > 0 && (
              <div className="mb-3">
                {dim.evidence.map((ev, i) => (
                  <p key={i} className="text-xs text-gray-500 italic mb-1 border-l-2 border-gray-300 pl-2">
                    &ldquo;{ev.quote}&rdquo;
                  </p>
                ))}
              </div>
            )}
            <p className="text-sm text-blue-700"><strong>Quick Fix:</strong> {dim.quickFix}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
