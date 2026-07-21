/**
 * Pheebs Core - Genesis v0.2 Consultative Playbook
 */

import { Playbook } from './types';
import { BusinessRecord, Strategy, PlaybookRecommendation } from '../shared/types';

export const CONSULTATIVE_PLAYBOOK_VERSION = 'v1.0.0';

export class ConsultativePlaybook implements Playbook {
  key = 'consultative';
  name = 'Universal Consultative Seller Playbook';
  version = CONSULTATIVE_PLAYBOOK_VERSION;

  async recommend(strategy: Strategy, businessRecord: BusinessRecord): Promise<PlaybookRecommendation> {
    const id = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return {
      id,
      strategyId: strategy.id,
      playbookKey: this.key,
      playbookName: this.name,
      anchorProduct: 'Value-First Operational Friction Elimination',
      pitchAngle: 'Diagnosis & Quantification: Validate operational leakage scope before offering solution',
      strategicRationale: `Anchor ${businessRecord.name}'s key stakeholders on the financial loss of uncaptured inquiries. Lead with discovery questions, avoid pitching feature dashboards, and focus on immediate revenue recovery.`,
      actionItems: [
        'Confirm primary constraint with office manager during opening hook',
        'Quantify monthly revenue leakage using single-question calculator',
        'Gain alignment on the cost of doing nothing before sharing proposal'
      ],
      playbookVersion: this.version
    };
  }
}
