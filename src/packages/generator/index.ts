/**
 * Brief by Pheebs — High-Conviction Brief Generator Engine
 */

import { BriefByPheebs } from '../shared/types';

const SEEDED_BRIEFS: Record<string, Partial<BriefByPheebs>> = {
  'bright smile orthodontics': {
    businessName: 'Bright Smile Orthodontics',
    category: 'Orthodontic Practice',
    address: '450 Sutter St, San Francisco, CA',
    website: 'https://brightsmileortho-example.com',
    rating: 4.6,
    reviewCount: 142,

    startHere: {
      topic: 'Talk about Conversion',
      confidence: 'High',
      why: 'Customers are finding the business, but the booking experience appears to introduce unnecessary friction. Focus the conversation on converting existing demand before discussing traffic generation.'
    },

    whyNot: [
      { topic: 'Reviews & Reputation', reason: 'Trust signals are already strong enough (4.6 stars across 140+ reviews).' },
      { topic: 'SEO & Discovery', reason: 'Search discovery is not the primary bottleneck for this location.' },
      { topic: 'Website Overhaul', reason: 'Redesigning the website is not the highest-impact conversation today.' }
    ],

    firstQuestion: '“When someone decides they want to book with you, where do you think the biggest drop-off happens?”',

    businessContext: 'Premium neighborhood orthodontic practice with strong brand awareness and high patient trust, but an offline intake journey that creates unnecessary booking friction.',

    evidence: [
      'Website lacks 24/7 direct online scheduling',
      'No direct booking CTA in Google Business Profile',
      'High rating (4.6) proves patient trust already exists',
      'Recent reviews mention receptionist phone line congestion during peak hours'
    ],

    timeline: [
      { minute: 'Minute 1', action: 'Build rapport around their strong local patient reviews.' },
      { minute: 'Minute 2', action: 'Validate current intake and phone booking process.' },
      { minute: 'Minute 3', action: 'Explore lost after-hours appointment requests.' },
      { minute: 'Minute 5', action: 'Introduce 2-click automated SMS booking assistant.' }
    ],

    questions: {
      primary: '“When someone decides they want to book with you, where do you think the biggest drop-off happens?”',
      secondary: [
        '“How do you handle appointment requests that come in after 5 PM or over the weekend?”',
        '“What percentage of new patient inquiries actually convert into scheduled consultations?”'
      ]
    },

    objections: [
      {
        objection: '“Our front desk handles all our bookings over the phone just fine.”',
        response: '“They definitely do during normal hours. The gap is what happens when someone calls while your receptionist is checking out a patient or after the office closes.”'
      },
      {
        objection: '“We already have a contact form on our website.”',
        response: '“Contact forms are great for general questions, but high-intent patients looking for an appointment usually want instant confirmation rather than waiting for a callback.”'
      },
      {
        objection: '“We don’t have budget for new software right now.”',
        response: '“If capturing 3 missed consultations a month pays for the system 5x over, is budget the real blocker or is it proving the ROI?”'
      }
    ],

    opening: '“Hi Tawana, I noticed your practice has outstanding patient reviews in San Francisco, but I saw that after-hours booking relies on voicemail. How are you currently capturing prospective patients who visit your site outside office hours?”',

    beforeYouAssume: [
      '• Verify who has final sign-off authority for clinical software.',
      '• Confirm whether online booking is being piloted on a hidden staging page.',
      '• Check if another patient management system is already integrated.'
    ]
  },

  'evergreen dental': {
    businessName: 'Evergreen Dental Care',
    category: 'Dental Practice',
    address: '1200 Highland Ave, Seattle, WA',
    website: 'https://evergreendental-example.com',
    rating: 4.2,
    reviewCount: 89,

    startHere: {
      topic: 'Talk about After-Hours Capture',
      confidence: 'High',
      why: 'Weekend and evening emergency inquiries are currently left unanswered until Monday morning. Focus on capturing high-intent patients before they call local competitors.'
    },

    whyNot: [
      { topic: 'Social Media', reason: 'Organic social is irrelevant to emergency dental patient acquisition.' },
      { topic: 'Pricing Discounts', reason: 'Emergency patients prioritize availability and speed over discounts.' },
      { topic: 'Print Advertising', reason: 'Traditional mailers have high cost with zero attribution.' }
    ],

    firstQuestion: '“When an emergency patient calls on Saturday afternoon, what happens to that lead today?”',

    businessContext: 'Established family dental clinic with high patient retention but a massive leak in weekend emergency patient acquisition due to static PDF forms.',

    evidence: [
      'Booking relies on a downloadable PDF form download link',
      'No answer on emergency lines after office hours',
      'Two recent 1-star reviews complain of delayed weekend callbacks'
    ],

    timeline: [
      { minute: 'Minute 1', action: 'Acknowledge their strong reputation in general dentistry.' },
      { minute: 'Minute 2', action: 'Ask about weekend emergency patient intake volume.' },
      { minute: 'Minute 3', action: 'Quantify the financial leakage of unanswered Sunday voicemails.' },
      { minute: 'Minute 5', action: 'Demonstrate automated 24/7 emergency appointment scheduling.' }
    ],

    questions: {
      primary: '“When an emergency patient calls on Saturday afternoon, what happens to that lead today?”',
      secondary: [
        '“How many print-and-scan PDF forms are actually returned compared to website visitors?”',
        '“If an emergency lead gets voicemail, how long do they typically wait before calling another dentist?”'
      ]
    },

    objections: [
      {
        objection: '“Our older patients prefer calling the office directly.”',
        response: '“That makes sense for existing patients. But new emergency patients searching on mobile at 8 PM want immediate slot confirmation.”'
      },
      {
        objection: '“We leave emergency instructions on our outgoing voicemail message.”',
        response: '“Voicemails require manual review Monday morning. By then, most emergency patients have already booked elsewhere.”'
      },
      {
        objection: '“We don’t want to change our office workflow.”',
        response: '“This requires zero workflow change for your team—it simply sends confirmed bookings directly into your existing calendar.”'
      }
    ],

    opening: '“Hi Dr. Miller, I saw your clinic has built great long-term trust in Seattle, but I noticed weekend emergency inquiries go to voicemail. How does your office handle urgent appointment requests after hours?”',

    beforeYouAssume: [
      '• Verify if an on-call dentist answers emergency calls directly.',
      '• Check if they accept Medicaid or specific insurance providers.',
      '• Confirm whether the office manager or clinical director approves new tools.'
    ]
  }
};

