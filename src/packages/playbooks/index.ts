import { ConversationObject, ObservationData } from '../shared/types';
import { ZocaPlaybook, PLAYBOOK_VERSION } from './zocaPlaybook';
import { ConsultativePlaybook } from './consultativePlaybook';
import { Playbook, PlaybookAdaptation } from './types';

export * from './types';
export * from './zocaPlaybook';
export * from './consultativePlaybook';

const playbooks: Record<string, Playbook> = {
  zoca: new ZocaPlaybook(),
  consultative: new ConsultativePlaybook(),
};

export async function runPlaybook(
  key: string,
  conversation: ConversationObject,
  observations: ObservationData
): Promise<PlaybookAdaptation> {
  const playbook = playbooks[key] || playbooks.consultative;
  return playbook.execute(conversation, observations);
}
