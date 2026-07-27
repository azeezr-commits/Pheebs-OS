import { BusinessContext, NormalizedEvidence, PriorityItem } from '../shared/types';
import { getKnowledgePack } from '../industryPacks';

export const PRIORITIZATION_VERSION = '0.4';

/**
 * Stage 3 — Prioritization (AI Reasoning Layer)
 * Question: "What matters most?"
 * Consumes normalized evidence and Industry Knowledge weights to rank evidence priorities.
 */
export async function rankEvidencePriorities(
  evidence: NormalizedEvidence[],
  context: BusinessContext
): Promise<PriorityItem[]> {
  const pack = getKnowledgePack(context.industry);

  const priorities: PriorityItem[] = [];

  const bookingEv = evidence.find((e) => e.type === 'booking_link');
  const reviewEv = evidence.find((e) => e.type === 'review_count');
  const ratingEv = evidence.find((e) => e.type === 'rating');

  const bookingWeight = pack.weights.booking_link || 10;
  const reviewWeight = pack.weights.review_count || 8;

  let rankCounter = 1;

  // Evaluate Booking Link Evidence
  if (bookingEv && bookingEv.value === 'missing') {
    priorities.push({
      rank: rankCounter++,
      evidenceId: bookingEv.id,
      evidenceType: bookingEv.type,
      label: 'Intake Channel Friction (Missing Direct Booking CTA)',
      importanceReason: `In ${context.industry}, high-intent searchers expect instant online scheduling. Missing booking link leaks mobile search traffic.`,
      weightScore: bookingWeight,
    });
  }

  // Evaluate Review Density Evidence
  if (reviewEv) {
    const reviewCount = reviewEv.value as number;
    const isDeficit = reviewCount < pack.expectedReviewThreshold;
    priorities.push({
      rank: rankCounter++,
      evidenceId: reviewEv.id,
      evidenceType: reviewEv.type,
      label: isDeficit ? 'Review Density Volume Deficit' : 'Established Social Proof Density',
      importanceReason: isDeficit
        ? `Industry baseline requires ${pack.expectedReviewThreshold}+ reviews for local trust parity (${reviewCount} present).`
        : `Verified volume of ${reviewCount} reviews establishes strong local search trust.`,
      weightScore: reviewWeight,
    });
  }

  // Evaluate Rating Quality Evidence
  if (ratingEv) {
    priorities.push({
      rank: rankCounter++,
      evidenceId: ratingEv.id,
      evidenceType: ratingEv.type,
      label: 'Customer Sentiment Quality Baseline',
      importanceReason: `Average ⭐ ${ratingEv.value} star rating proves core service quality is already established once acquired.`,
      weightScore: pack.weights.rating || 6,
    });
  }

  // Sort strictly by weight score descending
  priorities.sort((a, b) => b.weightScore - a.weightScore);
  priorities.forEach((p, idx) => (p.rank = idx + 1));

  return priorities;
}
