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
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Call Type</label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="kickoff"
              checked={callType === 'kickoff'}
              onChange={(e) => setCallType(e.target.value as 'kickoff')}
              className="mr-2"
            />
            Kick-off Call
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="coaching"
              checked={callType === 'coaching'}
              onChange={(e) => setCallType(e.target.value as 'coaching')}
              className="mr-2"
            />
            Coaching Call
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transcript
        </label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={20}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          placeholder="Paste transcript here... [Speaker]: text"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !transcript.trim()}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
      >
        {isSubmitting ? 'Starting Evaluation...' : 'Evaluate Call'}
      </button>
    </form>
  );
}
