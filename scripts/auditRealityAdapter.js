import fs from 'fs';
import path from 'path';

// Load RealityAdapter directly
const adapterPath = path.resolve('src/packages/observer/realityAdapter.ts');

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
      const res = await fetch('http://localhost:3000/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target.url }),
      });

      const brief = await res.json();

      if (!res.ok) {
        console.log(`API Error:        ${brief.error}`);
        continue;
      }

      const report = brief.observationReport;
      const fields = report.fields;

      console.log(`Business Name:    ${report.businessName || 'MISSING'}`);
      console.log(`  └─ Status:      ${fields.businessName?.status || 'MISSING'}`);
      console.log(`  └─ Source:      ${fields.businessName?.source || 'unobserved'}`);
      console.log(`  └─ ExtractedBy: ${fields.businessName?.extractedBy || 'none'}`);

      console.log(`Rating:           ${fields.rating?.value !== undefined ? fields.rating.value : 'MISSING / Unknown'}`);
      console.log(`  └─ Status:      ${fields.rating?.status || 'MISSING'}`);
      console.log(`  └─ Source:      ${fields.rating?.source || 'unobserved'}`);
      console.log(`  └─ ExtractedBy: ${fields.rating?.extractedBy || 'none'}`);

      console.log(`Review Count:     ${fields.reviewCount?.value !== undefined ? fields.reviewCount.value : 'MISSING / Unknown'}`);
      console.log(`  └─ Status:      ${fields.reviewCount?.status || 'MISSING'}`);
      console.log(`  └─ Source:      ${fields.reviewCount?.source || 'unobserved'}`);
      console.log(`  └─ ExtractedBy: ${fields.reviewCount?.extractedBy || 'none'}`);

      console.log(`Category:         ${fields.category?.value || 'MISSING / Unknown'}`);
      console.log(`  └─ Status:      ${fields.category?.status || 'MISSING'}`);
      console.log(`  └─ Source:      ${fields.category?.source || 'unobserved'}`);

      console.log(`Website:          ${fields.website?.value || 'MISSING / Unknown'}`);
      console.log(`  └─ Status:      ${fields.website?.status || 'MISSING'}`);
      console.log(`  └─ Source:      ${fields.website?.source || 'unobserved'}`);

      console.log(`Phone:            ${fields.phone?.value || 'MISSING / Unknown'}`);
      console.log(`  └─ Status:      ${fields.phone?.status || 'MISSING'}`);
      console.log(`  └─ Source:      ${fields.phone?.source || 'unobserved'}`);

      console.log(`Booking CTA:      ${fields.hasBookingLink?.value ? 'Present' : 'MISSING / Not Detected'}`);
      console.log(`  └─ Status:      ${fields.hasBookingLink?.status || 'MISSING'}`);
      console.log(`  └─ Source:      ${fields.hasBookingLink?.source || 'unobserved'}`);

      console.log(`\nRecovery Attempts / Notes:`);
      (report.recoveryAttempts || []).forEach((attempt) => console.log(`  • ${attempt}`));
      console.log(`Execution Time:   ${Date.now() - startTime}ms\n`);

    } catch (err) {
      console.error(`ERROR auditing ${target.name}:`, err.message);
    }
  }
}

runAudit();
