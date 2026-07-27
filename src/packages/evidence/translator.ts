import { NormalizedEvidence, ObservationData } from '../shared/types';

export const EVIDENCE_VERSION = '1.1';

/**
 * Stage 2 — Evidence Normalizer (Deterministic)
 * Normalizes verified observations into standardized primitives.
 */
export async function normalizeEvidence(observations: ObservationData): Promise<NormalizedEvidence[]> {
  const evidence: NormalizedEvidence[] = [];

  // 1. Booking Link
  evidence.push({
    id: 'ev_booking_link',
    type: 'booking_link',
    value: observations.hasBookingLink ? 'present' : 'missing',
    source: 'Website & GBP Audit',
    verificationStatus: observations.verifications.bookingLink?.status || 'Unable to Verify',
  });

  // 2. Review Volume Number
  if (observations.reviewCount !== undefined) {
    evidence.push({
      id: 'ev_review_count',
      type: 'review_count',
      value: observations.reviewCount,
      source: 'Google Business Profile',
      verificationStatus: observations.verifications.reviewCount?.status || 'Verified',
    });
  }

  // 3. Average Star Rating
  if (observations.rating !== undefined) {
    evidence.push({
      id: 'ev_rating',
      type: 'rating',
      value: observations.rating,
      source: 'Google Business Profile',
      verificationStatus: observations.verifications.rating?.status || 'Verified',
    });
  }

  // 4. Media Footprint Count
  evidence.push({
    id: 'ev_photos',
    type: 'photos_count',
    value: observations.photosCount,
    source: 'GBP Metadata',
    verificationStatus: 'Verified',
  });

  // 5. Phone Verification
  if (observations.phone) {
    evidence.push({
      id: 'ev_phone',
      type: 'phone',
      value: observations.phone,
      source: 'Google Business Profile',
      verificationStatus: 'Verified',
    });
  }

  return evidence;
}
