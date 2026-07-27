import { PheebsBrief, ReasoningContract } from '../shared/types';

export class StorageEngine {
  private static contracts: Map<string, ReasoningContract> = new Map();
  private static traces: Map<string, any> = new Map();

  public static async saveContract(contract: ReasoningContract): Promise<void> {
    this.contracts.set(contract.id, contract);
    this.traces.set(contract.trace.traceId, contract.trace);
  }

  public static async getContract(id: string): Promise<ReasoningContract | undefined> {
    return this.contracts.get(id);
  }

  public static async getTrace(traceId: string): Promise<any | undefined> {
    return this.traces.get(traceId);
  }

  public static async listContracts(): Promise<ReasoningContract[]> {
    return Array.from(this.contracts.values());
  }

  // Project permanent ReasoningContract into disposable UI view (PheebsBrief)
  public static projectContractToBrief(contract: ReasoningContract): PheebsBrief {
    const { observations, evidence, priorityRanking, diagnosis, conversation, editorial, goldenRule, versions, generatedAt } = contract;

    return {
      id: contract.id,
      businessName: observations.businessName,
      category: observations.category,
      address: observations.address,
      website: observations.website || '',
      rating: observations.rating || 0,
      reviewCount: observations.reviewCount || 0,

      // SECTION 1: Recommendation First (Above fold)
      startHere: {
        topic: conversation.openingAngle,
        confidence: diagnosis.computedConfidence.level,
        confidenceScore: diagnosis.computedConfidence.finalScore,
        why: diagnosis.whyThis,
        primaryConstraint: diagnosis.primaryConstraint,
      },
      whyNot: conversation.avoidTopics,
      firstQuestion: conversation.firstQuestion,

      // SECTION 2: Supporting Context & Priority Ranking (Below fold)
      businessContext: editorial.executiveSummary,
      evidence,
      priorityRanking,
      falsificationEvidence: diagnosis.falsificationEvidence,
      unknowns: diagnosis.knowledgeAssets.unknown,
      timeline: [
        { minute: '0-2', action: 'Acknowledge positive rating quality and patient trust.' },
        { minute: '2-5', action: 'Ask how after-hours phone calls and weekend inquiries are handled today.' },
        { minute: '5-8', action: 'Explore the revenue loss of uncaptured mobile website visitors.' },
        { minute: '8-10', action: 'Align on testing a 2-click instant scheduling workflow.' },
      ],
      questions: {
        primary: conversation.firstQuestion,
        secondary: conversation.discoveryQuestions,
      },
      objections: editorial.keyObjections,
      opening: editorial.openingScript,
      beforeYouAssume: editorial.beforeYouAssume,
      goldenRule,
      versions,
      generatedAt,
    };
  }
}
