/**
 * Pheebs Core - Genesis v0.2 Storage Engine
 * Persists Thinking Traces (Observation -> Signals -> Diagnosis -> Strategy -> Recommendation).
 */

import { BusinessRecord, Signal, ThinkingTrace, PheebsBrief } from '../shared/types';

const memoryStore = {
  businesses: new Map<string, BusinessRecord>(),
  signals: new Map<string, Signal[]>(),
  thinkingTraces: new Map<string, ThinkingTrace>()
};

export class StorageEngine {
  static async saveBusinessRecord(record: BusinessRecord): Promise<void> {
    memoryStore.businesses.set(record.id, record);
    memoryStore.signals.set(record.id, record.signals);
  }

  static async getBusinessRecord(id: string): Promise<BusinessRecord | null> {
    return memoryStore.businesses.get(id) || null;
  }

  static async saveThinkingTrace(trace: ThinkingTrace): Promise<void> {
    memoryStore.thinkingTraces.set(trace.id, trace);
  }

  static async getThinkingTrace(id: string): Promise<ThinkingTrace | null> {
    return memoryStore.thinkingTraces.get(id) || null;
  }

  static async listThinkingTraces(): Promise<ThinkingTrace[]> {
    return Array.from(memoryStore.thinkingTraces.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Projects a persisted ThinkingTrace into a disposable UI Brief
   */
  static projectToBrief(trace: ThinkingTrace): PheebsBrief {
    return {
      id: `brief_${trace.id}`,
      traceId: trace.id,
      business: trace.businessRecord,
      diagnosis: trace.diagnosis,
      strategy: trace.strategy,
      recommendation: trace.recommendation,
      generatedAt: trace.createdAt,
      executionTimeMs: trace.executionTimeMs
    };
  }
}
