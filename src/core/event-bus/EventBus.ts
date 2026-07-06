export type PheebsEventMap = {
  'session:created': { sessionId: string; type: 'analyzer' | 'mock' | 'live' | 'coach'; payload: any };
  'session:updated': { sessionId: string; payload: any };
  'session:closed': { sessionId: string; status: 'Completed' | 'Failed' | 'Archived'; payload: any };
  'session:opened': { sessionId: string };
  'session:pinned': { sessionId: string; pinned: boolean };
  'session:archived': { sessionId: string; archived: boolean };
  'session:deleted': { sessionId: string };
  'session:viewed': { sessionId: string };
  'analysis:completed': { businessId: string; website: string; score: number };
  'coach:feedback': { sessionId: string; score: number; mistakesCount: number };
};

export type EventCallback<K extends keyof PheebsEventMap> = (data: PheebsEventMap[K]) => void | Promise<void>;

export class EventBus {
  private listeners: { [K in keyof PheebsEventMap]?: EventCallback<K>[] } = {};

  subscribe<K extends keyof PheebsEventMap>(event: K, callback: EventCallback<K>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [] as any;
    }
    (this.listeners[event] as any).push(callback);
    return () => this.unsubscribe(event, callback);
  }

  unsubscribe<K extends keyof PheebsEventMap>(event: K, callback: EventCallback<K>): void {
    const list = this.listeners[event];
    if (!list) return;
    this.listeners[event] = (list as any).filter((cb: any) => cb !== callback);
  }

  emit<K extends keyof PheebsEventMap>(event: K, data: PheebsEventMap[K]): void {
    const list = this.listeners[event];
    if (!list) return;
    list.forEach((callback) => {
      try {
        const result = callback(data);
        if (result instanceof Promise) {
          result.catch((err) => {
            console.error(`Unhandled async exception in EventBus for ${event}:`, err);
          });
        }
      } catch (err) {
        console.error(`Unhandled error in EventBus listener for ${event}:`, err);
      }
    });
  }
}

export const globalEventBus = new EventBus();
