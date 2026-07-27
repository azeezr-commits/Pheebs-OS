import { observeBusinessFacts, initializeContext } from '../observer/extractor';
import { evaluateObservationGate } from '../observer/observationGate';
import { normalizeEvidence } from '../evidence/translator';
import { rankEvidencePriorities } from './prioritization';
import { executeJudgment } from './judgmentEngine';
import { evaluateConsistencyGate } from './consistencyGate';
import { designConversation } from './conversationEngine';
import { renderBrief } from './briefRenderer';
import { StorageEngine } from '../storage';
import { PheebsBrief, ReasoningContract } from '../shared/types';

export class TheBrain {
  public static async executeJudgmentPipeline(url: string): Promise<PheebsBrief> {
    const startTime = Date.now();

    // -------------------------------------------------------------------------
    // (D) STAGE 0: Context Initialization
    // -------------------------------------------------------------------------
    const context = await initializeContext('General Local Business');

    // -------------------------------------------------------------------------
    // (D) STAGE 1: Observer (Real Fact Extraction with FieldMetadata)
    // -------------------------------------------------------------------------
    const observations = await observeBusinessFacts(url);

    // 🛑 GATE 1: Observation Validation Gate (Before Reasoning)
    const gate1Result = evaluateObservationGate(observations);
    if (!gate1Result.passed) {
      throw new Error(gate1Result.failureReason || "I couldn't confidently identify the business. Please provide another Google Business Profile.");
    }

    // -------------------------------------------------------------------------
    // (D) STAGE 2: Evidence Normalization (Verified Primitives Only)
    // -------------------------------------------------------------------------
    const evidence = await normalizeEvidence(observations);

    // -------------------------------------------------------------------------
    // (AI) STAGE 3: Prioritization Engine (Consumes Industry Knowledge Packs)
    // -------------------------------------------------------------------------
    const priorityRanking = await rankEvidencePriorities(evidence, context);

    // -------------------------------------------------------------------------
    // (AI) STAGE 4: Judgment Engine
    // -------------------------------------------------------------------------
    const rawDiagnosis = await executeJudgment(priorityRanking, evidence, context);

    // 🛑 GATE 2: Consistency Gate (Before Speaking)
    const { gateResult: gate2Result, sanitizedDiagnosis: diagnosis } = evaluateConsistencyGate(rawDiagnosis, observations);

    // -------------------------------------------------------------------------
    // (AI) STAGE 5: Conversation Engine (Consumes Unknowns for Discovery)
    // -------------------------------------------------------------------------
    const conversation = await designConversation(diagnosis, observations, context);

    // -------------------------------------------------------------------------
    // (D) STAGE 6: Brief Renderer (PHEEBS v0.0 UI View)
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
    trace.gate1Status = gate1Result;
    trace.gate2Status = gate2Result;

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
        observer: '1.4',
        evidence: '1.2',
        prioritization: '0.4',
        judgment: '0.5',
        conversation: '0.2',
        renderer: '0.2',
      },
      generatedAt: new Date().toISOString(),
    };

    // Save ReasoningContract and secret ThinkingTrace log in StorageEngine
    await StorageEngine.saveContract(contract);

    // Project ReasoningContract into Pheebs v0.0 UI view
    return StorageEngine.projectContractToBrief(contract);
  }
}
