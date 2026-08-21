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
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Call Evaluator</h1>
        <p className="text-gray-600 mb-8">Paste a transcript and select the call type to generate an evaluation report.</p>
        <TranscriptForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </main>
  );
}
