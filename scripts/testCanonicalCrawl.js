import fs from 'fs';

async function testCanonicalCrawl(url) {
  console.log(`\nFetching Canonical Website: ${url}`);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      console.log(`HTTP status ${res.status}`);
      return;
    }

    const html = await res.text();
    console.log(`HTML Length: ${html.length}`);

    // Parse Schema.org JSON-LD
    const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatches) {
      console.log(`Found ${jsonLdMatches.length} Schema.org JSON-LD blocks!`);
      for (const block of jsonLdMatches) {
        const text = block.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
        try {
          const data = JSON.parse(text);
          console.log('JSON-LD Data:', JSON.stringify(data, null, 2).substring(0, 400));
        } catch (e) {
          console.log('JSON parse err:', e.message);
        }
      }
    } else {
      console.log('No Schema.org JSON-LD blocks found.');
    }

    // Booking Links Audit
    const bookingProviders = ['calendly.com', 'acuityscheduling.com', 'zocdoc.com', 'vagaro.com', 'mindbodyonline.com', 'booksy.com', 'square.site'];
    const foundBooking = bookingProviders.filter((p) => html.toLowerCase().includes(p));
    console.log('Booking CTAs Found:', foundBooking);

  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

testCanonicalCrawl('https://brooklynbrowsnyc.com');
