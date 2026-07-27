import { BusinessContext, ConversationObject, DiagnosisData, EditorialOutput, GoldenRuleAnswers, NormalizedEvidence, ObservationData, PriorityItem, ThinkingTrace } from '../shared/types';

export const BRIEF_RENDERER_VERSION = '0.1';

/**
 * Stage 6 — Brief Renderer (PHEEBS v0.0 UI Format)
 */
export async function renderBrief(
  observations: ObservationData,
  evidence: NormalizedEvidence[],
  priorityRanking: PriorityItem[],
  diagnosis: DiagnosisData,
  conversation: ConversationObject,
  context: BusinessContext
): Promise<{ editorial: EditorialOutput; goldenRule: GoldenRuleAnswers; trace: ThinkingTrace }> {

  const headline = `I'd start with ${diagnosis.primaryConstraint === 'Conversion' ? 'Booking Friction' : 'Review Parity'}. Not reviews. Not SEO. Booking.`;

  const executiveSummary = diagnosis.whyThis;

  const openingScript = conversation.firstQuestion;

  const keyObjections = [
    {
      objection: '“Our front desk handles calls fine during office hours.”',
      response: '“That makes sense. The key gap is what happens when high-intent prospects search on mobile after 5 PM or over the weekend.”',
    },
  ];

  const beforeYouAssume = [
    '• Verify who has final sign-off authority.',
    '• Confirm if an alternative booking tool is being tested internally.',
  ];

  const memorableFooter = 'Pheebs noticed... People already trust this business. Trust isn’t always the bottleneck.';

  const topPriority = priorityRanking[0];
  const goldenRule: GoldenRuleAnswers = {
    whatObserved: [
      `⭐ ${observations.rating} rating`,
      `${observations.reviewCount} reviews`,
      observations.hasBookingLink ? 'Visible booking CTA' : 'No visible booking CTA',
    ],
    whyItMatters: topPriority ? topPriority.importanceReason : 'Shapes prospective customer booking conversion.',
    whyMoreImportant: 'Ranked #1 priority because solving intake friction yields immediate ROI.',
    conversationToHave: conversation.firstQuestion,
    evidenceProvingWrong: diagnosis.falsificationEvidence,
  };

  const trace: ThinkingTrace = {
    traceId: `trace_${Date.now()}`,
    timestamp: new Date().toISOString(),
    stages: {
      stage0_context: context,
      stage1_observations: observations,
      stage2_evidence: evidence,
      stage3_prioritization: priorityRanking,
      stage4_judgment: diagnosis,
      stage5_conversation: conversation,
    },
  };

  return {
    editorial: {
      headline,
      executiveSummary,
      openingScript,
      keyObjections,
      beforeYouAssume,
      memorableFooter,
    },
    goldenRule,
    trace,
  };
}
