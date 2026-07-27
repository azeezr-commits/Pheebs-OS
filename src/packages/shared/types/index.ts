/**
 * PHEEBS v0.0 — "Know where to start."
 * Domain Models & Reasoning Contract
 */

export type PrimaryConstraint = 'Visibility' | 'Trust' | 'Conversion' | 'Retention' | 'Operations' | 'Unknown';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface StageVersions {
  observer: string;
  evidence: string;
  prioritization: string;
  judgment: string;
  conversation: string;
  renderer: string;
}

export interface BusinessContext {
  industry: string;
  companySize: 'SMB' | 'Mid-Market' | 'Enterprise';
  salesMotion: 'Inbound' | 'Outbound' | 'Hybrid';
  targetPersona: string;
}

export interface ObservationData {
  businessName: string;
  category: string;
  address: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  hasBookingLink: boolean;
  hoursListed: boolean;
  photosCount: number;
  servicesList: string[];
  locationType: 'Single Location' | 'Multi Location' | 'Virtual / Mobile';
  socialLinks: string[];
  observedAt: string;
}

export interface NormalizedEvidence {
  id: string;
  type: string;        // e.g. 'booking_link', 'review_count', 'rating', 'photos'
  value: string | number | boolean;
  source: string;
  isPositive?: boolean;
  label?: string;
}

export interface PriorityItem {
  rank: number;
  evidenceId: string;
  evidenceType: string;
  label: string;
  importanceReason: string;
  weightScore: number;
}

export interface KnownUnknownAssumptions {
  known: string[];
  unknown: string[];        // Assets consumed by Stage 5 Conversation Engine
  assumptions: string[];
}

export interface ComputedConfidence {
  evidenceScore: number;     // 0.0 - 1.0
  coverage: number;          // 0.0 - 1.0
  consistency: number;       // 0.0 - 1.0
  finalScore: number;        // evidenceScore * coverage * consistency
  level: ConfidenceLevel;
  stars: string;             // e.g. '★★★★☆'
  signalCount: number;
}

export interface DiagnosisData {
  primaryConstraint: PrimaryConstraint;
  whyThis: string;
  whyNot: Array<{ topic: string; reason: string }>;
  falsificationEvidence: string[];
  computedConfidence: ComputedConfidence;
  knowledgeAssets: KnownUnknownAssumptions;
  judgmentVersion: string;
}

export interface ConversationObject {
  openingAngle: string;
  firstQuestion: string;
  discoveryQuestions: string[];
  avoidTopics: Array<{ topic: string; reason: string }>;
  hypothesis: string;
  successMetric: string;
  conversationVersion: string;
}

export interface EditorialOutput {
  headline: string;
  executiveSummary: string;
  openingScript: string;
  keyObjections: Array<{ objection: string; response: string }>;
  beforeYouAssume: string[];
  memorableFooter: string;
}

export interface GoldenRuleAnswers {
  whatObserved: string[];
  whyItMatters: string;
  whyMoreImportant: string;
  conversationToHave: string;
  evidenceProvingWrong: string[];
}

export interface ThinkingTrace {
  traceId: string;
  timestamp: string;
  stages: {
    stage0_context: BusinessContext;
    stage1_observations: ObservationData;
    stage2_evidence: NormalizedEvidence[];
    stage3_prioritization: PriorityItem[];
    stage4_judgment: DiagnosisData;
    stage5_conversation: ConversationObject;
  };
}

export interface ReasoningContract {
  id: string;
  context: BusinessContext;
  observations: ObservationData;
  evidence: NormalizedEvidence[];
  priorityRanking: PriorityItem[];
  diagnosis: DiagnosisData;
  conversation: ConversationObject;
  editorial: EditorialOutput;
  goldenRule: GoldenRuleAnswers;
  trace: ThinkingTrace;
  versions: StageVersions;
  generatedAt: string;
}

// PHEEBS v0.0 UI View ("Know where to start.")
export interface PheebsBrief {
  id: string;
  businessName: string;
  category: string;
  address: string;
  website: string;
  rating: number;
  reviewCount: number;

  // 1. START HERE
  startHere: {
    topic: string;
    headline: string;
    paragraph: string;
    primaryConstraint: PrimaryConstraint;
    confidence: ConfidenceLevel;
    confidenceStars: string;
    signalCount: number;
  };

  // 2. WHY?
  whyParagraph: string;

  // 3. EVIDENCE (Facts with ✓ / ✗)
  evidenceFacts: Array<{ label: string; isPositive: boolean }>;

  // 4. WHAT I'D ASK (Exactly 1 question)
  firstQuestion: string;

  // 5. DON'T WASTE TIME ON (The Moat)
  dontWasteTimeOn: {
    topic: string;
    reason: string;
  };

  // 6. CONFIDENCE
  confidenceStars: string;
  confidenceLevel: ConfidenceLevel;
  signalCount: number;

  // 7. UNKNOWNS
  unknowns: string[];

  // 8. MEMORABLE FOOTER
  memorableFooter: string;

  versions: StageVersions;
  generatedAt: string;
}

export interface ThinkingSequenceStep {
  label: string;
  status: 'pending' | 'active' | 'done';
}
