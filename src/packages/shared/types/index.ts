/**
 * PHEEBS v0.0 — Product Reliability Initiative
 * Domain Models, Evidence Verification, and Reasoning Contract
 */

export type PrimaryConstraint = 'Visibility' | 'Trust' | 'Conversion' | 'Retention' | 'Operations' | 'Unknown';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type VerificationStatus = 'Verified' | 'Unknown' | 'Unable to Verify';

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

export interface FieldVerification {
  fieldName: string;
  value: string | number | boolean | undefined;
  status: VerificationStatus;
  source: string;
}

export interface ObservationData {
  businessName: string;
  category: string;
  address: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  phone?: string;
  hasBookingLink: boolean;
  hoursListed: boolean;
  photosCount: number;
  servicesList: string[];
  locationType: 'Single Location' | 'Multi Location' | 'Virtual / Mobile';
  socialLinks: string[];
  observedAt: string;
  verifications: Record<string, FieldVerification>;
}

export interface NormalizedEvidence {
  id: string;
  type: string;
  value: string | number | boolean;
  source: string;
  verificationStatus: VerificationStatus;
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
  unknown: string[];
  assumptions: string[];
}

export interface ComputedConfidence {
  evidenceCoveragePercent: number; // e.g. 94% (Verified fields / Total required)
  verifiedSignalsCount: number;    // e.g. 18
  totalSignalsCount: number;       // e.g. 19
  reasoningConfidence: ConfidenceLevel;
  stars: string;                   // e.g. '★★★★☆'
  finalScore: number;
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
  evidenceCoveragePercent: number;
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

// PHEEBS v0.0 UI View
export interface PheebsBrief {
  id: string;
  businessName: string;
  category: string;
  address: string;
  website: string;
  rating?: number;
  reviewCount?: number;
  traceId?: string;

  // 1. START HERE
  startHere: {
    topic: string;
    headline: string;
    paragraph: string;
    primaryConstraint: PrimaryConstraint;
    confidence: ConfidenceLevel;
    confidenceStars: string;
    evidenceCoveragePercent: number;
    verifiedSignalsCount: number;
  };

  // 2. WHY?
  whyParagraph: string;

  // 3. EVIDENCE
  evidenceFacts: Array<{ label: string; isPositive: boolean; status: VerificationStatus }>;

  // 4. WHAT I'D ASK
  firstQuestion: string;

  // 5. DON'T WASTE TIME ON
  dontWasteTimeOn: {
    topic: string;
    reason: string;
  };

  // 6. CONFIDENCE
  confidenceStars: string;
  confidenceLevel: ConfidenceLevel;
  evidenceCoveragePercent: number;
  verifiedSignalsCount: number;

  // 7. UNKNOWNS
  unknowns: string[];

  // 8. MEMORABLE FOOTER
  memorableFooter: string;

  // Developer Audit Data
  fieldVerifications: Record<string, FieldVerification>;

  versions: StageVersions;
  generatedAt: string;
}

export interface ThinkingSequenceStep {
  label: string;
  status: 'pending' | 'active' | 'done';
}
