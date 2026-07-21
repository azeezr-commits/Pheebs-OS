/**
 * Pheebs Core - Genesis v0.2 Domain Types (Judgment Engine Architecture)
 * Core Models: Signal, BusinessRecord, Diagnosis, Strategy, PlaybookRecommendation, ThinkingTrace
 */

export interface Signal {
  id: string;
  type: 'review_count' | 'rating' | 'website_booking' | 'operating_hours' | 'phone_routing' | 'category' | 'metadata';
  label: string;
  value: string | number | boolean | Record<string, any>;
  confidence: 'High' | 'Medium' | 'Low';
  source: 'Google Maps' | 'Lighthouse Audit' | 'Review Sentiment' | 'DOM Crawler';
  observedAt: string;
}

export interface EngineVersions {
  observer: string;    // e.g. "v1.0.0"
  reasoner: string;    // e.g. "v1.2.0"
  strategy: string;    // e.g. "v1.0.0"
  playbook: string;    // e.g. "v1.1.0"
}

export interface BusinessRecord {
  id: string;
  name: string;
  category: string;
  address: string;
  website: string;
  phone?: string;
  rating: number;
  reviewCount: number;
  hours?: string;
  signals: Signal[];
  observedAt: string;
  observerVersion: string;
}

export interface Diagnosis {
  id: string;
  businessId: string;
  diagnosis: string;            // One sentence executive diagnosis
  primaryConstraint: string;    // Single primary operational/revenue constraint
  confidence: number;           // 0 to 100 confidence score
  evidenceSignals: Signal[];     // Observable signals supporting this diagnosis
  diagnosedAt: string;
  reasonerVersion: string;
}

export interface Strategy {
  id: string;
  diagnosisId: string;
  talkAbout: string[];          // Value points to anchor on
  avoid: string[];              // Traps to avoid
  questions: string[];          // Crucial discovery question
  opening: string;              // High-impact call opening hook
  watchouts: string[];          // Red flags/objection warnings
  createdAt: string;
  strategyVersion: string;
}

export interface PlaybookRecommendation {
  id: string;
  strategyId: string;
  playbookKey: string;          // e.g. "zoca", "consultative"
  playbookName: string;
  anchorProduct: string;        // Core solution anchor
  pitchAngle: string;           // Exact framing angle
  strategicRationale: string;   // Why this fits the primary constraint
  actionItems: string[];        // Tactical next steps
  playbookVersion: string;
}

/**
 * The Thinking Trace — Persisted Judgment Audit Log
 * Saves the complete reasoning stack, not just a disposable UI brief.
 */
export interface ThinkingTrace {
  id: string;
  businessRecord: BusinessRecord;
  signals: Signal[];
  diagnosis: Diagnosis;
  strategy: Strategy;
  recommendation: PlaybookRecommendation;
  engineVersions: EngineVersions;
  createdAt: string;
  executionTimeMs: number;
}

/**
 * Disposable UI presentation projection
 */
export interface PheebsBrief {
  id: string;
  traceId: string;
  business: BusinessRecord;
  diagnosis: Diagnosis;
  strategy: Strategy;
  recommendation: PlaybookRecommendation;
  generatedAt: string;
  executionTimeMs: number;
}
