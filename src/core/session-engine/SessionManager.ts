import type { Session, SessionManager as ISessionManager, SessionState } from '../../contracts/Session';
import type { Storage } from '../../contracts/Storage';
import { globalEventBus } from '../event-bus/EventBus';

export class SessionManager implements ISessionManager {
  private storage: Storage;
  private STORAGE_KEY = 'pheebs_sessions';

  constructor(storage: Storage) {
    this.storage = storage;
  }

  private async getSessionList(): Promise<Session[]> {
    const list = await this.storage.getItem<Session[]>(this.STORAGE_KEY);
    return list || [];
  }

  private async saveSessionList(list: Session[]): Promise<void> {
    await this.storage.setItem(this.STORAGE_KEY, list);
  }

  async createSession(type: Session['type'], initialPayload: any = {}): Promise<Session> {
    const list = await this.getSessionList();
    const now = new Date().toISOString();
    
    // Extract domain keys if supplied, otherwise default
    const businessName = initialPayload.businessName || initialPayload.briefing?.businessName || 'General';
    const title = initialPayload.title || `${type.toUpperCase()} - ${businessName}`;
    const summary = initialPayload.summary || initialPayload.briefing?.executiveSummary || '';
    const anchor = initialPayload.anchor || initialPayload.briefing?.recommendedAnchor || '';
    const confidence = initialPayload.confidence || initialPayload.briefing?.confidenceScore || 0;
    const evidence = initialPayload.evidence || initialPayload.briefing?.evidenceUsed || [];
    const tags = initialPayload.tags || [];
    const collections = initialPayload.collections || [];
    const privateNotes = initialPayload.privateNotes || '';
    const reflection = initialPayload.reflection || null;

    const newSession: Session = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      status: 'Draft',
      createdAt: now,
      updatedAt: now,
      title,
      businessName,
      summary,
      anchor,
      confidence,
      evidence,
      timeline: [
        {
          name: 'Created',
          timestamp: now,
          payload: {}
        }
      ],
      collections,
      tags,
      pinned: false,
      archived: false,
      privateNotes,
      reflection,
      payload: initialPayload,
      events: [
        {
          name: 'session:created',
          timestamp: now,
          payload: { initialPayload }
        }
      ]
    };

    list.unshift(newSession);
    await this.saveSessionList(list);

    globalEventBus.emit('session:created', {
      sessionId: newSession.id,
      type: newSession.type,
      payload: initialPayload
    });

