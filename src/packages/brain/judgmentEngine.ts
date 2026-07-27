import { BusinessContext, ComputedConfidence, DiagnosisData, KnownUnknownHypotheses, NormalizedEvidence, ObservationStatus, PriorityItem } from '../shared/types';

export const JUDGMENT_VERSION = '0.5';

/**
 * Stage 4 — Judgment Engine (Replaces Assumptions with Post-Judgment Hypotheses)
 */
export async function executeJudgment(
  priorityRanking: PriorityItem[],
  evidence: NormalizedEvidence[],
  context: BusinessContext
): Promise<DiagnosisData> {

  // 1. Compute Evidence Coverage & Verified Signals
  const verifiedCount = evidence.filter((e) => e.verificationStatus === ObservationStatus.VERIFIED || e.verificationStatus === ObservationStatus.PLAUSIBLE).length;
  const totalCount = evidence.length > 0 ? evidence.length : 1;
  const coveragePercent = Math.round((verifiedCount / totalCount) * 100);

  const reasoningConfidence = coveragePercent >= 80 ? 'High' : coveragePercent >= 50 ? 'Medium' : 'Low';
  const stars = coveragePercent >= 85 ? '★★★★★' : coveragePercent >= 70 ? '★★★★☆' : coveragePercent >= 50 ? '★★★☆☆' : '★★☆☆☆';

  const computedConfidence: ComputedConfidence = {
    evidenceCoveragePercent: coveragePercent,
    verifiedSignalsCount: verifiedCount,
    totalSignalsCount: totalCount,
    reasoningConfidence,
    stars,
    finalScore: Number((coveragePercent / 100).toFixed(2)),
  };

  // 2. Structured Knowledge Assets (Hypotheses generated AFTER judgment, NEVER before!)
  const known = [
    `Rating is ⭐ ${evidence.find((e) => e.type === 'rating')?.value || 'Unverified'}`,
    `Review count is ${evidence.find((e) => e.type === 'review_count')?.value || 'Unverified'} total reviews`,
    `Booking CTA is ${evidence.find((e) => e.type === 'booking_link')?.value || 'missing'}`,
  ];

  const unknown = [
    'Booking software in use',
    'No-show rate',
    'Repeat customer %',
  ];

  const hypotheses = [
    'High-intent mobile searchers prefer instant online slot confirmation over leaving voicemails.',
    'Front-desk staff do not answer phone lines outside normal office hours.',
  ];

  const knowledgeAssets: KnownUnknownHypotheses = { known, unknown, hypotheses };

  // 3. Select Primary Constraint
  const topPriority = priorityRanking[0];
  const hasReviewsVerified = evidence.some((e) => e.type === 'review_count' && (e.verificationStatus === ObservationStatus.VERIFIED || e.verificationStatus === ObservationStatus.PLAUSIBLE));

  if (topPriority && topPriority.evidenceType === 'booking_link') {
    const whyThis = hasReviewsVerified
      ? 'Customers already trust this business. The reviews prove that. The problem begins after that. There isn’t a clear path from "I like this place" to "I’m booking now." That’s where I’d spend my time.'
      : 'Intake channel friction is the primary verifiable constraint. High-intent searchers lack a direct 24/7 online scheduling option.';

    return {
      primaryConstraint: 'Conversion',
      whyThis,
      whyNot: [
        { topic: 'Reviews & Reputation', reason: 'Focusing on reviews before fixing intake friction will leak converted leads.' },
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
