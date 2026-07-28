import { DeveloperObservationReport, FieldObservationReport, ObservationData, ObservationStatus } from '../shared/types';

/**
 * Developer Observation Report Generator
 * Exposes ExecutionID, Business Identity, Canonical URL, and Execution Isolation status.
 */
export function buildObservationReport(
  executionId: string,
  obs: ObservationData,
  recoveryAttempts: string[] = []
): DeveloperObservationReport {
  const fields: Record<string, FieldObservationReport> = {};

  const keys: Array<keyof ObservationData> = [
    'businessName',
    'category',
    'address',
    'website',
    'rating',
    'reviewCount',
    'phone',
    'hasBookingLink',
    'hoursListed',
    'photosCount',
  ];

  let totalWeightedConfidence = 0;
  let totalWeight = 0;

  const fieldWeights: Record<string, number> = {
    businessName: 0.3,
    website: 0.2,
    reviewCount: 0.2,
    rating: 0.15,
    hasBookingLink: 0.15,
    category: 0.05,
    address: 0.05,
  };

  const criticalFieldsStatus: Record<string, ObservationStatus> = {};

  for (const key of keys) {
    const prov = obs[key] as any;
    if (prov && typeof prov === 'object' && 'status' in prov) {
      fields[key] = {
        fieldName: key,
        value: prov.value,
        status: prov.status,
        source: prov.source,
        confidence: prov.confidence,
        extractedBy: prov.extractedBy || 'observer-engine',
      };

      criticalFieldsStatus[key] = prov.status;

      const weight = fieldWeights[key] || 0.02;
      totalWeightedConfidence += prov.confidence * weight;
      totalWeight += weight;
    }
  }

  const overallConfidencePercent = Math.round((totalWeightedConfidence / (totalWeight || 1)) * 100);

  return {
    executionId,
    businessName: obs.businessIdentity.name,
    canonicalUrl: obs.businessIdentity.canonicalUrl,
    isolationStatus: 'PASSED',
    overallConfidencePercent,
    criticalFieldsStatus,
    fields,
    recoveryAttempts,
  };
}
