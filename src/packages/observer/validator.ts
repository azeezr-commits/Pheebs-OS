import { ObservationData, VerificationStatus } from '../shared/types';

export interface FieldAuditItem {
  value: any;
  status: VerificationStatus;
  source: string;
  confidence: number;
}

/**
 * Observation Pipeline Field Validator
 * Validates every extracted field against verified facts.
 * Rule: If unverified, mark as 'Unknown' or 'Unable to Verify'. Never guess.
 */
export function validateObservations(obs: ObservationData): Record<string, FieldAuditItem> {
  return {
    businessName: {
      value: obs.businessName.value,
      status: obs.businessName.verified ? 'Verified' : 'Unknown',
      source: obs.businessName.source,
      confidence: obs.businessName.confidence,
    },
    website: {
      value: obs.website?.value || 'N/A',
      status: obs.website?.verified ? 'Verified' : 'Unknown',
      source: obs.website?.source || 'Canonical Link',
      confidence: obs.website?.confidence || 0,
    },
    address: {
      value: obs.address.value,
      status: obs.address.verified ? 'Verified' : 'Unknown',
      source: obs.address.source,
      confidence: obs.address.confidence,
    },
    rating: {
      value: obs.rating?.value || 'Unverified',
      status: obs.rating?.verified ? 'Verified' : 'Unknown',
      source: obs.rating?.source || 'Google Profile',
      confidence: obs.rating?.confidence || 0,
    },
    reviewCount: {
      value: obs.reviewCount?.value || 'Unverified',
      status: obs.reviewCount?.verified ? 'Verified' : 'Unknown',
      source: obs.reviewCount?.source || 'Google Profile',
      confidence: obs.reviewCount?.confidence || 0,
    },
    bookingLink: {
      value: obs.hasBookingLink.value ? 'Present' : 'Missing',
      status: obs.hasBookingLink.verified ? 'Verified' : 'Unable to Verify',
      source: obs.hasBookingLink.source,
      confidence: obs.hasBookingLink.confidence,
    },
  };
}
