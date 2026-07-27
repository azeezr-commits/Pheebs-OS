import { DiagnosisData, ObservationData, ObservationStatus, RealityCheckResult } from '../shared/types';

/**
 * Reality Check (Before Speaking)
 * Audits generated judgment conclusions against verified facts.
 * Log: [Reality Check] Status: PASSED
 */
export function executeRealityCheck(
  diagnosis: DiagnosisData,
  observations: ObservationData
): { realityCheckResult: RealityCheckResult; sanitizedDiagnosis: DiagnosisData } {
  const rejectedClaims: string[] = [];
  const correctedClaims: string[] = [];

  const isReviewsVerified = observations.reviewCount?.status === ObservationStatus.VERIFIED || observations.reviewCount?.status === ObservationStatus.PLAUSIBLE;
  let whyThis = diagnosis.whyThis;

  // Audit Check: Contradiction Detection between Review Count and Trust Claims
  if (!isReviewsVerified && whyThis.toLowerCase().includes('reviews prove')) {
    rejectedClaims.push('Claiming "reviews prove trust" when review count is UNVERIFIED / MISSING');
    whyThis = 'Customer review volume is currently unverified from the public profile. Intake channel and online booking infrastructure are the primary verifiable constraints.';
    correctedClaims.push('Replaced review trust claim with unverified data warning');
  }

  const sanitizedDiagnosis: DiagnosisData = {
    ...diagnosis,
    whyThis,
  };

  const passed = rejectedClaims.length === 0;
  console.log(`[Reality Check] Status: ${passed ? 'PASSED' : 'CORRECTED'}`);

  return {
    realityCheckResult: {
      passed,
      rejectedClaims,
      correctedClaims,
    },
    sanitizedDiagnosis,
  };
}