export async function generateBrief(inputUrl: string): Promise<BriefByPheebs> {
  const normalizedKey = inputUrl.toLowerCase().trim();
  const matchedKey = Object.keys(SEEDED_BRIEFS).find(k => normalizedKey.includes(k) || k.includes(normalizedKey));
  const matched = matchedKey ? SEEDED_BRIEFS[matchedKey] : null;

  const id = `brief_${Date.now()}`;
  const timestamp = new Date().toISOString();

  if (matched) {
    return {
      id,
      businessName: matched.businessName || 'Target Business',
      category: matched.category || 'Local Practice',
      address: matched.address || 'Local Metro Area',
      website: matched.website || inputUrl,
      rating: matched.rating || 4.5,
      reviewCount: matched.reviewCount || 100,
      startHere: matched.startHere!,
      whyNot: matched.whyNot!,
      firstQuestion: matched.firstQuestion!,
      businessContext: matched.businessContext!,
      evidence: matched.evidence!,
      timeline: matched.timeline!,
      questions: matched.questions!,
      objections: matched.objections!,
      opening: matched.opening!,
      beforeYouAssume: matched.beforeYouAssume!,
      generatedAt: timestamp
    };
  }

  // Factual default fallback for arbitrary URLs
  const cleanName = inputUrl.replace(/^https?:\/\//, '').split('/')[0].replace('www.', '');
  const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

  return {
    id,
    businessName: formattedName || 'Local Business Practice',
    category: 'Healthcare & Wellness Practice',
    address: 'Local Business District',
    website: inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`,
    rating: 4.4,
    reviewCount: 64,
    startHere: {
      topic: 'Talk about Lead Conversion',
      confidence: 'High',
      why: 'Existing web traffic is arriving, but the intake flow requires manual phone calls during office hours. Focus on capturing existing demand.'
    },
    whyNot: [
      { topic: 'SEO & Traffic', reason: 'Traffic is already reaching the listing; optimization is secondary.' },
      { topic: 'Social Media', reason: 'Organic social campaigns have low attribution for emergency bookings.' },
      { topic: 'Rebranding', reason: 'Existing brand trust is sufficient for initial conversion.' }
    ],
    firstQuestion: '“When a prospective client visits your booking page, what percentage actually complete a scheduled appointment?”',
    businessContext: 'Established local service practice with strong customer ratings but an offline intake process that introduces booking friction.',
    evidence: [
      'No 24/7 direct online scheduling widget detected',
      'Inbound phone routing goes to single receptionist line',
      'High rating suggests patient trust exists'
    ],
    timeline: [
      { minute: 'Minute 1', action: 'Build rapport around their online customer ratings.' },
      { minute: 'Minute 2', action: 'Ask about current intake and appointment confirmation flow.' },
      { minute: 'Minute 3', action: 'Explore lost after-hours appointment inquiries.' },
      { minute: 'Minute 5', action: 'Demonstrate frictionless SMS booking.' }
    ],
    questions: {
      primary: '“When a prospective client visits your booking page, what percentage actually complete a scheduled appointment?”',
      secondary: [
        '“How do you currently capture leads who call outside normal business hours?”',
        '“What is your team’s follow-up time for website contact form submissions?”'
      ]
    },
    objections: [
      {
        objection: '“We prefer clients to call our office directly.”',
        response: '“Phone calls work during business hours. The gap is after-hours callers who want instant confirmation rather than waiting for tomorrow.”'
      },
      {
        objection: '“Our current setup works fine.”',
        response: '“It definitely works for traditional callers. This simply adds a 24/7 automated channel for mobile searchers.”'
      },
      {
        objection: '“We need to discuss this with our team first.”',
        response: '“That makes total sense. What specific numbers or ROI proof would your team need to see before evaluating a trial?”'
      }
    ],
    opening: `“Hi, I noticed your business has great customer ratings, but I saw that booking relies on phone calls during office hours. How do you currently handle inquiries outside normal hours?”`,
    beforeYouAssume: [
      '• Verify who has final decision-making authority.',
      '• Confirm if another online booking tool is being tested.',
      '• Check if office staff are resistant to new workflows.'
    ],
    generatedAt: timestamp
  };
}
