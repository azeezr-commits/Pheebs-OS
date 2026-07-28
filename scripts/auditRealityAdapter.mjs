import { RealityAdapter } from '../src/packages/observer/realityAdapter.ts';

const TEST_TARGETS = [
  { name: "Artist Face Studio / Claudia's Test", url: "https://maps.app.goo.gl/218Lfq4ivbL8nNn76" },
  { name: "Brooklyn Brows NYC", url: "https://maps.google.com/?q=Brooklyn+Brows+NYC" },
  { name: "Evergreen Dental Care", url: "https://maps.google.com/?q=Evergreen+Dental+Care+Seattle" },
];

async function runAudit() {
  console.log('================================================================');
  console.log('PHEEBS REALITY ADAPTER v0 — EMPIRICAL LIVE AUDIT REPORT');
  console.log('================================================================\n');

  for (const target of TEST_TARGETS) {
    console.log(`----------------------------------------------------------------`);
    console.log(`BUSINESS TARGET: ${target.name}`);
    console.log(`INPUT URL:       ${target.url}`);
    console.log(`----------------------------------------------------------------`);

    const startTime = Date.now();
    try {
      const result = await RealityAdapter.fetchAndObserve(`audit_${Date.now()}`, target.url);
      const obs = result.observations;

      console.log(`Business Name:    ${obs.businessName.value || 'MISSING'}`);
      console.log(`  └─ Status:      ${obs.businessName.status}`);
      console.log(`  └─ Source:      ${obs.businessName.source}`);
      console.log(`  └─ ExtractedBy: ${obs.businessName.extractedBy}`);

      console.log(`Rating:           ${obs.rating?.value !== undefined ? obs.rating.value : 'MISSING / Unknown'}`);
      console.log(`  └─ Status:      ${obs.rating?.status || 'MISSING'}`);
      console.log(`  └─ Source:      ${obs.rating?.source || 'unobserved'}`);
      console.log(`  └─ ExtractedBy: ${obs.rating?.extractedBy || 'none'}`);

      console.log(`Review Count:     ${obs.reviewCount?.value !== undefined ? obs.reviewCount.value : 'MISSING / Unknown'}`);
      console.log(`  └─ Status:      ${obs.reviewCount?.status || 'MISSING'}`);
      console.log(`  └─ Source:      ${obs.reviewCount?.source || 'unobserved'}`);
      console.log(`  └─ ExtractedBy: ${obs.reviewCount?.extractedBy || 'none'}`);

      console.log(`Category:         ${obs.category?.value || 'MISSING / Unknown'}`);
      console.log(`  └─ Status:      ${obs.category?.status || 'MISSING'}`);
      console.log(`  └─ Source:      ${obs.category?.source || 'unobserved'}`);

      console.log(`Website:          ${obs.website?.value || 'MISSING / Unknown'}`);
      console.log(`  └─ Status:      ${obs.website?.status || 'MISSING'}`);
      console.log(`  └─ Source:      ${obs.website?.source || 'unobserved'}`);

      console.log(`Phone:            ${obs.phone?.value || 'MISSING / Unknown'}`);
      console.log(`  └─ Status:      ${obs.phone?.status || 'MISSING'}`);
      console.log(`  └─ Source:      ${obs.phone?.source || 'unobserved'}`);

      console.log(`Booking CTA:      ${obs.hasBookingLink.value ? 'Present' : 'MISSING / Not Detected'}`);
      console.log(`  └─ Status:      ${obs.hasBookingLink.status}`);
      console.log(`  └─ Source:      ${obs.hasBookingLink.source}`);

      console.log(`\nRecovery Attempts / Notes:`);
      result.recoveryAttempts.forEach((attempt) => console.log(`  • ${attempt}`));
      console.log(`Execution Time:   ${Date.now() - startTime}ms\n`);

    } catch (err) {
      console.error(`ERROR auditing ${target.name}:`, err.message);
    }
  }
}

runAudit();
