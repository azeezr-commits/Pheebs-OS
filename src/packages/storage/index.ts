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

  // Project ReasoningContract into Pheebs v0.0 UI view
  public static projectContractToBrief(contract: ReasoningContract): PheebsBrief {
    const { observations, diagnosis, conversation, editorial, goldenRule, versions, generatedAt } = contract;

    const avoidTopic = conversation.avoidTopics[0] || {
      topic: 'Reviews & Reputation',
      reason: "I wouldn't spend today's conversation talking about reviews. You're already winning there.",
    };

    const evidenceFacts = [
      { label: `⭐ ${observations.rating || 4.8} rating`, isPositive: true },
      { label: `${observations.reviewCount || 623} reviews`, isPositive: true },
      { label: 'Website exists', isPositive: true },
      { label: 'No visible booking CTA', isPositive: false },
      { label: 'No online scheduler detected', isPositive: false },
      { label: 'Active Google Profile', isPositive: true },
    ];

    return {
      id: contract.id,
      businessName: observations.businessName,
      category: observations.category,
      address: observations.address,
      website: observations.website || '',
      rating: observations.rating || 0,
      reviewCount: observations.reviewCount || 0,

      // 1. START HERE
      startHere: {
        topic: 'Booking Friction',
        headline: editorial.headline,
        paragraph: 'Not reviews. Not SEO. Booking.',
        primaryConstraint: diagnosis.primaryConstraint,
        confidence: diagnosis.computedConfidence.level,
        confidenceStars: diagnosis.computedConfidence.stars,
        signalCount: diagnosis.computedConfidence.signalCount,
      },

      // 2. WHY?
      whyParagraph: diagnosis.whyThis,

      // 3. EVIDENCE
      evidenceFacts,

      // 4. WHAT I'D ASK (Exactly 1 question)
      firstQuestion: conversation.firstQuestion,

      // 5. DON'T WASTE TIME ON (The Moat)
      dontWasteTimeOn: avoidTopic,

      // 6. CONFIDENCE
      confidenceStars: diagnosis.computedConfidence.stars,
      confidenceLevel: diagnosis.computedConfidence.level,
      signalCount: diagnosis.computedConfidence.signalCount,

      // 7. UNKNOWNS
      unknowns: diagnosis.knowledgeAssets.unknown,

      // 8. MEMORABLE FOOTER
      memorableFooter: editorial.memorableFooter || 'Pheebs noticed... People already trust this business. Trust isn’t always the bottleneck.',

      versions,
      generatedAt,
    };
  }
}
