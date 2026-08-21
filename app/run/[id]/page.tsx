'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Run } from '@/lib/types';
import ReportView from '@/components/ReportView';

export default function RunPage() {
  const params = useParams();
  const [run, setRun] = useState<Run | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRun = async () => {
      try {
        const res = await fetch(`/api/run/${params.id}`);
        const data = await res.json();
        if (res.ok) {
          setRun(data);
        } else {
          setError(data.error || 'Failed to load run');
        }
      } catch (err) {
        setError('Failed to load run');
      } finally {
        setLoading(false);
      }
    };

    fetchRun();

    const interval = setInterval(() => {
      fetchRun();
    }, 3000);

    return () => clearInterval(interval);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !run) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Run not found'}</p>
        </div>
      </div>
    );
  }

  if (run.status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Evaluation Failed</h2>
          <p className="text-red-600">{run.error_message || 'Unknown error occurred'}</p>
          <p className="text-sm text-gray-500 mt-4">Run ID: {run.id}</p>
        </div>
      </div>
    );
  }

  if (run.status === 'pending' || run.status === 'running') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {run.status === 'pending' ? 'Queued for Evaluation' : 'Evaluating...'}
          </h2>
          <p className="text-gray-600 mb-4">
            {run.status === 'pending' 
              ? 'Your evaluation is queued and will begin shortly.' 
              : 'The AI is analyzing the transcript against the rubric. This may take a minute.'}
          </p>
          <p className="text-sm text-gray-400">You can close this tab. The evaluation will continue.</p>
          <p className="text-xs text-gray-300 mt-2">Run ID: {run.id}</p>
        </div>
      </div>
    );
  }

  return <ReportView run={run} />;
}
