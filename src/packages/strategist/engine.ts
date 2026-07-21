/**
 * Pheebs Core - Genesis Strategist Engine
 * Input: Diagnosis -> Output: Strategy (talkAbout, avoid, questions, opening, watchouts)
 */

import { Diagnosis, Strategy } from '../shared/types';
import { getAIProvider } from '../ai';
import { STRATEGIST_SYSTEM_PROMPT, buildStrategistPrompt } from './prompt';

export async function formulateStrategy(diagnosis: Diagnosis): Promise<Strategy> {
  const provider = getAIProvider();
  const prompt = buildStrategistPrompt(diagnosis);
  const timestamp = new Date().toISOString();
  const id = `strat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  try {
    const rawResult = await provider.generateJSON<Partial<Strategy>>(prompt, STRATEGIST_SYSTEM_PROMPT);
    
    if (rawResult && rawResult.opening && Array.isArray(rawResult.questions) && rawResult.questions.length > 0) {
      return {
        id,
        diagnosisId: diagnosis.id,
        talkAbout: rawResult.talkAbout || ['Automated missed-call text-backs', '2-click friction-free booking'],
        avoid: rawResult.avoid || ['Pitching software features', 'Discussing monthly subscription pricing early'],
        questions: rawResult.questions,
        opening: rawResult.opening,
        watchouts: rawResult.watchouts || ['Receptionist resistance to workflow change', 'Fear of alienating older patients'],
        createdat: timestamp
      };
    }
  } catch (e) {
    console.warn('AI strategy call failed, using deterministic first-principles strategy fallback:', e);
  }

  // First-principles fallback strategy formulation based on diagnosed constraint
  const constraintLower = diagnosis.primaryConstraint.toLowerCase();

  let opening = "I noticed your team gets high ratings online, but inbound emergency calls during peak hours might be getting diverted. How do you handle calls when the front desk is occupied with patient checkouts?";
  let talkAbout = [
    "Instant automated text-back assistant that captures missed calls in under 5 seconds",
    "Zero-registration booking link sent straight to patient SMS",
    "Eliminating after-hours patient drop-off to local competitors"
  ];
  let avoid = [
    "Pitching complex software dashboards or AI buzzwords",
    "Quoting monthly pricing before proving missed appointment cost",
    "Suggesting front-desk staff replacement"
  ];
  let questions = [
    "When a patient calls while your receptionist is checking someone out, what happens to that caller?",
    "If you lose just 2 emergency appointments a week to unanswered lines, what does that cost the clinic monthly?"
  ];
  let watchouts = [
    "Front-desk staff may feel threatened by automation—frame as relief from phone harassment during checkout",
    "Office manager may claim their voicemail system is sufficient—ask how many voicemails actually turn into booked slots"
  ];

  if (constraintLower.includes('weekend') || constraintLower.includes('after-hours')) {
    opening = "Two recent patients mentioned trying to reach your office over the weekend for emergency care. What is your current protocol for after-hours patient inquiries?";
    questions = [
      "How many weekend emergency calls or PDF form submissions go unanswered until Monday morning?",
      "Would an automated weekend assistant that books open Monday morning slots solve that leakage?"
    ];
  } else if (constraintLower.includes('registration') || constraintLower.includes('friction')) {
    opening = "We noticed your online booking link requires patients to fill out a multi-step registration form before seeing available times. Have you measured how many patients abandon that page halfway through?";
    questions = [
      "What percentage of visitors who click 'Book Appointment' actually complete the full form?",
      "If we simplified booking to a 2-click phone verification, how many lost appointments would that recover?"
    ];
  }

  return {
    id,
    diagnosisId: diagnosis.id,
    talkAbout,
    avoid,
    questions,
    opening,
    watchouts,
    createdat: timestamp
  };
}
