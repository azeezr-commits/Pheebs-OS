import { BusinessContext, ConversationObject, DiagnosisData, EditorialOutput, GoldenRuleAnswers, NormalizedEvidence, ObservationData, PriorityItem, ThinkingTrace } from '../shared/types';

export const BRIEF_RENDERER_VERSION = '0.1';

/**
 * Stage 6 — Brief Renderer (Deterministic Presentation Layer)
 * Receives complete ReasoningContract data.
 * Rule: NEVER thinks or alters decisions. Strictly renders UI brief & secret ThinkingTrace.
 */
export async function renderBrief(
  observations: ObservationData,
  evidence: NormalizedEvidence[],
  priorityRanking: PriorityItem[],
  diagnosis: DiagnosisData,
  conversation: ConversationObject,
  context: BusinessContext
): Promise<{ editorial: EditorialOutput; goldenRule: GoldenRuleAnswers; trace: ThinkingTrace }> {

  const headline = conversation.openingAngle;

  const executiveSummary =
    diagnosis.primaryConstraint === 'Unknown'
      ? 'Insufficient public evidence to establish a high-conviction constraint. Validate intake flow directly with the prospect.'
      : `${observations.businessName} has established social proof (${observations.reviewCount || 0} reviews, ⭐ ${observations.rating || 0}), but faces a ${diagnosis.primaryConstraint} constraint. ${diagnosis.whyThis}`;

  const openingScript = `“Hi! I was reviewing ${observations.businessName}’s public digital footprint. I noticed you’ve built solid trust with ⭐ ${observations.rating} stars across ${observations.reviewCount} reviews, but I wanted to see how you currently handle after-hours inquiry capture when callers reach your office outside normal hours.”`;

  const keyObjections = [
    {
      objection: '“Our front desk handles calls fine during office hours.”',
      response: '“That makes sense. The key gap is what happens when high-intent prospects search on mobile after 5 PM or over the weekend.”',
    },
    {
      objection: '“We get most of our business through word of mouth.”',
      response: '“Word of mouth brings them to Google search. But if the booking link isn’t instant, searchers often check out local competitors.”',
    },
    {
      objection: '“We don’t have budget for new tools right now.”',
      response: '“If capturing 2 missed consultations per month pays for the system 5x over, is budget the blocker or proving ROI?”',
    },
  ];

  const beforeYouAssume = [
    '• Verify who has final sign-off authority for operational decisions.',
    '• Confirm if an alternative booking tool is being tested internally.',
    '• Check whether phone call routing goes to a call center or single front-desk line.',
  ];

  const topPriority = priorityRanking[0];
  const goldenRule: GoldenRuleAnswers = {
    whatObserved: [
      `⭐ ${observations.rating} star rating across ${observations.reviewCount} reviews`,
      observations.hasBookingLink ? 'Direct booking CTA present' : 'Missing direct 24/7 online booking CTA',
      `${observations.photosCount} photos uploaded`,
    ],
    whyItMatters: topPriority ? topPriority.importanceReason : 'Shapes prospective customer perception and booking conversion.',
    whyMoreImportant: `Ranked #1 priority (${topPriority?.label || 'Primary Constraint'}) because solving intake friction yields immediate ROI before scaling traffic.`,
    conversationToHave: `Focus on ${conversation.openingAngle}. Ask: ${conversation.firstQuestion}`,
    evidenceProvingWrong: diagnosis.falsificationEvidence,
  };

  // Secret Execution Trace for Debugging & Feedback Memory
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
    },
    goldenRule,
    trace,
  };
}
