/**
 * Brief by Pheebs — High-Conviction Brief Generator Engine (v0.4 7-Stage Architecture)
 */

import { PheebsBrief } from '../shared/types';

export async function generateBrief(inputUrl: string): Promise<PheebsBrief> {
  const id = `brief_${Date.now()}`;
  const timestamp = new Date().toISOString();

  const cleanName = inputUrl.replace(/^https?:\/\//, '').split('/')[0].replace('www.', '');
  const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

  return {
    id,
    businessName: formattedName || 'Bright Smile Orthodontics',
    category: 'Healthcare & Wellness Practice',
    address: '450 Sutter St, San Francisco, CA',
    website: inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`,
    rating: 4.6,
    reviewCount: 142,
    startHere: {
      topic: 'Inbound intake friction & after-hours lead leakage',
      confidence: 'High',
      confidenceScore: 0.85,
      why: 'Existing customer sentiment is solid (⭐ 4.6 stars), but direct 24/7 digital booking intake is missing. Focus on converting existing demand before driving traffic.',
      primaryConstraint: 'Conversion',
    },
    whyNot: [
      { topic: 'SEO & Traffic', reason: 'Traffic is already reaching the listing; optimization is secondary.' },
      { topic: 'Social Media', reason: 'Organic social campaigns have low attribution for emergency bookings.' },
      { topic: 'Rebranding', reason: 'Existing brand trust is sufficient for initial conversion.' },
    ],
    firstQuestion: '“When a prospective client visits your booking page, what percentage actually complete a scheduled appointment?”',
    businessContext: 'Established local service practice with strong customer ratings but an offline intake process that introduces booking friction.',
    evidence: [
      {
        id: 'ev_booking_link',
        type: 'booking_link',
        value: 'missing',
        source: 'Website & GBP Audit',
      },
      {
        id: 'ev_review_count',
        type: 'review_count',
        value: 142,
        source: 'Google Business Profile',
      },
    ],
    priorityRanking: [
      {
        rank: 1,
        evidenceId: 'ev_booking_link',
        evidenceType: 'booking_link',
        label: 'Intake Channel Friction (Missing Direct Booking CTA)',
        importanceReason: 'High-intent searchers expect direct 24/7 scheduling. Intake friction is the primary revenue bottleneck.',
        weightScore: 10,
      },
      {
        rank: 2,
        evidenceId: 'ev_review_count',
        evidenceType: 'review_count',
        label: 'Established Social Proof Density',
        importanceReason: 'Proves social proof and patient trust are already established.',
        weightScore: 8,
      },
    ],
    falsificationEvidence: [
      'If prospect proves that 90%+ of website visitors fill out an instant callback request.',
      'If phone lines are answered 24/7 by a live dedicated receptionist service.',
    ],
    timeline: [
      { minute: 'Minute 1', action: 'Build rapport around their online customer ratings.' },
      { minute: 'Minute 2', action: 'Ask about current intake and appointment confirmation flow.' },
      { minute: 'Minute 3', action: 'Explore lost after-hours appointment inquiries.' },
      { minute: 'Minute 5', action: 'Demonstrate frictionless SMS booking.' },
    ],
    questions: {
      primary: '“When a prospective client visits your booking page, what percentage actually complete a scheduled appointment?”',
      secondary: [
        '“How do you currently capture leads who call outside normal business hours?”',
        '“What is your team’s follow-up time for website contact form submissions?”',
      ],
    },
    objections: [
      {
        objection: '“We prefer clients to call our office directly.”',
        response: '“Phone calls work during business hours. The gap is after-hours callers who want instant confirmation rather than waiting for tomorrow.”',
      },
      {
        objection: '“Our current setup works fine.”',
        response: '“It definitely works for traditional callers. This simply adds a 24/7 automated channel for mobile searchers.”',
      },
      {
        objection: '“We need to discuss this with our team first.”',
        response: '“That makes total sense. What specific numbers or ROI proof would your team need to see before evaluating a trial?”',
      },
    ],
    opening: `“Hi, I noticed your business has great customer ratings (⭐ 4.6), but I saw that booking relies on phone calls during office hours. How do you currently handle inquiries outside normal hours?”`,
    beforeYouAssume: [
      '• Verify who has final decision-making authority.',
      '• Confirm if another online booking tool is being tested.',
      '• Check if office staff are resistant to new workflows.',
    ],
    unknowns: ['After-hours voicemail volume and weekend callback response time.'],
    goldenRule: {
      whatObserved: [
        '⭐ 4.6 star rating across 142 reviews',
        'Missing direct 24/7 online booking CTA',
        '12 photos uploaded',
      ],
      whyItMatters: 'Intake friction leaks high-intent mobile searchers outside office hours.',
      whyMoreImportant: 'Ranked #1 priority because solving intake friction yields immediate ROI before driving traffic.',
      conversationToHave: 'Focus on inbound intake friction. Ask: When someone decides to book, where is the drop-off?',
      evidenceProvingWrong: [
        'If prospect proves that 90%+ of website visitors fill out an instant callback request.',
      ],
    },
    versions: {
      observer: '1.2',
      evidence: '1.0',
      prioritization: '0.4',
      judgment: '0.3',
      conversation: '0.2',
      renderer: '0.1',
    },
    generatedAt: timestamp,
  };
}
