import { buildObservationReport } from '../observer/observationReport';
import { DeveloperObservationReport, ObservationStatus, PheebsBrief, ReasoningContract } from '../shared/types';

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
  public static projectContractToBrief(
    contract: ReasoningContract,
    customReport?: DeveloperObservationReport
  ): PheebsBrief {
    const { observations, diagnosis, conversation, editorial, versions, generatedAt, executionId } = contract;

    const avoidTopic = conversation.avoidTopics[0] || {
      topic: 'Reviews & Reputation',
      reason: "I wouldn't spend today's conversation talking about reviews. You're already winning there.",
    };

    const isRatingVerified = observations.rating?.status === ObservationStatus.VERIFIED || observations.rating?.status === ObservationStatus.PLAUSIBLE;
    const isReviewVerified = observations.reviewCount?.status === ObservationStatus.VERIFIED || observations.reviewCount?.status === ObservationStatus.PLAUSIBLE;

    const evidenceFacts: Array<{ label: string; isPositive: boolean; status: ObservationStatus }> = [
      {
        label: isRatingVerified ? `⭐ ${observations.rating!.value} rating` : '⭐ Rating unverified',
        isPositive: isRatingVerified && (observations.rating!.value >= 4.0),
        status: observations.rating?.status || ObservationStatus.MISSING,
      },
      {
        label: isReviewVerified ? `${observations.reviewCount!.value} reviews` : 'Review count unverified',
        isPositive: isReviewVerified && (observations.reviewCount!.value >= 30),
        status: observations.reviewCount?.status || ObservationStatus.MISSING,
      },
      {
        label: 'Website exists',
        isPositive: observations.website?.status === ObservationStatus.VERIFIED || observations.website?.status === ObservationStatus.PLAUSIBLE,
        status: observations.website?.status || ObservationStatus.MISSING,
      },
      {
        label: observations.hasBookingLink.value ? 'Visible booking CTA' : 'No visible booking CTA',
        isPositive: observations.hasBookingLink.value,
        status: observations.hasBookingLink.status,
      },
      {
        label: 'No online scheduler detected',
        isPositive: false,
        status: ObservationStatus.VERIFIED,
      },
      {
        label: 'Active Google Profile',
        isPositive: observations.businessName.status === ObservationStatus.VERIFIED || observations.businessName.status === ObservationStatus.PLAUSIBLE,
        status: observations.businessName.status,
      },
    ];

    const observationReport = customReport || buildObservationReport(executionId, observations);

    return {
      id: contract.id,
      executionId,
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
        evidenceCoveragePercent: observationReport.overallConfidencePercent,
        verifiedSignalsCount: Object.values(observationReport.criticalFieldsStatus).filter((s) => s === ObservationStatus.VERIFIED || s === ObservationStatus.PLAUSIBLE).length,
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
      evidenceCoveragePercent: observationReport.overallConfidencePercent,
      verifiedSignalsCount: Object.values(observationReport.criticalFieldsStatus).filter((s) => s === ObservationStatus.VERIFIED || s === ObservationStatus.PLAUSIBLE).length,

      // 7. UNKNOWNS
      unknowns: diagnosis.knowledgeAssets.unknown,

      // 8. MEMORABLE FOOTER
      memorableFooter: editorial.memorableFooter || 'Pheebs noticed... People already trust this business. Trust isn’t always the bottleneck.',

      // Developer Observation Report
      observationReport,

      versions,
      generatedAt,
    };
  }
}
