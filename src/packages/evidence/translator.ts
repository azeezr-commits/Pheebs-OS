import { NormalizedEvidence, ObservationData, ObservationStatus } from '../shared/types';

export const EVIDENCE_VERSION = '2.1';

/**
 * Stage 2 — Evidence Builder (Decouples Raw Observations)
 * Attaches executionId to every evidence primitive for isolation checking.
 */
export async function buildEvidence(observations: ObservationData): Promise<NormalizedEvidence[]> {
  const { executionId } = observations;
  const evidence: NormalizedEvidence[] = [];

  // 1. Intake Channel & Booking CTA
  evidence.push({
    executionId,
    id: 'ev_booking_link',
    type: 'booking_link',
    value: observations.hasBookingLink.value ? 'present' : 'missing',
    source: observations.hasBookingLink.source,
    verificationStatus: observations.hasBookingLink.status,
    confidence: observations.hasBookingLink.confidence,
    strength: observations.hasBookingLink.value ? 'High' : 'Low',
    isPositive: observations.hasBookingLink.value,
    label: 'Intake Channel & Booking Infrastructure',
  });

  // 2. Social Proof Density
  if (observations.reviewCount && observations.reviewCount.status !== ObservationStatus.MISSING && observations.reviewCount.status !== ObservationStatus.INVALID) {
    const revCount = observations.reviewCount.value || 0;
    const strength = revCount >= 100 ? 'High' : revCount >= 30 ? 'Medium' : 'Low';

    evidence.push({
      executionId,
      id: 'ev_review_count',
      type: 'review_count',
      value: revCount,
      source: observations.reviewCount.source,
      verificationStatus: observations.reviewCount.status,
      confidence: observations.reviewCount.confidence,
      strength,
      isPositive: revCount >= 30,
      label: 'Social Proof Density & Customer Ratings',
    });
  }

  // 3. Customer Sentiment Rating
  if (observations.rating && observations.rating.status !== ObservationStatus.MISSING && observations.rating.status !== ObservationStatus.INVALID) {
    const ratingVal = observations.rating.value || 0;
    evidence.push({
      executionId,
      id: 'ev_rating',
      type: 'rating',
      value: ratingVal,
      source: observations.rating.source,
      verificationStatus: observations.rating.status,
      confidence: observations.rating.confidence,
      strength: ratingVal >= 4.5 ? 'High' : 'Medium',
      isPositive: ratingVal >= 4.0,
      label: 'Public Customer Sentiment Rating',
    });
  }

  return evidence;
}
