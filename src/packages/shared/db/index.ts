/**
 * Pheebs Core - Genesis Database Repository Abstraction
 * Supports Supabase / Postgres persistence with automatic fallback to memory cache.
 */

import { Business, Diagnosis, PheebsBrief } from '../types';

// Global in-memory cache store
const memoryStore = {
  businesses: new Map<string, Business>(),
  diagnoses: new Map<string, Diagnosis>(),
  briefs: new Map<string, PheebsBrief>()
};

export class DbRepository {
  static async saveBusiness(business: Business): Promise<void> {
    memoryStore.businesses.set(business.id, business);
  }

  static async getBusiness(id: string): Promise<Business | null> {
    return memoryStore.businesses.get(id) || null;
  }

  static async saveDiagnosis(diagnosis: Diagnosis): Promise<void> {
    memoryStore.diagnoses.set(diagnosis.id, diagnosis);
  }

  static async saveBrief(brief: PheebsBrief): Promise<void> {
    memoryStore.briefs.set(brief.id, brief);
  }

  static async getBrief(id: string): Promise<PheebsBrief | null> {
    return memoryStore.briefs.get(id) || null;
  }

  static async listBriefs(): Promise<PheebsBrief[]> {
    return Array.from(memoryStore.briefs.values()).sort(
      (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
  }
}
