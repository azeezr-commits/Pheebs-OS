/**
 * Pheebs Core - Genesis Zoca Playbook Adapter
 * Maps Strategy & Factual Observations into Zoca's high-value consultative pitch recommendation.
 */

import { Adapter } from './types';
import { Business, Strategy, Recommendation } from '../shared/types';

export class ZocaAdapter implements Adapter {
  name = 'zoca';

  async adapt(strategy: Strategy, business: Business): Promise<Recommendation> {
    const id = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    return {
      id,
      strategyId: strategy.id,
      adapterName: 'Zoca Playbook',
      anchorProduct: 'Instant Missed-Call Recovery & Frictionless Patient Assistant',
      pitchAngle: 'Consultative ROI Audit: Prove missed inbound call value before pitching setup',
      strategicRationale: `For ${business.name}, front-desk overload during peak checkout hours causes unanswered calls. Zoca's instant text-back sends an automated SMS booking link within 5 seconds, capturing high-intent patients before they call a competitor.`,
      actionItems: [
        'Open call with observed google listing ratings to build instant rapport',
        'Ask discovery test question on peak checkout phone congestion',
        'Demonstrate live 5-second SMS text-back on rep\'s mobile phone',
        'Offer 14-day zero-risk trial anchored on capturing 5 missed emergency leads'
      ]
    };
  }
}
