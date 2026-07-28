import { BusinessContext, ObservationData } from '../shared/types';
import { RealityAdapter } from './realityAdapter';

export const OBSERVER_VERSION = '3.0';

/**
 * Stage 0 — Context (Deterministic)
 */
export async function initializeContext(executionId: string, category: string): Promise<BusinessContext> {
  const catLower = category.toLowerCase();
  let industry = 'General Local Business';
  let targetPersona = 'Owner / Practice Manager';

  if (catLower.includes('dental') || catLower.includes('ortho')) {
    industry = 'dental';
    targetPersona = 'Managing Dentist / Clinical Owner';
  } else if (catLower.includes('chiro') || catLower.includes('spine')) {
    industry = 'chiropractic';
    targetPersona = 'Lead Chiropractor';
  } else if (catLower.includes('salon') || catLower.includes('brow') || catLower.includes('spa') || catLower.includes('skin')) {
    industry = 'salon';
    targetPersona = 'Salon Founder / Director';
  } else if (catLower.includes('restaurant') || catLower.includes('cafe')) {
    industry = 'restaurant';
    targetPersona = 'Restaurant GM / Proprietor';
  }

  return {
    executionId,
    industry,
    companySize: 'SMB',
    salesMotion: 'Outbound',
    targetPersona,
  };
}

/**
 * Stage 1 — Observer (Delegates 100% to Reality Adapter v0)
 * NO MOCK DICTIONARIES. NO FABRICATED NUMBERS.
 */
export async function observeBusinessFacts(
  executionId: string,
  url: string
): Promise<{ observations: ObservationData; recoveryAttempts: string[] }> {
  return RealityAdapter.fetchAndObserve(executionId, url);
}
