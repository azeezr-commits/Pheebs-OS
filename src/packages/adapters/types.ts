/**
 * Pheebs Core - Genesis Adapter Package
 * Strategy -> Playbook -> Recommendation
 */

import { BusinessRecord, Strategy, PlaybookRecommendation } from '../shared/types';

export interface Adapter {
  name: string;
  adapt(strategy: Strategy, business: BusinessRecord): Promise<PlaybookRecommendation>;
}
