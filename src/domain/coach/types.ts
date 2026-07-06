export interface CoachingFeedback {
  sessionId: string;
  score: number;
  objectionsHandled: {
    objection: string;
    response: string;
    grade: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    feedback: string;
  }[];
  mistakes: string[];
  tips: string[];
}
