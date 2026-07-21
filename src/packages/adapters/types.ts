/**
 * Pheebs Core - Genesis Adapter Package
 * Strategy -> Playbook -> Recommendation
 */

import { Business, Strategy, Recommendation } from '../shared/types';

export interface Adapter {
  name: string;
  adapt(strategy: Strategy, business: Business): Promise<Recommendation>;
}
