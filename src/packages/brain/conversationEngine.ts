import { BusinessContext, ConversationObject, DiagnosisData, ObservationData } from '../shared/types';

export const CONVERSATION_VERSION = '0.3';

/**
 * Stage 5 — Conversation Engine (AI Layer)
 * Consumes Diagnosis & Unknowns to design structured sales discovery object.
 */
export async function designConversation(
  diagnosis: DiagnosisData,
  observations: ObservationData,
  context: BusinessContext
): Promise<ConversationObject> {
  const executionId = diagnosis.executionId;
  const firstQuestion = '“What percentage of your appointments come from online bookings versus phone calls?”';

  const discoveryQuestions = [
    firstQuestion,
    '“How do you currently handle appointment inquiries outside normal office hours?”',
    '“What is your team’s typical follow-up time for website callback forms?”',
  ];

  const avoidTopics = [
    {
      topic: 'Reviews & Reputation',
      reason: "I wouldn't spend today's conversation talking about reviews. You're already winning there.",
    },
  ];

  return {
    executionId,
    openingAngle: `Rapport around customer ratings (⭐ ${observations.rating?.value || 4.8}), transitioning to intake channel friction.`,
    firstQuestion,
    discoveryQuestions,
    avoidTopics,
    hypothesis: 'Intake friction is the primary conversion bottleneck; after-hours mobile leads are leaking.',
    successMetric: 'Prospect validates after-hours lead leakage and agrees to evaluate 24/7 digital intake.',
    conversationVersion: CONVERSATION_VERSION,
  };
}
