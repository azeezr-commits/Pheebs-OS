/**
 * Brief by Pheebs — High-Conviction Brief Generator Engine (PHEEBS v0.0 UI Format)
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
      topic: 'Booking Friction',
      headline: "I'd start with Booking Friction. Not reviews. Not SEO. Booking.",
      paragraph: 'Not reviews. Not SEO. Booking.',
      primaryConstraint: 'Conversion',
      confidence: 'High',
      confidenceStars: '★★★★☆',
      signalCount: 14,
    },

    whyParagraph: 'Customers already trust this business. The reviews prove that. The problem begins after that. There isn’t a clear path from "I like this place" to "I’m booking now." That’s where I’d spend my time.',

    evidenceFacts: [
      { label: '⭐ 4.6 rating', isPositive: true },
      { label: '142 reviews', isPositive: true },
      { label: 'Website exists', isPositive: true },
      { label: 'No visible booking CTA', isPositive: false },
      { label: 'No online scheduler detected', isPositive: false },
      { label: 'Active Google Profile', isPositive: true },
    ],

    firstQuestion: '“What percentage of your appointments come from online bookings versus phone calls?”',

    dontWasteTimeOn: {
      topic: 'Reviews & Reputation',
      reason: "I wouldn't spend today's conversation talking about reviews. You're already winning there.",
    },

    confidenceStars: '★★★★☆',
    confidenceLevel: 'High',
    signalCount: 14,

    unknowns: [
      'Booking software in use',
      'No-show rate',
      'Repeat customer %',
    ],

    memorableFooter: 'Pheebs noticed... People already trust this business. Trust isn’t always the bottleneck.',

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
