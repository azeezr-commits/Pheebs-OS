import { ConversationObject, ObservationData } from '../shared/types';

export interface PlaybookAdaptation {
  playbookName: string;
  openingPitch: string;
  recommendedSolution: string;
  playbookVersion: string;
}

export interface Playbook {
  name: string;
  version: string;
  execute(conversation: ConversationObject, observations: ObservationData): Promise<PlaybookAdaptation>;
}