    return newSession;
  }

  async startSession(id: string): Promise<Session> {
    return this.transitionState(id, 'Active', 'session:started', 'Active');
  }

  async pauseSession(id: string): Promise<Session> {
    return this.transitionState(id, 'Paused', 'session:paused', 'Paused');
  }

  async updateSession(id: string, payload: any): Promise<Session> {
    const list = await this.getSessionList();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Session with id "${id}" not found.`);
    }

    const session = list[idx];
    const now = new Date().toISOString();

    // Map payload updates to direct root properties if they exist
    const businessName = payload.businessName || payload.briefing?.businessName || session.businessName;
    const title = payload.title || session.title;
    const summary = payload.summary || payload.briefing?.executiveSummary || session.summary;
    const anchor = payload.anchor || payload.briefing?.recommendedAnchor || session.anchor;
    const confidence = payload.confidence !== undefined ? payload.confidence : (payload.briefing?.confidenceScore || session.confidence);
    const evidence = payload.evidence || payload.briefing?.evidenceUsed || session.evidence;
    const tags = payload.tags || session.tags;
    const collections = payload.collections || session.collections;
    const privateNotes = payload.privateNotes !== undefined ? payload.privateNotes : session.privateNotes;
    const reflection = payload.reflection !== undefined ? payload.reflection : session.reflection;
    const archived = payload.archived !== undefined ? payload.archived : session.archived;
    const pinned = payload.pinned !== undefined ? payload.pinned : session.pinned;

    // Build timeline updates. Check if a major analytical shift or edit happened
    const timelineUpdates = [...session.timeline];
    if (payload.briefing) {
      timelineUpdates.push({ name: 'Analyzed', timestamp: now, payload: {} });
      timelineUpdates.push({ name: 'Brief Generated', timestamp: now, payload: {} });
    } else {
      timelineUpdates.push({ name: 'Edited', timestamp: now, payload: {} });
    }

    const updatedSession: Session = {
      ...session,
      updatedAt: now,
      title,
      businessName,
      summary,
      anchor,
      confidence,
      evidence,
      timeline: timelineUpdates,
      collections,
      tags,
      pinned,
      archived,
      privateNotes,
      reflection,
      payload: {
        ...session.payload,
        ...payload
      },
      events: [
        ...session.events,
        {
          name: 'session:updated',
          timestamp: now,
          payload
        }
      ]
    };

    list[idx] = updatedSession;
    await this.saveSessionList(list);

    globalEventBus.emit('session:updated', {
      sessionId: id,
      payload
    });

    return updatedSession;
  }

  async completeSession(id: string, finalPayload: any = {}): Promise<Session> {
    return this.transitionState(id, 'Completed', 'session:completed', 'Saved', finalPayload);
  }

  async archiveSession(id: string): Promise<Session> {
    const list = await this.getSessionList();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Session with id "${id}" not found.`);
    }

    const session = list[idx];
    const now = new Date().toISOString();
    const targetState = !session.archived; // Toggle archive status

    const updatedSession: Session = {
      ...session,
      archived: targetState,
      status: targetState ? 'Archived' : 'Completed',
      updatedAt: now,
      timeline: [
        ...session.timeline,
        { name: 'Archived', timestamp: now, payload: { archived: targetState } }
      ],
      events: [
        ...session.events,
        { name: 'session:archived', timestamp: now, payload: { archived: targetState } }
      ]
    };

    list[idx] = updatedSession;
    await this.saveSessionList(list);

    globalEventBus.emit('session:archived', {
      sessionId: id,
      archived: targetState
    });

    globalEventBus.emit('session:closed', {
      sessionId: id,
      status: targetState ? 'Archived' : 'Completed',
      payload: updatedSession.payload
    });

    return updatedSession;
  }

  async pinSession(id: string, pinned: boolean): Promise<Session> {
    const list = await this.getSessionList();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Session with id "${id}" not found.`);
    }

    const session = list[idx];
    const now = new Date().toISOString();

    const updatedSession: Session = {
      ...session,
      pinned,
      updatedAt: now,
      timeline: [
        ...session.timeline,
        { name: pinned ? 'Pinned' : 'Unpinned', timestamp: now, payload: {} }
      ],
      events: [
        ...session.events,
        { name: 'session:pinned', timestamp: now, payload: { pinned } }
      ]
    };

    list[idx] = updatedSession;
    await this.saveSessionList(list);

    globalEventBus.emit('session:pinned', {
      sessionId: id,
      pinned
    });

    return updatedSession;
  }

  async viewSession(id: string): Promise<Session> {
    const list = await this.getSessionList();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Session with id "${id}" not found.`);
    }

    const session = list[idx];
    const now = new Date().toISOString();

    // Check if last event was 'Viewed' in the last 10 seconds to avoid spamming the timeline
    const lastEvent = session.timeline[session.timeline.length - 1];
    const isSpam = lastEvent && lastEvent.name === 'Viewed' && 
                   (Date.now() - new Date(lastEvent.timestamp).getTime() < 10000);

    const updatedSession: Session = {
      ...session,
      timeline: isSpam ? session.timeline : [
        ...session.timeline,
        { name: 'Viewed', timestamp: now, payload: {} }
      ],
      events: [
        ...session.events,
        { name: 'session:viewed', timestamp: now, payload: {} }
      ]
    };

    list[idx] = updatedSession;
    await this.saveSessionList(list);

    globalEventBus.emit('session:opened', { sessionId: id });
    globalEventBus.emit('session:viewed', { sessionId: id });

    return updatedSession;
  }

  async deleteSession(id: string): Promise<void> {
    const list = await this.getSessionList();
    const filtered = list.filter((s) => s.id !== id);
    await this.saveSessionList(filtered);

    globalEventBus.emit('session:deleted', { sessionId: id });
  }

  private async transitionState(
    id: string,
    targetState: SessionState,
    eventName: string,
    timelineName: string,
    additionalPayload: any = {}
  ): Promise<Session> {
    const list = await this.getSessionList();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Session with id "${id}" not found.`);
    }

    const session = list[idx];
    const now = new Date().toISOString();

    const updatedSession: Session = {
      ...session,
      status: targetState,
      updatedAt: now,
      timeline: [
        ...session.timeline,
        { name: timelineName, timestamp: now, payload: additionalPayload }
      ],
      payload: {
        ...session.payload,
        ...additionalPayload
      },
      events: [
        ...session.events,
        {
          name: eventName,
          timestamp: now,
          payload: additionalPayload
        }
      ]
    };

    list[idx] = updatedSession;
    await this.saveSessionList(list);

    if (targetState === 'Completed' || targetState === 'Archived') {
      globalEventBus.emit('session:closed', {
        sessionId: id,
        status: targetState,
        payload: updatedSession.payload
      });
    } else {
      globalEventBus.emit('session:updated', {
        sessionId: id,
        payload: { status: targetState, ...additionalPayload }
      });
    }

    return updatedSession;
  }

  async getSession(id: string): Promise<Session | null> {
    const list = await this.getSessionList();
    const found = list.find((s) => s.id === id);
    return found || null;
  }

  async listSessions(type?: Session['type']): Promise<Session[]> {
    const list = await this.getSessionList();
    if (type) {
      return list.filter((s) => s.type === type);
    }
    return list;
  }
}
