/**
 * PHEEBS Permanent Production Architecture
 * 5-State Observation Quality, Field Provenance & Reasoning Contract
 */

export enum ObservationStatus {
  VERIFIED = 'VERIFIED',
  PLAUSIBLE = 'PLAUSIBLE',
  QUESTIONABLE = 'QUESTIONABLE',
  INVALID = 'INVALID',
  MISSING = 'MISSING',
}

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

export interface Provenance<T = any> {
  value: T;
  source: string;
  extractedBy: string;
  observedAt: string;
  normalizedBy: string;
  confidence: number; // 0.0 to 1.0
  status: ObservationStatus;
}

export interface ObservationData {
  businessName: Provenance<string>;
  category: Provenance<string>;
  address: Provenance<string>;
  website?: Provenance<string>;
  rating?: Provenance<number>;
  reviewCount?: Provenance<number>;
  phone?: Provenance<string>;
  hasBookingLink: Provenance<boolean>;
  hoursListed: Provenance<boolean>;
  photosCount: Provenance<number>;
  servicesList: Provenance<string[]>;
  locationType: Provenance<'Single Location' | 'Multi Location' | 'Virtual / Mobile'>;
  socialLinks: Provenance<string[]>;
  observedAt: string;
}

export interface FieldObservationReport {
  fieldName: string;
  value: any;
  status: ObservationStatus;
  source: string;
  confidence: number;
  extractedBy: string;
}

export interface DeveloperObservationReport {
  overallConfidencePercent: number; // Weighted by field dominance
  criticalFieldsStatus: Record<string, ObservationStatus>;
  fields: Record<string, FieldObservationReport>;
  recoveryAttempts: string[];
}

export interface RealityCheckResult {
  passed: boolean;
  rejectedClaims: string[];
  correctedClaims: string[];
}

export interface NormalizedEvidence {
  id: string;
  type: string;
  value: string | number | boolean;
  source: string;
  verificationStatus: ObservationStatus;
  confidence: number;
  strength?: 'High' | 'Medium' | 'Low';
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

export interface KnownUnknownHypotheses {
  known: string[];
  unknown: string[];
  hypotheses: string[];
}

export interface ComputedConfidence {
  evidenceCoveragePercent: number;
  verifiedSignalsCount: number;
  totalSignalsCount: number;
  reasoningConfidence: ConfidenceLevel;
  stars: string;
  finalScore: number;
}

export interface DiagnosisData {
  primaryConstraint: PrimaryConstraint;
  whyThis: string;
  whyNot: Array<{ topic: string; reason: string }>;
  falsificationEvidence: string[];
  computedConfidence: ComputedConfidence;
  knowledgeAssets: KnownUnknownHypotheses;
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
  realityCheckStatus: RealityCheckResult;
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
  evidenceFacts: Array<{ label: string; isPositive: boolean; status: ObservationStatus }>;

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

  // Developer Observation Report
  observationReport: DeveloperObservationReport;

  versions: StageVersions;
  generatedAt: string;
}
