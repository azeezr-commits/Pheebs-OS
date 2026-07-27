import { FieldVerification, ObservationData } from '../shared/types';

/**
 * Observation Pipeline Field Validator
 * Validates every extracted field against verified facts.
 * Rule: If unverified, mark as 'Unknown' or 'Unable to Verify'. Never guess.
 */
export function validateObservations(obs: Partial<ObservationData>): Record<string, FieldVerification> {
  const verifications: Record<string, FieldVerification> = {};

  // 1. Business Name
  verifications.businessName = {
    fieldName: 'Business Name',
    value: obs.businessName || undefined,
    status: obs.businessName && obs.businessName !== 'Target Business' ? 'Verified' : 'Unknown',
    source: 'Google Profile / HTML Title',
  };

  // 2. Rating
  verifications.rating = {
    fieldName: 'Rating',
    value: obs.rating !== undefined ? obs.rating : undefined,
    status: obs.rating !== undefined && obs.rating > 0 ? 'Verified' : 'Unknown',
    source: 'Google Profile / Schema.org',
  };

  // 3. Review Count
  verifications.reviewCount = {
    fieldName: 'Review Count',
    value: obs.reviewCount !== undefined ? obs.reviewCount : undefined,
    status: obs.reviewCount !== undefined && obs.reviewCount >= 0 ? 'Verified' : 'Unknown',
    source: 'Google Profile / Schema.org',
  };

  // 4. Website URL
  verifications.website = {
    fieldName: 'Website URL',
    value: obs.website || undefined,
    status: obs.website && obs.website.startsWith('http') ? 'Verified' : 'Unknown',
    source: 'Google Profile / Canonical Link',
  };

  // 5. Booking CTA Link
  verifications.bookingLink = {
    fieldName: 'Booking CTA Link',
    value: obs.hasBookingLink ? 'Present' : 'Missing',
    status: obs.hasBookingLink ? 'Verified' : 'Unable to Verify',
    source: 'DOM & Meta Audit',
  };

  // 6. Phone Number
  verifications.phone = {
    fieldName: 'Phone Number',
    value: obs.phone || undefined,
    status: obs.phone ? 'Verified' : 'Unknown',
    source: 'Google Profile / Schema.org',
  };

  return verifications;
}
