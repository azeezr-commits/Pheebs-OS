import { GateResult, NormalizedEvidence, ObservationData, PipelineIntegrityError } from '../shared/types';

/**
 * Isolation Gate (Pre-Judgment)
 * Confirms 100% of observations and evidence belong strictly to the current Execution ID.
 * Throws PipelineIntegrityError if stale objects survive across executions.
 */
export function evaluateIsolationGate(
  executionId: string,
  obs: ObservationData,
  evidence: NormalizedEvidence[]
): GateResult {
  if (obs.executionId !== executionId) {
    throw new PipelineIntegrityError(`Observation data execution ID mismatch: expected ${executionId}, found ${obs.executionId}`);
  }

  for (const item of evidence) {
    if (item.executionId !== executionId) {
      throw new PipelineIntegrityError(`Evidence item ${item.id} carries stale execution ID: expected ${executionId}, found ${item.executionId}`);
    }
  }

  return {
    passed: true,
    gateName: 'Isolation Gate',
    details: `Execution Isolation verified for ${executionId} (${evidence.length} isolated evidence items).`,
  };
}
