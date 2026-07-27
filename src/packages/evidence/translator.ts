import { NormalizedEvidence, ObservationData } from '../shared/types';

export const EVIDENCE_VERSION = '1.0';

/**
 * Stage 2 — Evidence Normalizer (Deterministic)
 * Normalizes raw observations into standardized facts.
 * Rule: STRICTLY NO INTERPRETATION. (No 'Friction' or 'Deficit' labels!)
 * Interpretation belongs strictly in Stage 3 (Prioritization).
 */
export async function normalizeEvidence(observations: ObservationData): Promise<NormalizedEvidence[]> {
  const evidence: NormalizedEvidence[] = [];

  // 1. Booking Link State
  evidence.push({
    id: 'ev_booking_link',
    type: 'booking_link',
    value: observations.hasBookingLink ? 'present' : 'missing',
    source: 'Website & GBP Audit',
  });

  // 2. Review Volume Number
  if (observations.reviewCount !== undefined) {
    evidence.push({
      id: 'ev_review_count',
      type: 'review_count',
      value: observations.reviewCount,
      source: 'Google Business Profile',
    });
  }

  // 3. Average Star Rating
  if (observations.rating !== undefined) {
    evidence.push({
      id: 'ev_rating',
      type: 'rating',
      value: observations.rating,
      source: 'Google Business Profile',
    });
  }

  // 4. Media Footprint Count
  evidence.push({
    id: 'ev_photos',
    type: 'photos_count',
    value: observations.photosCount,
    source: 'GBP Metadata',
  });

  // 5. Operating Hours State
  evidence.push({
    id: 'ev_hours',
    type: 'hours_listed',
    value: observations.hoursListed ? 'verified' : 'unspecified',
    source: 'GBP Metadata',
  });

  // 6. Location Footprint Type
  evidence.push({
    id: 'ev_location_type',
    type: 'location_type',
    value: observations.locationType,
    source: 'Directory Audit',
  });

  return evidence;
}
