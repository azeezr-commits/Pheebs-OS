/**
 * Pheebs Core v0.5 — Production Architecture & Reasoning Contract
 *
 * (D)  Stage 0: Context Initialization
 * (D)  Stage 1: Observer (Verified facts)
 * (D)  Stage 2: Evidence Normalization (Raw primitives, no interpretation)
 * (AI) Stage 3: Prioritization (Applies Industry Knowledge Pack weights)
 * (AI) Stage 4: Judgment Engine (ONE constraint + Computed Confidence)
 * (AI) Stage 5: Conversation Engine (Outputs structured object, consumes Unknowns)
 * (D)  Stage 6: Brief Renderer (Receives ReasoningContract, renders UI brief & secret trace)
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

// Stage 2: Normalized Evidence (Strictly facts, NO interpretation!)
export interface NormalizedEvidence {
  id: string;
  type: string;        // e.g. 'booking_link', 'review_count', 'rating', 'photos'
  value: string | number | boolean;
  source: string;
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
}

export interface DiagnosisData {
  primaryConstraint: PrimaryConstraint;
  whyThis: string;
  whyNot: Array<{ constraint: PrimaryConstraint; reason: string }>;
  falsificationEvidence: string[]; // What evidence could prove us wrong?
  computedConfidence: ComputedConfidence;
  knowledgeAssets: KnownUnknownAssumptions;
  judgmentVersion: string;
}

// Stage 5 Output: Pure Structured Object (Not paragraphs!)
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
}

export interface GoldenRuleAnswers {
  whatObserved: string[];
  whyItMatters: string;
  whyMoreImportant: string;
  conversationToHave: string;
  evidenceProvingWrong: string[];
}

// Secret Debug & Audit Trace
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

// Projectable UI View (Disposable Brief)
export interface PheebsBrief {
  id: string;
  businessName: string;
  category: string;
  address: string;
  website: string;
  rating: number;
  reviewCount: number;

  // Recommendation First (Above fold)
  startHere: {
    topic: string;
    confidence: ConfidenceLevel;
    confidenceScore: number;
    why: string;
    primaryConstraint: PrimaryConstraint;
  };
  whyNot: Array<{ topic: string; reason: string }>;
  firstQuestion: string;

  // Supporting Context & Priority Ranking (Below fold)
  businessContext: string;
  evidence: NormalizedEvidence[];
  priorityRanking: PriorityItem[];
  falsificationEvidence: string[];
  unknowns: string[];
  timeline: Array<{ minute: string; action: string }>;
  questions: {
    primary: string;
    secondary: string[];
  };
  objections: Array<{ objection: string; response: string }>;
  opening: string;
  beforeYouAssume: string[];
  goldenRule: GoldenRuleAnswers;
  versions: StageVersions;
  generatedAt: string;
}

export interface ThinkingSequenceStep {
  label: string;
  status: 'pending' | 'active' | 'done';
}
