/**
 * Pheebs Core - Genesis v0.2 Zoca Playbook
 */

import { Playbook } from './types';
import { BusinessRecord, Strategy, PlaybookRecommendation } from '../shared/types';

export const ZOCA_PLAYBOOK_VERSION = 'v1.0.0';

export class ZocaPlaybook implements Playbook {
  key = 'zoca';
  name = 'Zoca Automated Text-Back Playbook';
  version = ZOCA_PLAYBOOK_VERSION;

  async recommend(strategy: Strategy, businessRecord: BusinessRecord): Promise<PlaybookRecommendation> {
    const id = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return {
      id,
      strategyId: strategy.id,
      playbookKey: this.key,
      playbookName: this.name,
      anchorProduct: 'Instant Missed-Call Recovery & Frictionless Patient Assistant',
      pitchAngle: 'Consultative ROI Audit: Prove missed inbound call value before pitching setup',
      strategicRationale: `For ${businessRecord.name}, front-desk overload during peak checkout hours causes unanswered calls. Zoca's instant text-back sends an automated SMS booking link within 5 seconds, capturing high-intent patients before they call a competitor.`,
      actionItems: [
        'Open call with observed google listing ratings to build instant rapport',
        'Ask discovery test question on peak checkout phone congestion',
        'Demonstrate live 5-second SMS text-back on rep\'s mobile phone',
        'Offer 14-day zero-risk trial anchored on capturing 5 missed emergency leads'
      ],
      playbookVersion: this.version
    };
  }
}
