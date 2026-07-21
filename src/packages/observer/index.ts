/**
 * Pheebs Core - Genesis Observer Package Entrypoint
 */

import { Business } from '../shared/types';
import { extractBusinessFacts } from './extractor';

export async function observeBusiness(inputUrl: string): Promise<Business> {
  if (!inputUrl) {
    throw new Error('Google Maps or Business Profile URL is required');
  }
  return await extractBusinessFacts(inputUrl);
}

export * from './urlNormalizer';
export * from './extractor';
