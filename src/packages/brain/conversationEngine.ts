import { BusinessContext, ConversationObject, DiagnosisData, ObservationData } from '../shared/types';

export const CONVERSATION_VERSION = '0.2';

/**
 * Stage 5 — Conversation Engine (AI Layer)
 * Consumes Unknowns assets and Diagnosis to produce a pure structured ConversationObject.
 */
export async function designConversation(
  diagnosis: DiagnosisData,
  observations: ObservationData,
  context: BusinessContext
): Promise<ConversationObject> {
  const constraint = diagnosis.primaryConstraint;
  const unknowns = diagnosis.knowledgeAssets.unknown;

  // Convert Unknowns directly into high-leverage Discovery Questions
  const discoveryQuestions = unknowns.map((u) => `“To help me understand your setup: ${u.toLowerCase()}?”`);

  if (constraint === 'Conversion') {
    return {
      openingAngle: 'Inbound intake friction & after-hours lead leakage',
      firstQuestion: `“When someone decides they want to book with ${observations.businessName}, where do you think the biggest drop-off happens?”`,
      discoveryQuestions: [
        `“How do you currently handle appointment requests that come in after 5 PM or over the weekend?”`,
        ...discoveryQuestions,
      ],
      avoidTopics: [
        { topic: 'Website Overhaul', reason: 'Redesigning the website is unnecessary when the core issue is intake friction.' },
        { topic: 'Paid Ads', reason: 'Driving ads to a phone-only booking path burns budget.' },
      ],
      hypothesis: `${observations.businessName} has established social proof, but leaks mobile searchers outside office hours due to an offline intake process.`,
      successMetric: 'Eliminating intake friction so searchers confirm appointments 24/7.',
      conversationVersion: CONVERSATION_VERSION,
    };
  }

  if (constraint === 'Trust') {
    return {
      openingAngle: 'Review volume parity & social proof acceleration',
      firstQuestion: `“What percentage of your happiest ${context.targetPersona} clients actually leave a Google review today?”`,
      discoveryQuestions: [
        `“How do you currently request reviews after a successful service?”`,
        ...discoveryQuestions,
      ],
      avoidTopics: [
        { topic: 'Paid Search Ads', reason: 'Ads perform poorly when review volume is low.' },
      ],
      hypothesis: `Increasing review volume to local industry parity will boost top-of-funnel conversion without extra ad spend.`,
      successMetric: 'Building automated review capture to achieve local review parity in 60 days.',
      conversationVersion: CONVERSATION_VERSION,
    };
  }

  return {
    openingAngle: 'Discovery & operational baseline verification',
    firstQuestion: `“Walk me through how a prospective client finds and schedules with ${observations.businessName} today?”`,
    discoveryQuestions,
    avoidTopics: [
      { topic: 'Premature Solutions', reason: 'Validate operational bottleneck before proposing solutions.' },
    ],
    hypothesis: 'Public evidence is sparse; validate operational bottleneck directly during discovery.',
    successMetric: 'Validating primary operational bottleneck through direct AE discovery.',
    conversationVersion: CONVERSATION_VERSION,
  };
}
