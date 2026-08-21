export interface DimensionEvidence {
  quote: string;
  speaker?: string;
}

export interface DimensionResult {
  id: number;
  name: string;
  score: number;
  maxScore: number;
  band: string;
  reasoning: string;
  evidence: DimensionEvidence[];
  quickFix: string;
  disabled?: boolean;
  disabledReason?: string;
}

export interface RedFlag {
  flag: string;
  why: string;
}

export interface EvaluationResult {
  totalScore: number;
  maxPossibleScore: number;
  band: string;
  theOneThing: {
    change: string;
    wouldHaveScored: number;
  };
  theBrief: string;
  redFlags: RedFlag[];
  dimensions: DimensionResult[];
  appliedCaps: string[];
}

export interface Run {
  id: string;
  call_type: 'kickoff' | 'coaching';
  transcript: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result: EvaluationResult | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}
