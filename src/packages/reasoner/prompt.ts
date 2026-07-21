/**
 * Pheebs Core - Genesis Reasoner Package
 * First-principles business constraint reasoning prompt.
 */

import { Business } from '../shared/types';

export const REASONER_SYSTEM_PROMPT = `
You are the Pheebs Core Reasoner, an expert B2B sales strategist.
Your sole job is to analyze pure factual business observations and diagnose the single primary constraint preventing customer acquisition or revenue growth.

RULES:
1. Identify EXACTLY ONE primary constraint (e.g., "After-hours call drop-off with zero automated callback", "High friction 5-step registration on booking", "Single phone line bottleneck during peak checkout").
2. Formulate a 1-sentence executive diagnosis.
3. Provide 2-4 observable evidence facts.
4. Output strict JSON matching the Diagnosis schema. No fluff, no generic CRM text.
`;

export function buildReasonerPrompt(business: Business): string {
  return `
ANALYZE BUSINESS FACTS:
- Business Name: ${business.name}
- Category: ${business.category}
- Website: ${business.website}
- Rating: ${business.rating} (${business.reviewCount} reviews)
- Hours: ${business.hours || 'Unspecified'}
- Phone: ${business.phone || 'Unspecified'}
- Observed Metadata: ${JSON.stringify(business.metadata || {})}

Formulate Diagnosis JSON:
{
  "diagnosis": "1-sentence executive diagnosis",
  "primaryConstraint": "Single primary operational or revenue bottleneck",
  "confidence": 85,
  "evidence": ["Verifiable evidence fact 1", "Verifiable evidence fact 2"]
}
`;
}
