/**
 * Pheebs Core - Genesis Strategist Package Entrypoint Proxy
 */

import { Diagnosis, Strategy, BusinessRecord } from '../shared/types';
import { strategizeFromDiagnosis } from '../brain/strategist';

export async function formulateStrategy(diagnosis: Diagnosis, businessRecord?: BusinessRecord): Promise<Strategy> {
  const dummyRecord: BusinessRecord = businessRecord || {
    id: diagnosis.businessId,
    name: 'Target Business',
    category: 'Healthcare Clinic',
    address: 'Address',
    website: 'https://example.com',
    rating: 4.5,
    reviewCount: 100,
    signals: [],
    observedAt: new Date().toISOString(),
    observerVersion: 'v1.0.0'
  };
  return await strategizeFromDiagnosis(diagnosis, dummyRecord);
}
