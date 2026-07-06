/**
 * Coach Engine Contract
 * Reserved for Sprint 5 (Coach Piyush Integration)
 */
export interface CoachFeedback {
  sessionId: string;
  gradingScore: number;
  objectionsGraded: {
    objection: string;
    verdict: 'Excellent' | 'Fair' | 'Poor';
    critique: string;
  }[];
  mistakes: string[];
}

export interface CoachEngine {
  analyzeSession(sessionId: string): Promise<CoachFeedback>;
}
