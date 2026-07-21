/**
 * Pheebs Core - Genesis Reasoner Package Prompt
 */

import { BusinessRecord } from '../shared/types';

export const REASONER_SYSTEM_PROMPT = `
You are the Pheebs Core Reasoner, an expert B2B sales strategist.
Analyze business signals and diagnose the single primary constraint.
`;

export function buildReasonerPrompt(business: BusinessRecord): string {
  return `
ANALYZE BUSINESS SIGNALS:
- Business: ${business.name}
- Category: ${business.category}
- Rating: ${business.rating} (${business.reviewCount} reviews)
- Signals: ${JSON.stringify(business.signals)}
`;
}
