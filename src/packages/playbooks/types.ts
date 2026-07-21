/**
 * Pheebs Core - Genesis v0.2 Playbooks Engine
 * Diagnosis -> Strategy -> Playbook -> Recommendation
 */

import { BusinessRecord, Strategy, PlaybookRecommendation } from '../shared/types';

export interface Playbook {
  key: string;
  name: string;
  version: string;
  recommend(strategy: Strategy, businessRecord: BusinessRecord): Promise<PlaybookRecommendation>;
}
