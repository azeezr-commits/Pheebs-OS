import { initializeContext, observeBusinessFacts, OBSERVER_VERSION } from '../observer';
import { normalizeEvidence, EVIDENCE_VERSION } from '../evidence';
import { rankEvidencePriorities, PRIORITIZATION_VERSION } from './prioritization';
import { executeJudgment, JUDGMENT_VERSION } from './judgmentEngine';
import { designConversation, CONVERSATION_VERSION } from './conversationEngine';
import { renderBrief, BRIEF_RENDERER_VERSION } from './briefRenderer';
import { ReasoningContract, StageVersions } from '../shared/types';
import { validateReasoningContract } from '../shared/validator';

export * from './prioritization';
export * from './judgmentEngine';
export * from './conversationEngine';
export * from './briefRenderer';

export class TheBrain {
  /**
   * Executes the Production 7-Stage Judgment Pipeline:
   * (D) Context -> (D) Observer -> (D) Evidence Normalization ->
   * (AI) Prioritization -> (AI) Judgment -> (AI) Conversation ->
   * (D) Brief Renderer
   */
  public static async executeJudgmentPipeline(url: string): Promise<ReasoningContract> {
    // (D) Stage 1: Observer (Verified facts)
    const observations = await observeBusinessFacts(url);

    // (D) Stage 0: Context (Domain initialization)
    const context = await initializeContext(observations.category);

    // (D) Stage 2: Evidence Normalization (Raw primitives, no interpretation)
    const evidence = await normalizeEvidence(observations);

    // (AI) Stage 3: Prioritization (Applies Industry Knowledge Pack weights)
    const priorityRanking = await rankEvidencePriorities(evidence, context);

    // (AI) Stage 4: Judgment Engine (ONE constraint + Computed Confidence + Knowledge Assets)
    const diagnosis = await executeJudgment(priorityRanking, evidence, context);

    // (AI) Stage 5: Conversation Engine (Consumes Unknowns, outputs structured object)
    const conversation = await designConversation(diagnosis, observations, context);

    // (D) Stage 6: Brief Renderer (Receives ReasoningContract, renders UI brief & secret trace)
    const { editorial, goldenRule, trace } = await renderBrief(observations, evidence, priorityRanking, diagnosis, conversation, context);

    const versions: StageVersions = {
      observer: OBSERVER_VERSION,
      evidence: EVIDENCE_VERSION,
      prioritization: PRIORITIZATION_VERSION,
      judgment: JUDGMENT_VERSION,
      conversation: CONVERSATION_VERSION,
      renderer: BRIEF_RENDERER_VERSION,
    };

    const contract: ReasoningContract = {
      id: `contract_${Date.now()}`,
      context,
      observations,
      evidence,
      priorityRanking,
      diagnosis,
      conversation,
      editorial,
      goldenRule,
      trace,
      versions,
      generatedAt: new Date().toISOString(),
    };

    if (!validateReasoningContract(contract)) {
      throw new Error('ReasoningContract validation failed: missing required 7-stage pipeline fields');
    }

    return contract;
  }
}
