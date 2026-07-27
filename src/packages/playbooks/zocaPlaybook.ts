import { ConversationObject, ObservationData } from '../shared/types';
import { Playbook, PlaybookAdaptation } from './types';

export const PLAYBOOK_VERSION = '1.2';

export class ZocaPlaybook implements Playbook {
  public readonly name = 'Zoca Local Business Adaptor';
  public readonly version = PLAYBOOK_VERSION;

  async execute(
    conversation: ConversationObject,
    observations: ObservationData
  ): Promise<PlaybookAdaptation> {
    return {
      playbookName: this.name,
      openingPitch: `Hi! I noticed ${observations.businessName} has strong reviews (⭐ ${observations.rating}), but lacks direct 24/7 online scheduling.`,
      recommendedSolution: 'Zoca Automated Review & Instant Scheduling Widget',
      playbookVersion: this.version,
    };
  }
}
