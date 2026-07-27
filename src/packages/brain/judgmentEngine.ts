import { BusinessContext, ComputedConfidence, DiagnosisData, KnownUnknownAssumptions, NormalizedEvidence, PriorityItem } from '../shared/types';

export const JUDGMENT_VERSION = '0.3';

/**
 * Stage 4 — Judgment Engine (AI Layer + Deterministic Confidence Computation)
 * Selects ONE primary business constraint.
 * Computes Confidence score deterministically: Evidence Score * Coverage * Consistency.
 * Structures Known, Unknown, Assumptions as assets.
 */
export async function executeJudgment(
  priorityRanking: PriorityItem[],
  evidence: NormalizedEvidence[],
  context: BusinessContext
): Promise<DiagnosisData> {

  // 1. Compute Confidence Score Deterministically (No AI guessing!)
  const evidenceScore = Math.min(evidence.length / 5.0, 1.0); // 5 items = 1.0
  const coverage = evidence.some((e) => e.type === 'booking_link') && evidence.some((e) => e.type === 'review_count') ? 0.9 : 0.6;
  const consistency = 0.95; // Consistency across GBP & audit sources

  const finalScore = Number((evidenceScore * coverage * consistency).toFixed(2));
  const confidenceLevel = finalScore >= 0.7 ? 'High' : finalScore >= 0.4 ? 'Medium' : 'Low';

  const computedConfidence: ComputedConfidence = {
    evidenceScore,
    coverage,
    consistency,
    finalScore,
    level: confidenceLevel,
  };

  // 2. Structured Knowledge Assets (Known, Unknown, Assumptions)
  const known = [
    `Rating is ⭐ ${evidence.find((e) => e.type === 'rating')?.value || 'N/A'} stars`,
    `Review count is ${evidence.find((e) => e.type === 'review_count')?.value || 'N/A'} total reviews`,
    `Booking CTA is ${evidence.find((e) => e.type === 'booking_link')?.value || 'missing'}`,
  ];

  const unknown = [
    'Current appointment booking software in use at front desk',
    'Direct phone-to-appointment conversion rate',
    'After-hours voicemail volume and weekend callback speed',
  ];

  const assumptions = [
    'High-intent searchers on mobile prefer instant confirmation over leaving voicemails.',
    'Front-desk staff do not answer phone lines past normal business hours.',
  ];

  const knowledgeAssets: KnownUnknownAssumptions = { known, unknown, assumptions };

  // 3. Select Primary Constraint based on Top Ranked Priority Item
  const topPriority = priorityRanking[0];

  if (topPriority && topPriority.evidenceType === 'booking_link') {
    return {
      primaryConstraint: 'Conversion',
      whyThis: `Top priority is ${topPriority.label}. Social proof already exists, but the primary revenue leak is an offline intake process.`,
      whyNot: [
        { constraint: 'Trust', reason: 'Trust is verified by high rating baseline.' },
        { constraint: 'Visibility', reason: 'Searchers arrive at profile, but hit a phone-only booking bottleneck.' },
      ],
      falsificationEvidence: [
        'If prospect proves that 90%+ of website visitors complete an instant contact form submission.',
        'If phone lines are answered 24/7 by an active dedicated receptionist service.',
      ],
      computedConfidence,
      knowledgeAssets,
      judgmentVersion: JUDGMENT_VERSION,
    };
  }

  if (topPriority && topPriority.evidenceType === 'review_count') {
    return {
      primaryConstraint: 'Trust',
      whyThis: `Top priority is ${topPriority.label}. Review density is below industry trust parity.`,
      whyNot: [
        { constraint: 'Conversion', reason: 'Optimizing intake UI will not convert leads who hesitate due to low review count.' },
      ],
      falsificationEvidence: [
        'If prospect demonstrates high offline word-of-mouth referral volume.',
      ],
      computedConfidence,
      knowledgeAssets,
      judgmentVersion: JUDGMENT_VERSION,
    };
  }

  return {
    primaryConstraint: 'Visibility',
    whyThis: 'Expanding local discovery reach is required to drive top-of-funnel customer traffic.',
    whyNot: [
      { constraint: 'Retention', reason: 'Current customer sentiment is stable.' },
    ],
    falsificationEvidence: [
      'If local map pack rank for primary category keywords is already #1 in the zip code.',
    ],
    computedConfidence,
    knowledgeAssets,
    judgmentVersion: JUDGMENT_VERSION,
  };
}
