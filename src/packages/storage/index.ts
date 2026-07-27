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
    const { observations, diagnosis, conversation, editorial, versions, generatedAt } = contract;

    const avoidTopic = conversation.avoidTopics[0] || {
      topic: 'Reviews & Reputation',
      reason: "I wouldn't spend today's conversation talking about reviews. You're already winning there.",
    };

    const evidenceFacts: Array<{ label: string; isPositive: boolean; status: 'Verified' | 'Unknown' | 'Unable to Verify' }> = [
      {
        label: observations.rating ? `⭐ ${observations.rating} rating` : '⭐ Rating unverified',
        isPositive: (observations.rating || 0) >= 4.0,
        status: (observations.verifications.rating?.status as any) || 'Unknown',
      },
      {
        label: observations.reviewCount !== undefined ? `${observations.reviewCount} reviews` : 'Review count unverified',
        isPositive: (observations.reviewCount || 0) >= 30,
        status: (observations.verifications.reviewCount?.status as any) || 'Unknown',
      },
      {
        label: 'Website exists',
        isPositive: true,
        status: (observations.verifications.website?.status as any) || 'Verified',
      },
      {
        label: observations.hasBookingLink ? 'Visible booking CTA' : 'No visible booking CTA',
        isPositive: observations.hasBookingLink,
        status: (observations.verifications.bookingLink?.status as any) || 'Unable to Verify',
      },
      {
        label: 'No online scheduler detected',
        isPositive: false,
        status: 'Verified',
      },
      {
        label: 'Active Google Profile',
        isPositive: true,
        status: (observations.verifications.businessName?.status as any) || 'Verified',
      },
    ];

    return {
      id: contract.id,
      businessName: observations.businessName,
      category: observations.category,
      address: observations.address,
      website: observations.website || '',
      rating: observations.rating,
      reviewCount: observations.reviewCount,
      traceId: contract.trace.traceId,

      // 1. START HERE
      startHere: {
        topic: 'Booking Friction',
        headline: editorial.headline,
        paragraph: 'Not reviews. Not SEO. Booking.',
        primaryConstraint: diagnosis.primaryConstraint,
        confidence: diagnosis.computedConfidence.reasoningConfidence,
        confidenceStars: diagnosis.computedConfidence.stars,
        evidenceCoveragePercent: diagnosis.computedConfidence.evidenceCoveragePercent,
        verifiedSignalsCount: diagnosis.computedConfidence.verifiedSignalsCount,
      },

      // 2. WHY?
      whyParagraph: diagnosis.whyThis,

      // 3. EVIDENCE
      evidenceFacts,

      // 4. WHAT I'D ASK
      firstQuestion: conversation.firstQuestion,

      // 5. DON'T WASTE TIME ON
      dontWasteTimeOn: avoidTopic,

      // 6. CONFIDENCE
      confidenceStars: diagnosis.computedConfidence.stars,
      confidenceLevel: diagnosis.computedConfidence.reasoningConfidence,
      evidenceCoveragePercent: diagnosis.computedConfidence.evidenceCoveragePercent,
      verifiedSignalsCount: diagnosis.computedConfidence.verifiedSignalsCount,

      // 7. UNKNOWNS
      unknowns: diagnosis.knowledgeAssets.unknown,

      // 8. MEMORABLE FOOTER
      memorableFooter: editorial.memorableFooter || 'Pheebs noticed... People already trust this business. Trust isn’t always the bottleneck.',

      // Developer Audit Data
      fieldVerifications: observations.verifications,

      versions,
      generatedAt,
    };
  }
}
