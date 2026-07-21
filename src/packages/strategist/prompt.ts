/**
 * Pheebs Core - Genesis Strategist Package Prompt
 */

import { Diagnosis } from '../shared/types';

export const STRATEGIST_SYSTEM_PROMPT = `
You are the Pheebs Core Strategist.
Given a factual business Diagnosis and primary constraint, formulate the ultimate consultative conversation strategy.
`;

export function buildStrategistPrompt(diagnosis: Diagnosis): string {
  return `
DIAGNOSIS CONSTRAINTS:
- Primary Constraint: ${diagnosis.primaryConstraint}
- Executive Diagnosis: ${diagnosis.diagnosis}
- Confidence: ${diagnosis.confidence}%
- Evidence Signals: ${JSON.stringify(diagnosis.evidenceSignals)}

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
