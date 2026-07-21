/**
 * Brief by Pheebs — Domain Models
 * Recommendation-first sales preparation brief.
 */

export interface WhyNotItem {
  topic: string;
  reason: string;
}

export interface TimelineStep {
  minute: string;
  action: string;
}

export interface ObjectionItem {
  objection: string;
  response: string;
}

export interface BriefByPheebs {
  id: string;
  businessName: string;
  category: string;
  address: string;
  website: string;
  rating: number;
  reviewCount: number;

  // SECTION 1: Above the fold (No scrolling required)
  startHere: {
    topic: string;
    confidence: 'High' | 'Medium';
    why: string;
  };
  whyNot: WhyNotItem[];
  firstQuestion: string;

  // SECTION 2: Below the fold (Supporting context & preparation)
  businessContext: string;
  evidence: string[];
  timeline: TimelineStep[];
  questions: {
    primary: string;
    secondary: string[];
  };
  objections: ObjectionItem[]; // Exactly 3 objections
  opening: string;
  beforeYouAssume: string[];
  generatedAt: string;
}

export interface ThinkingSequenceStep {
  label: string;
  status: 'pending' | 'active' | 'done';
}
