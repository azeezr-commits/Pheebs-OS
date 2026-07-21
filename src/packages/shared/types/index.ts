/**
 * Pheebs Core - Genesis Domain Types
 * Single source of truth for domain models across Observer, Reasoner, Strategist, Adapter, and UI.
 */

export interface BusinessCoordinates {
  lat?: number;
  lng?: number;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  address: string;
  website: string;
  rating: number;
  reviewCount: number;
  hours?: string;
  phone?: string;
  coordinates?: BusinessCoordinates;
  description?: string;
  metadata?: Record<string, any>;
  observedAt: string;
}

export interface Diagnosis {
  id: string;
  businessId: string;
  diagnosis: string;            // One sentence executive diagnosis
  primaryConstraint: string;    // The single primary operational/revenue constraint
  confidence: number;           // 0 to 100 confidence score based on observable facts
  evidence: string[];           // Verifiable observable facts supporting this diagnosis
  diagnosedAt: string;
}

export interface Strategy {
  id: string;
  diagnosisId: string;
  talkAbout: string[];          // Key points to emphasize in conversation
  avoid: string[];              // Traps or topics to strictly avoid
  questions: string[];          // Crucial discovery questions (The exact question worth asking)
  opening: string;              // High-impact conversation opening hook
  watchouts: string[];          // Red flags or potential objections
  createdat: string;
}

export interface Recommendation {
  id: string;
  strategyId: string;
  adapterName: string;          // e.g. "zoca", "consultative"
  anchorProduct: string;        // The core solution anchor
  pitchAngle: string;           // The exact framing angle
  strategicRationale: string;   // Why this fits the primary constraint
  actionItems: string[];        // Tactical immediate steps
}

export interface PheebsBrief {
  id: string;
  business: Business;
  diagnosis: Diagnosis;
  strategy: Strategy;
  recommendation: Recommendation;
  generatedAt: string;
  executionTimeMs: number;
}

export interface GenerationProgress {
  step: 'normalizing' | 'observing' | 'diagnosing' | 'strategizing' | 'adapting' | 'complete';
  message: string;
  timestamp: number;
}
