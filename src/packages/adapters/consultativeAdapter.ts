/**
 * Pheebs Core - Genesis Consultative Seller Adapter
 */

import { Adapter } from './types';
import { BusinessRecord, Strategy, PlaybookRecommendation } from '../shared/types';

export class ConsultativeAdapter implements Adapter {
  name = 'consultative';

  async adapt(strategy: Strategy, business: BusinessRecord): Promise<PlaybookRecommendation> {
    const id = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return {
      id,
      strategyId: strategy.id,
      playbookKey: this.name,
      playbookName: 'Consultative Adapter',
      anchorProduct: 'Value-First Operational Friction Elimination',
      pitchAngle: 'Diagnosis & Quantification: Validate operational leakage scope before offering solution',
      strategicRationale: `Anchor ${business.name}'s key stakeholders on the financial loss of uncaptured inquiries. Lead with discovery questions, avoid pitching feature dashboards, and focus on immediate revenue recovery.`,
      actionItems: [
        'Confirm primary constraint with office manager during opening hook',
        'Quantify monthly revenue leakage using single-question calculator',
        'Gain alignment on the cost of doing nothing before sharing proposal'
      ],
      playbookVersion: 'v1.0.0'
    };
  }
}
