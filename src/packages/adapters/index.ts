/**
 * Pheebs Core - Genesis Adapter Package Entrypoint
 */

import { BusinessRecord, Strategy, PlaybookRecommendation } from '../shared/types';
import { Adapter } from './types';
import { ZocaAdapter } from './zocaAdapter';
import { ConsultativeAdapter } from './consultativeAdapter';

const adapters: Record<string, Adapter> = {
  zoca: new ZocaAdapter(),
  consultative: new ConsultativeAdapter()
};

export async function adaptStrategy(
  strategy: Strategy,
  business: BusinessRecord,
  adapterKey: string = 'zoca'
): Promise<PlaybookRecommendation> {
  const selectedAdapter = adapters[adapterKey.toLowerCase()] || adapters.zoca;
  return await selectedAdapter.adapt(strategy, business);
}

export * from './types';
export * from './zocaAdapter';
export * from './consultativeAdapter';
