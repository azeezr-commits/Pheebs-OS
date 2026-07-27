import { observeBusinessFacts, initializeContext } from '../observer/extractor';
import { buildObservationReport } from '../observer/observationReport';
import { buildEvidence } from '../evidence/translator';
import { rankEvidencePriorities } from './prioritization';
import { executeJudgment } from './judgmentEngine';
import { executeRealityCheck } from './consistencyGate';
import { designConversation } from './conversationEngine';
import { renderBrief } from './briefRenderer';
import { StorageEngine } from '../storage';
import { PheebsBrief, ReasoningContract } from '../shared/types';

export class TheBrain {
  public static async executeJudgmentPipeline(url: string): Promise<PheebsBrief> {

    // -------------------------------------------------------------------------
    // (D) STAGE 0: Context Initialization
    // -------------------------------------------------------------------------
    const context = await initializeContext('General Local Business');

    // -------------------------------------------------------------------------
    // (D) STAGE 1: Observer (Extract → Validate → Normalize → Emit)
    // -------------------------------------------------------------------------
    const { observations, recoveryAttempts } = await observeBusinessFacts(url);

    // -------------------------------------------------------------------------
    // (D) OBSERVATION REPORT: Developer Audit Data & Weighted Field Scoring
    // -------------------------------------------------------------------------
    const observationReport = buildObservationReport(observations, recoveryAttempts);

    // -------------------------------------------------------------------------
    // (D) STAGE 2: Evidence Builder (Decouples Raw Observations)
    // -------------------------------------------------------------------------
    const evidence = await buildEvidence(observations);

    // -------------------------------------------------------------------------
    // (AI) STAGE 3: Prioritization Engine (Consumes Industry Knowledge Packs)
    // -------------------------------------------------------------------------
    const priorityRanking = await rankEvidencePriorities(evidence, context);

    // -------------------------------------------------------------------------
    // (AI) STAGE 4: Judgment Engine (Facts-Only Reasoning)
    // -------------------------------------------------------------------------
    const rawDiagnosis = await executeJudgment(priorityRanking, evidence, context);

    // -------------------------------------------------------------------------
    // 🛑 REALITY CHECK: Audits logical consistency before speaking!
    // -------------------------------------------------------------------------
    const { realityCheckResult, sanitizedDiagnosis: diagnosis } = executeRealityCheck(rawDiagnosis, observations);

    // -------------------------------------------------------------------------
    // (AI) STAGE 5: Conversation Engine (Consumes Unknowns for Discovery)
    // -------------------------------------------------------------------------
    const conversation = await designConversation(diagnosis, observations, context);

    // -------------------------------------------------------------------------
    // (D) STAGE 6: Voice & Renderer (Pheebs v0.0 UI View)
    // -------------------------------------------------------------------------
    const { editorial, goldenRule, trace } = await renderBrief(
      observations,
      evidence,
      priorityRanking,
      diagnosis,
      conversation,
      context
    );

    // Attach Reality Check to Secret Thinking Trace
    trace.realityCheckStatus = realityCheckResult;

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
      versions: {
        observer: '2.0',
        evidence: '2.0',
        prioritization: '0.4',
        judgment: '0.5',
        conversation: '0.2',
        renderer: '0.2',
      },
      generatedAt: new Date().toISOString(),
    };

    // Save ReasoningContract and secret ThinkingTrace log in StorageEngine
    await StorageEngine.saveContract(contract);

    // Project ReasoningContract into Pheebs v0.0 UI view with Developer Observation Report
    return StorageEngine.projectContractToBrief(contract, observationReport);
  }
}
