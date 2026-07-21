/**
 * Pheebs Core - Genesis Reasoner Package Entrypoint Proxy
 */

import { BusinessRecord, Diagnosis } from '../shared/types';
import { diagnoseFromSignals } from '../brain/reasoner';

export async function diagnoseBusiness(business: BusinessRecord): Promise<Diagnosis> {
  return await diagnoseFromSignals(business);
}
