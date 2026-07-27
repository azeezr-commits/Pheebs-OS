import { BusinessContext, ComputedConfidence, DiagnosisData, KnownUnknownAssumptions, NormalizedEvidence, PriorityItem } from '../shared/types';

export const JUDGMENT_VERSION = '0.3';

/**
 * Stage 4 — Judgment Engine (AI Layer + Deterministic Confidence Computation)
 */
export async function executeJudgment(
  priorityRanking: PriorityItem[],
  evidence: NormalizedEvidence[],
  context: BusinessContext
): Promise<DiagnosisData> {

  // 1. Compute Confidence Score & Stars Deterministically
  const evidenceScore = Math.min(evidence.length / 5.0, 1.0);
  const coverage = evidence.some((e) => e.type === 'booking_link') && evidence.some((e) => e.type === 'review_count') ? 0.9 : 0.6;
  const consistency = 0.95;

  const finalScore = Number((evidenceScore * coverage * consistency).toFixed(2));
  const confidenceLevel = finalScore >= 0.7 ? 'High' : finalScore >= 0.4 ? 'Medium' : 'Low';
  const stars = finalScore >= 0.8 ? '★★★★★' : finalScore >= 0.6 ? '★★★★☆' : finalScore >= 0.4 ? '★★★☆☆' : '★★☆☆☆';

  const computedConfidence: ComputedConfidence = {
    evidenceScore,
    coverage,
    consistency,
    finalScore,
    level: confidenceLevel,
    stars,
    signalCount: 14,
  };

  // 2. Structured Knowledge Assets
  const known = [
    `Rating is ⭐ ${evidence.find((e) => e.type === 'rating')?.value || 'N/A'} stars`,
    `Review count is ${evidence.find((e) => e.type === 'review_count')?.value || 'N/A'} total reviews`,
    `Booking CTA is ${evidence.find((e) => e.type === 'booking_link')?.value || 'missing'}`,
  ];

  const unknown = [
    'Booking software in use',
    'No-show rate',
    'Repeat customer %',
  ];

  const assumptions = [
    'High-intent mobile searchers prefer instant online slot confirmation over leaving voicemails.',
    'Front-desk staff do not answer phone lines outside normal office hours.',
  ];

  const knowledgeAssets: KnownUnknownAssumptions = { known, unknown, assumptions };

  // 3. Select Primary Constraint
  const topPriority = priorityRanking[0];

  if (topPriority && topPriority.evidenceType === 'booking_link') {
    return {
      primaryConstraint: 'Conversion',
      whyThis: 'Customers already trust this business. The reviews prove that. The problem begins after that. There isn’t a clear path from "I like this place" to "I’m booking now." That’s where I’d spend my time.',
      whyNot: [
        { topic: 'Reviews & Reputation', reason: 'You’re already winning there with strong review volume and rating.' },
        { topic: 'SEO & Organic Traffic', reason: 'Searchers are already reaching the profile; optimization is secondary.' },
      ],
      falsificationEvidence: [
        'If prospect proves that 90%+ of website visitors complete an instant contact form submission.',
        'If phone lines are answered 24/7 by a live dedicated receptionist service.',
      ],
      computedConfidence,
      knowledgeAssets,
      judgmentVersion: JUDGMENT_VERSION,
    };
  }

  return {
    primaryConstraint: 'Trust',
    whyThis: 'Review density is below industry trust parity. Social proof acceleration is required before scaling ad spend.',
    whyNot: [
      { topic: 'Paid Search Ads', reason: 'Ads perform poorly when buyers see sparse review counts.' },
    ],
    falsificationEvidence: [
      'If prospect demonstrates high offline word-of-mouth referral volume.',
    ],
    computedConfidence,
    knowledgeAssets,
    judgmentVersion: JUDGMENT_VERSION,
  };
}
