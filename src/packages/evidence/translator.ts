import { NormalizedEvidence, ObservationData } from '../shared/types';

export const EVIDENCE_VERSION = '1.2';

/**
 * Stage 2 — Evidence Normalizer (Deterministic)
 * Converts ONLY verified observation fields into normalized primitives.
 */
export async function normalizeEvidence(observations: ObservationData): Promise<NormalizedEvidence[]> {
  const evidence: NormalizedEvidence[] = [];

  // 1. Booking Link
  evidence.push({
    id: 'ev_booking_link',
    type: 'booking_link',
    value: observations.hasBookingLink.value ? 'present' : 'missing',
    source: observations.hasBookingLink.source,
    verificationStatus: observations.hasBookingLink.verified ? 'Verified' : 'Unable to Verify',
    confidence: observations.hasBookingLink.confidence,
  });

  // 2. Review Count
  if (observations.reviewCount && observations.reviewCount.verified) {
    evidence.push({
      id: 'ev_review_count',
      type: 'review_count',
      value: observations.reviewCount.value,
      source: observations.reviewCount.source,
      verificationStatus: 'Verified',
      confidence: observations.reviewCount.confidence,
    });
  }

  // 3. Rating
  if (observations.rating && observations.rating.verified) {
    evidence.push({
      id: 'ev_rating',
      type: 'rating',
      value: observations.rating.value,
      source: observations.rating.source,
      verificationStatus: 'Verified',
      confidence: observations.rating.confidence,
    });
  }

  // 4. Photos Count
  if (observations.photosCount && observations.photosCount.verified) {
    evidence.push({
      id: 'ev_photos',
      type: 'photos_count',
      value: observations.photosCount.value,
      source: observations.photosCount.source,
      verificationStatus: 'Verified',
      confidence: observations.photosCount.confidence,
    });
  }

  return evidence;
}
