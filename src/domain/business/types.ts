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
}
