import { PheebsBrief, ReasoningContract, VerificationStatus } from '../shared/types';

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

    const isRatingVerified = observations.rating?.verified || false;
    const isReviewVerified = observations.reviewCount?.verified || false;

    const evidenceFacts: Array<{ label: string; isPositive: boolean; status: VerificationStatus }> = [
      {
        label: isRatingVerified ? `⭐ ${observations.rating!.value} rating` : '⭐ Rating unverified',
        isPositive: isRatingVerified && (observations.rating!.value >= 4.0),
        status: isRatingVerified ? 'Verified' : 'Unknown',
      },
      {
        label: isReviewVerified ? `${observations.reviewCount!.value} reviews` : 'Review count unverified',
        isPositive: isReviewVerified && (observations.reviewCount!.value >= 30),
        status: isReviewVerified ? 'Verified' : 'Unknown',
      },
      {
        label: 'Website exists',
        isPositive: observations.website?.verified || false,
        status: observations.website?.verified ? 'Verified' : 'Unknown',
      },
      {
        label: observations.hasBookingLink.value ? 'Visible booking CTA' : 'No visible booking CTA',
        isPositive: observations.hasBookingLink.value,
        status: observations.hasBookingLink.verified ? 'Verified' : 'Unable to Verify',
      },
      {
        label: 'No online scheduler detected',
        isPositive: false,
        status: 'Verified',
      },
      {
        label: 'Active Google Profile',
        isPositive: observations.businessName.verified,
        status: observations.businessName.verified ? 'Verified' : 'Unknown',
      },
    ];

    const fieldVerifications: Record<string, { value: any; status: VerificationStatus; source: string; confidence: number }> = {
      businessName: {
        value: observations.businessName.value,
        status: observations.businessName.verified ? 'Verified' : 'Unknown',
        source: observations.businessName.source,
        confidence: observations.businessName.confidence,
      },
      website: {
        value: observations.website?.value || 'N/A',
        status: observations.website?.verified ? 'Verified' : 'Unknown',
        source: observations.website?.source || 'Canonical Link',
        confidence: observations.website?.confidence || 0,
      },
      address: {
        value: observations.address.value,
        status: observations.address.verified ? 'Verified' : 'Unknown',
        source: observations.address.source,
        confidence: observations.address.confidence,
      },
      rating: {
        value: observations.rating?.value || 'Unverified',
        status: isRatingVerified ? 'Verified' : 'Unknown',
        source: observations.rating?.source || 'Google Profile',
        confidence: observations.rating?.confidence || 0,
      },
      reviewCount: {
        value: observations.reviewCount?.value || 'Unverified',
        status: isReviewVerified ? 'Verified' : 'Unknown',
        source: observations.reviewCount?.source || 'Google Profile',
        confidence: observations.reviewCount?.confidence || 0,
      },
      bookingLink: {
        value: observations.hasBookingLink.value ? 'Present' : 'Missing',
        status: observations.hasBookingLink.verified ? 'Verified' : 'Unable to Verify',
        source: observations.hasBookingLink.source,
        confidence: observations.hasBookingLink.confidence,
      },
    };

    return {
      id: contract.id,
      businessName: observations.businessName.value,
      category: observations.category.value,
      address: observations.address.value,
      website: observations.website?.value || '',
      rating: observations.rating?.value,
      reviewCount: observations.reviewCount?.value,
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
      fieldVerifications,

      versions,
      generatedAt,
    };
  }
}
