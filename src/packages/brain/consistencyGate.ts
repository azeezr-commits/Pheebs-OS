import { DiagnosisData, Gate2Result, ObservationData } from '../shared/types';

/**
 * Gate 2 — Consistency Gate (Before Speaking)
 * Audits generated judgment statements against verified observations.
 * Rule: Unknown observations may ONLY generate questions—NEVER conclusions!
 */
export function evaluateConsistencyGate(
  diagnosis: DiagnosisData,
  observations: ObservationData
): { gateResult: Gate2Result; sanitizedDiagnosis: DiagnosisData } {
  const rejectedClaims: string[] = [];
  const correctedClaims: string[] = [];

  const isReviewsVerified = observations.reviewCount?.verified && (observations.reviewCount.value || 0) > 0;
  let whyThis = diagnosis.whyThis;

  // Audit Rule 1: Contradiction Detection between Review Count and Trust Claims
  if (!isReviewsVerified && whyThis.toLowerCase().includes('reviews prove')) {
    rejectedClaims.push('Claiming "reviews prove trust" when review count is Unknown');
    whyThis = 'Customer review volume is currently unverified from the public profile. Intake channel and online booking infrastructure are the primary verifiable constraints.';
    correctedClaims.push('Replaced review trust claim with unverified data warning');
  }

  const sanitizedDiagnosis: DiagnosisData = {
    ...diagnosis,
    whyThis,
  };

  return {
    gateResult: {
      passed: rejectedClaims.length === 0,
      rejectedClaims,
      correctedClaims,
    },
    sanitizedDiagnosis,
  };
}
