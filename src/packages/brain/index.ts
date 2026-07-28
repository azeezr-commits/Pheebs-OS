import { observeBusinessFacts, initializeContext } from '../observer/extractor';
import { evaluateIdentityGate } from '../observer/identityGate';
import { buildObservationReport } from '../observer/observationReport';
import { buildEvidence } from '../evidence/translator';
import { evaluateIsolationGate } from './isolationGate';
import { rankEvidencePriorities } from './prioritization';
import { executeJudgment } from './judgmentEngine';
import { executeRealityCheck } from './consistencyGate';
import { designConversation } from './conversationEngine';
import { renderBrief } from './briefRenderer';
import { StorageEngine } from '../storage';
import { PheebsBrief, ReasoningContract } from '../shared/types';

export class TheBrain {
  public static async executeJudgmentPipeline(url: string): Promise<PheebsBrief> {
    // Generate fresh unique Execution Identity for this invocation
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // -------------------------------------------------------------------------
    // (D) STAGE 0: Context Initialization
    // -------------------------------------------------------------------------
    const context = await initializeContext(executionId, 'General Local Business');

    // -------------------------------------------------------------------------
    // (D) STAGE 1: Observer (Extract → Validate → Normalize → Emit)
    // -------------------------------------------------------------------------
    const { observations, recoveryAttempts } = await observeBusinessFacts(executionId, url);

    // 🛑 IDENTITY GATE (Post-Observer)
    const identityGateResult = evaluateIdentityGate(observations, executionId);

    // -------------------------------------------------------------------------
    // (D) OBSERVATION REPORT: Developer Audit Data & Weighted Field Scoring
    // -------------------------------------------------------------------------
    const observationReport = buildObservationReport(executionId, observations, recoveryAttempts);

    // -------------------------------------------------------------------------
    // (D) STAGE 2: Evidence Builder (Decouples Raw Observations)
    // -------------------------------------------------------------------------
    const evidence = await buildEvidence(observations);

    // 🛑 ISOLATION GATE (Pre-Judgment)
    const isolationGateResult = evaluateIsolationGate(executionId, observations, evidence);

    // -------------------------------------------------------------------------
    // (AI) STAGE 3: Prioritization Engine (Consumes Industry Knowledge Packs)
    // -------------------------------------------------------------------------
    const priorityRanking = await rankEvidencePriorities(evidence, context);

    // -------------------------------------------------------------------------
    // (AI) STAGE 4: Judgment Engine (Facts-Only Reasoning)
    // -------------------------------------------------------------------------
    const rawDiagnosis = await executeJudgment(executionId, priorityRanking, evidence, context);

    // -------------------------------------------------------------------------
    // 🛑 REALITY CHECK (Before Speaking)
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

    // Attach Gate Results to Secret Thinking Trace
    trace.executionId = executionId;
    trace.identityGateStatus = identityGateResult;
    trace.isolationGateStatus = isolationGateResult;
    trace.realityCheckStatus = realityCheckResult;

    const contract: ReasoningContract = {
      id: `contract_${Date.now()}`,
      executionId,
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
        observer: '2.1',
        evidence: '2.1',
        prioritization: '0.4',
        judgment: '0.6',
        conversation: '0.3',
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
