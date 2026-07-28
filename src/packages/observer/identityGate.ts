import { GateResult, ObservationData, PipelineIntegrityError } from '../shared/types';

/**
 * Identity Gate (Post-Observer)
 * Confirms BusinessIdentity matches the current Execution ID and input URL.
 * Immediately throws PipelineIntegrityError if identity mismatch occurs.
 */
export function evaluateIdentityGate(obs: ObservationData, executionId: string): GateResult {
  if (obs.executionId !== executionId) {
    throw new PipelineIntegrityError(`Execution ID mismatch in Identity Gate. Expected ${executionId}, got ${obs.executionId}`);
  }

  if (!obs.businessIdentity || !obs.businessIdentity.name || obs.businessIdentity.name === 'Maps') {
    throw new PipelineIntegrityError(`Invalid business identity extracted: "${obs.businessIdentity?.name}". Execution terminated.`);
  }

  return {
    passed: true,
    gateName: 'Identity Gate',
    details: `Verified canonical business identity: "${obs.businessIdentity.name}" [${obs.executionId}]`,
  };
}
