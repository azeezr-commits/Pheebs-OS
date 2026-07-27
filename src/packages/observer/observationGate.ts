import { Gate1Result, ObservationData } from '../shared/types';

/**
 * Gate 1 — Observation Validation Gate (Before Reasoning)
 * Evaluates plausibility of extracted fields before evidence normalization.
 * Stops pipeline immediately if critical fields fail.
 */
export function evaluateObservationGate(obs: ObservationData): Gate1Result {
  const rejectedFields: string[] = [];

  // 1. Business Name Check
  const bName = (obs.businessName.value || '').trim();
  if (!obs.businessName.verified || bName.toLowerCase() === 'maps' || bName.toLowerCase() === 'google' || bName.length < 3) {
    rejectedFields.push('businessName');
  }

  // 2. Website URL Check (maps.app.goo.gl is NOT a company website!)
  if (obs.website) {
    const webVal = (obs.website.value || '').toLowerCase();
    if (webVal.includes('maps.app.goo.gl') || webVal.includes('google.com/maps')) {
      rejectedFields.push('website');
      obs.website.verified = false;
      obs.website.confidence = 0.12;
    }
  }

  // 3. Address Check
  const addrVal = (obs.address.value || '').trim();
  if (addrVal === 'Metropolitan District' || addrVal.length < 3) {
    rejectedFields.push('address');
  }

  // Critical failure if Business Name is invalid
  if (rejectedFields.includes('businessName')) {
    return {
      passed: false,
      failureReason: "I couldn't confidently identify the business. Please provide another Google Business Profile.",
      rejectedFields,
    };
  }

  return {
    passed: true,
    rejectedFields,
  };
}
