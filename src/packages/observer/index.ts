/**
 * Pheebs Core - Genesis v0.2 Observer Service Entrypoint
 */

import { BusinessRecord } from '../shared/types';
import { observeBusinessRecord } from './extractor';

export async function observeBusiness(inputUrl: string): Promise<BusinessRecord> {
  if (!inputUrl) {
    throw new Error('Google Maps or Business Profile URL is required');
  }
  return await observeBusinessRecord(inputUrl);
}

export * from './urlNormalizer';
export * from './extractor';
