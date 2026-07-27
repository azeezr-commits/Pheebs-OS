import { ReasoningContract } from './types';

/**
 * Reasoning Contract Validator
 * Enforces completeness across all 7 stages and independent stage versions.
 */
export function validateReasoningContract(contract: ReasoningContract): boolean {
  if (!contract.id || typeof contract.id !== 'string') return false;
  if (!contract.context || !contract.context.industry) return false;
  if (!contract.observations || !contract.observations.businessName) return false;
  if (!Array.isArray(contract.evidence) || contract.evidence.length === 0) return false;
  if (!Array.isArray(contract.priorityRanking) || contract.priorityRanking.length === 0) return false;
  if (!contract.diagnosis || !contract.diagnosis.primaryConstraint) return false;
  if (!contract.conversation || !contract.conversation.openingAngle) return false;
  if (!contract.editorial || !contract.editorial.headline) return false;
  if (!contract.trace || !contract.trace.traceId) return false;

  // Independent version stamps check
  if (!contract.versions || !contract.versions.observer || !contract.versions.judgment) return false;

  return true;
}
