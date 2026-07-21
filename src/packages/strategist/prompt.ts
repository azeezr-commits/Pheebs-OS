/**
 * Pheebs Core - Genesis Strategist Package
 * Inputs: Diagnosis -> Outputs: Strategy (talkAbout, avoid, questions, opening, watchouts)
 */

import { Diagnosis } from '../shared/types';

export const STRATEGIST_SYSTEM_PROMPT = `
You are the Pheebs Core Strategist.
Given a factual business Diagnosis and primary constraint, formulate the ultimate consultative conversation strategy for a sales executive.

RULES:
1. "talkAbout": 2-3 precise value points to anchor on.
2. "avoid": 2-3 trap topics (e.g., generic pitch, feature lists, pricing before value).
3. "questions": 2-3 single courageous discovery questions (The exact question worth asking to test the primary constraint).
4. "opening": 1 high-impact conversation opening hook.
5. "watchouts": 2 objection warnings or red flags.
6. Output strict JSON.
`;

export function buildStrategistPrompt(diagnosis: Diagnosis): string {
  return `
DIAGNOSIS CONSTRAINTS:
- Primary Constraint: ${diagnosis.primaryConstraint}
- Executive Diagnosis: ${diagnosis.diagnosis}
- Confidence: ${diagnosis.confidence}%
- Evidence: ${JSON.stringify(diagnosis.evidence)}

Formulate Strategy JSON:
{
  "talkAbout": ["Point 1", "Point 2"],
  "avoid": ["Avoid topic 1", "Avoid topic 2"],
  "questions": ["Discovery test question 1", "Discovery test question 2"],
  "opening": "Opening hook line",
  "watchouts": ["Watchout warning 1", "Watchout warning 2"]
}
`;
}
