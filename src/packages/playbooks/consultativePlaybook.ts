import { ConversationObject, ObservationData } from '../shared/types';
import { Playbook, PlaybookAdaptation } from './types';

export class ConsultativePlaybook implements Playbook {
  public readonly name = 'Product-Agnostic Consultative Adaptor';
  public readonly version = '1.2';

  async execute(
    conversation: ConversationObject,
    observations: ObservationData
  ): Promise<PlaybookAdaptation> {
    return {
      playbookName: this.name,
      openingPitch: `Hi! I was reviewing ${observations.businessName}'s digital presence regarding ${observations.category}.`,
      recommendedSolution: 'Consultative Discovery & Process Mapping',
      playbookVersion: this.version,
    };
  }
}
