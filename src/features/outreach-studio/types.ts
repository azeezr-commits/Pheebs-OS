export interface OutreachColdEmail {
  subject: string;
  body: string;
}

export interface OutreachFollowUpEmail {
  subject: string;
  body: string;
}

export interface OutreachColdCallScript {
  opening: string;
  permission: string;
  curiosityHook: string;
  discoveryQuestions: string[];
  meetingTransition: string;
}

export interface OutreachDiscoveryPrep {
  questions: string[];
  likelyObjections: string[];
  likelyGoals: string[];
  recommendedPositioning: string;
}

export interface OutreachAssets {
  coldEmail: OutreachColdEmail;
  followUpEmail: OutreachFollowUpEmail;
  linkedinMessage: string;
  coldCallScript: OutreachColdCallScript;
  voicemail: string;
  discoveryPrep: OutreachDiscoveryPrep;
  subjectLines: string[];
}
