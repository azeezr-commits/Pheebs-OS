/**
 * Pheebs Core - Genesis v0.2 Playbooks Engine Entrypoint & Selector
 */

import { BusinessRecord, Strategy, PlaybookRecommendation } from '../shared/types';
import { Playbook } from './types';
import { ZocaPlaybook, ZOCA_PLAYBOOK_VERSION } from './zocaPlaybook';
import { ConsultativePlaybook } from './consultativePlaybook';

export const PLAYBOOK_VERSION = ZOCA_PLAYBOOK_VERSION;

const registry: Record<string, Playbook> = {
  zoca: new ZocaPlaybook(),
  consultative: new ConsultativePlaybook()
};

export async function selectPlaybookRecommendation(
  strategy: Strategy,
  businessRecord: BusinessRecord,
  playbookKey: string = 'zoca'
): Promise<PlaybookRecommendation> {
  const selected = registry[playbookKey.toLowerCase()] || registry.zoca;
  return await selected.recommend(strategy, businessRecord);
}

export * from './types';
export * from './zocaPlaybook';
export * from './consultativePlaybook';
