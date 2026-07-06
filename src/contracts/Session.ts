export type SessionState = 'Draft' | 'Active' | 'Paused' | 'Completed' | 'Archived';

export interface SessionEventLog {
  name: string;
  timestamp: string;
  payload: any;
}

export interface SessionReflection {
  whatWentWell: string[];
  risks: string[];
  nextQuestions: string[];
}

export interface Session {
  id: string;
  type: 'analyzer' | 'mock' | 'live' | 'coach';
  status: SessionState;
  createdAt: string;
  updatedAt: string;
  title: string;
  businessName: string;
  summary: string;
  anchor: string;
  confidence: number;
  evidence: string[];
  timeline: SessionEventLog[];
  collections: string[]; // Folder list mapping
  tags: string[];
  pinned: boolean;
  archived: boolean;
  privateNotes: string;
  reflection: SessionReflection | null;
  payload: any;
  events: SessionEventLog[];
}

export interface SessionManager {
  createSession(type: Session['type'], initialPayload?: any): Promise<Session>;
  startSession(id: string): Promise<Session>;
  pauseSession(id: string): Promise<Session>;
  updateSession(id: string, payload: any): Promise<Session>;
  completeSession(id: string, finalPayload?: any): Promise<Session>;
  archiveSession(id: string): Promise<Session>;
  pinSession(id: string, pinned: boolean): Promise<Session>;
  viewSession(id: string): Promise<Session>;
  deleteSession(id: string): Promise<void>;
  getSession(id: string): Promise<Session | null>;
  listSessions(type?: Session['type']): Promise<Session[]>;
}
