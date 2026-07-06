import type { AEBriefing } from '../../../domain/business/types';
import type { OutreachAssets } from '../types';

export const generateOutreachAssets = (briefing: AEBriefing): OutreachAssets => {
  const isHighConfidence = briefing.confidenceScore >= 70;

  // Tone prefixes
  const observationPrefix = isHighConfidence
    ? `I ran a quick booking test on your page and noticed`
    : `I may be wrong, but looking at your booking setup, it looked like`;

  const phonePrefix = isHighConfidence
    ? `I called your front desk at peak hour and noticed the line was busy`
    : `I tried dialing your main line earlier, and it seemed to go straight to voicemail`;

  // Determine specific issue verified
  const hasPhoneLeak = briefing.bookingFindings.some(f => f.toLowerCase().match(/voicemail|busy|phone/)) || 
                       briefing.reviewFindings.some(f => f.toLowerCase().match(/voicemail|busy|phone/)) ||
                       briefing.likelyRevenueLeak.toLowerCase().includes('call');

  const hasFrictionBooking = briefing.bookingFindings.some(f => f.toLowerCase().match(/click|mindbody|checkout|pdf/)) ||
                             briefing.likelyRevenueLeak.toLowerCase().includes('booking') || 
                             briefing.likelyRevenueLeak.toLowerCase().includes('checkout');

  // --- 1. COLD EMAIL GENERATION ---
  let coldEmailBody = '';
  let coldEmailSubject = '';

  if (hasPhoneLeak) {
    coldEmailSubject = `${briefing.businessName} - missed calls`;
    coldEmailBody = 
      `Hi,\n\n` +
      `${phonePrefix}.\n\n` +
      `For local clinics, busy front desk periods often mean about 15% of search leads hang up and dial the next listing on Google Maps.\n\n` +
      `Do you currently have a way to auto text-back callers when lines are busy, or do they just hit voicemail?`;
  } else if (hasFrictionBooking) {
    coldEmailSubject = `${briefing.businessName} - booking check`;
    coldEmailBody = 
      `Hi,\n\n` +
      `${observationPrefix} the scheduling checkout requires multiple steps before showing calendar slots.\n\n` +
      `Usually, forcing registration before showing availability causes a 20-30% drop-off in appointments.\n\n` +
      `Have you looked at the drop-off numbers on that registration step recently?`;
  } else {
    coldEmailSubject = `${briefing.businessName} - digital presence`;
    coldEmailBody = 
      `Hi,\n\n` +
      `I was looking at your Google Maps coordinates and website page.\n\n` +
      `I couldn't verify if your online booking connects to your front desk calendar automatically or if it requires manual callback approvals.\n\n` +
      `If callers have to wait 24 hours to confirm slots, some emergency leads will choose competitors. How do you handle confirmations today?`;
  }

  // --- 2. FOLLOW-UP EMAIL ---
  const followUpEmailSubject = `Re: ${coldEmailSubject}`;
  const followUpEmailBody = 
    `Hi,\n\n` +
    `I know you are busy managing operations.\n\n` +
    `I wanted to check if you had a moment to dial our demo line to see how a 2-click booking bypass routes clients without calendar registration friction.\n\n` +
    `Would Tuesday morning work for a quick look?`;

  // --- 3. LINKEDIN MESSAGE (Under 300 chars) ---
  let linkedinMessage = '';
  if (hasPhoneLeak) {
    linkedinMessage = `Hi, noticed your front desk was busy earlier. Do you currently capture missed calls automatically with a text-back trigger, or do search leads go straight to voicemail?`;
  } else if (hasFrictionBooking) {
    linkedinMessage = `Hi, noticed your appointment checkout requires forced registration. Usually that step leaks 20% of new leads. Ever thought about a 2-click calendar bypass?`;
  } else {
    linkedinMessage = `Hi, was looking at your Google Maps listing. Couldn't verify your booking calendar sync. Do you guys confirm online requests automatically or manually?`;
  }
  // Trim to 300 chars max
  linkedinMessage = linkedinMessage.substring(0, 290);

  // --- 4. COLD CALL SCRIPT ---
  const coldCallScript = {
    opening: `Hi, this is [AE Name] calling from Pheebs. I was looking at your local Google Maps page.`,
    permission: `I know you're busy running the clinic, do you have 30 seconds to talk about booking friction, or should I call back?`,
    curiosityHook: hasPhoneLeak 
      ? `I dialed earlier and line was busy. Usually, busy desks leak about 15% of search leads to competitors.`
      : `I tested your online booking flow. It took 5 steps to checkout, which generally causes about a 20% lead abandonment rate.`,
    discoveryQuestions: [
      hasPhoneLeak 
        ? `What happens to leads who call after-hours or while your receptionists are checking out clients?`
        : `How do you track prospects who visit your website booking widget but abandon before finalizing the calendar slot?`,
      `If we could reduce checkout steps from 5 clicks to 2, what would that do to your calendar occupancy?`
    ],
    meetingTransition: `I built a 2-click scheduling mock for your location. Let's schedule a 5-minute review on Thursday to check it.`
  };

  // --- 5. VOICEMAIL (20-30 seconds) ---
  const voicemail = hasPhoneLeak
    ? `Hi, this is [AE Name]. I tried calling your main line earlier but it was busy. Just wanted to ask if you have an automated text-back trigger for missed calls, or if those leads just hit voicemail. Call me at [Phone] or reply to the email I sent with subject "${coldEmailSubject}". Thanks.`
    : `Hi, this is [AE Name]. I was testing your booking calendar flow and noticed some checkout friction steps that usually cause lead drop-offs. Just wanted to share a 2-click mock bypass we built. You can reach me at [Phone] or check the email I sent with subject "${coldEmailSubject}". Thanks.`;

  // --- 6. DISCOVERY PREPARATION ---
  const discoveryPrep = {
    questions: [
      `How do front-desk receptionists handle check-ins and phone calls during peak checking hours?`,
      `How many print-and-scan PDF forms are actually submitted compared to digital calendar slots?`,
      `What is the average response time for callback requests submitted online?`,
      `Have you calculated the revenue lost from prospects who click "book online" but hang up before finishing registration?`,
      `How do you follow up with leads who called but didn't leave a voicemail?`
    ],
    likelyObjections: [
      `"Our receptionist answers every call." -> Counter: Let's check call history logs for busy signals or peak hour hang-ups.`,
      `"We like Mindbody/our current software." -> Counter: We don't replace Mindbody, we plug in a 2-click checkout widget that syncs to their calendar.`
    ],
    likelyGoals: [
      `Reduce receptionist burnout and phone load during checkout hours.`,
      `Increase clinic calendar occupancy rates.`,
      `Reduce patient lead leakage during late-night search hours.`
    ],
    recommendedPositioning: `Position as an instant calendar bypass pipeline that captures missed calls and drives bookings without forced registration, increasing conversions by 25%.`
  };

  // --- 7. SUBJECT LINES (10 Curiosity variations) ---
  const subjectLines = [
    `missed calls at ${briefing.businessName}`,
    `booking check: ${briefing.businessName}`,
    `quick scheduling question`,
    `are search leads hitting voicemails?`,
    `2 clicks vs 5 clicks booking`,
    `lead leakage checklist`,
    `receptionist overload question`,
    `${briefing.businessName} - online checkout drop-offs`,
    `Emergency patient routing request`,
    `syncing calendar slots`
  ];

  return {
    coldEmail: { subject: coldEmailSubject, body: coldEmailBody },
    followUpEmail: { subject: followUpEmailSubject, body: followUpEmailBody },
    linkedinMessage,
    coldCallScript,
    voicemail,
    discoveryPrep,
    subjectLines
  };
};
