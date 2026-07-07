export interface AEBriefing {
  id: string;
  businessName: string;
  website: string;
  gpbUrl: string;
  niche: string;
  executiveSummary: string;
  likelyRevenueLeak: string;
  googleProfileFindings: string[];
  websiteFindings: string[];
  bookingFindings: string[];
  reviewFindings: string[];
  discoveryQuestions: string[];
  recommendedAnchor: string;
  confidenceScore: number;
  evidenceUsed: string[];
  createdAt: string;

  // Brain v0.1 properties
  brainKnowns?: string[];
  brainUnknowns?: string[];
  brainThinkingExplanation?: string;
  brainThinkingEvidence?: string[];
  brainThinkingMissing?: string[];
  brainThinkingInvestigation?: string;
  brainNextQuestion?: string;
}
