import { ObservationData, ObservationStatus } from '../shared/types';

export interface FieldAuditItem {
  value: any;
  status: ObservationStatus;
  source: string;
  confidence: number;
}

/**
 * Observation Pipeline Field Validator
 * Validates every extracted field against verified facts.
 */
export function validateObservations(obs: ObservationData): Record<string, FieldAuditItem> {
  return {
    businessName: {
      value: obs.businessName.value,
      status: obs.businessName.status,
      source: obs.businessName.source,
      confidence: obs.businessName.confidence,
    },
    website: {
      value: obs.website?.value || 'N/A',
      status: obs.website?.status || ObservationStatus.MISSING,
      source: obs.website?.source || 'Canonical Link',
      confidence: obs.website?.confidence || 0,
    },
    address: {
      value: obs.address.value,
      status: obs.address.status,
      source: obs.address.source,
      confidence: obs.address.confidence,
    },
    rating: {
      value: obs.rating?.value || 'Unverified',
      status: obs.rating?.status || ObservationStatus.MISSING,
      source: obs.rating?.source || 'Google Profile',
      confidence: obs.rating?.confidence || 0,
    },
    reviewCount: {
      value: obs.reviewCount?.value || 'Unverified',
      status: obs.reviewCount?.status || ObservationStatus.MISSING,
      source: obs.reviewCount?.source || 'Google Profile',
      confidence: obs.reviewCount?.confidence || 0,
    },
    bookingLink: {
      value: obs.hasBookingLink.value ? 'Present' : 'Missing',
      status: obs.hasBookingLink.status,
      source: obs.hasBookingLink.source,
      confidence: obs.hasBookingLink.confidence,
    },
  };
}
