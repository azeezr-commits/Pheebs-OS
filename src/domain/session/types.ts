export type SessionType = 'analyzer' | 'mock' | 'live' | 'coach';
export type SessionState = 'Draft' | 'Active' | 'Paused' | 'Completed' | 'Archived';

export interface DialogueTurn {
  sender: 'AE' | 'Prospect' | 'Coach';
  text: string;
  timestamp: number;
}
