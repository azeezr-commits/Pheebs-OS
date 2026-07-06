import type { AEBriefing } from '../domain/business/types';

export interface BusinessAnalyzer {
  performAudit(
    name: string,
    url: string,
    gpbUrl: string,
    niche: string,
    aeNotes: string
  ): Promise<AEBriefing>;
}
