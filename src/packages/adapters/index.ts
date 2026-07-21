/**
 * Pheebs Core - Genesis Adapter Package Entrypoint & Runner
 */

import { Business, Strategy, Recommendation } from '../shared/types';
import { Adapter } from './types';
import { ZocaAdapter } from './zocaAdapter';
import { ConsultativeAdapter } from './consultativeAdapter';

const adapters: Record<string, Adapter> = {
  zoca: new ZocaAdapter(),
  consultative: new ConsultativeAdapter()
};

export async function adaptStrategy(
  strategy: Strategy,
  business: Business,
  adapterKey: string = 'zoca'
): Promise<Recommendation> {
  const selectedAdapter = adapters[adapterKey.toLowerCase()] || adapters.zoca;
  return await selectedAdapter.adapt(strategy, business);
}

export * from './types';
export * from './zocaAdapter';
export * from './consultativeAdapter';
