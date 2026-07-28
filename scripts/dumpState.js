import fs from 'fs';

async function dumpState() {
  const url = 'https://www.google.com/maps/place/Artist+Face+Studio/@33.8642215,-84.3080155,793m/data=!3m2!1e3!4b1!4m6!3m5!1s0x88f5092af0bf3839:0xec37763c005089ba!8m2!3d33.8642215!4d-84.3080155!16s%2Fg%2F11j5g2n6_d';
  
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  const html = await res.text();
  
  // Write html to file for analysis
  fs.writeFileSync('scripts/gmaps_sample.html', html);
  console.log('Wrote gmaps_sample.html, length:', html.length);

  // Search for any rating numbers like 4.9, 4.2, 4.8 or review counts
  const matches = [...html.matchAll(/(\d\.\d)\s*,\s*(\d+)/g)];
  console.log('NUMBER PAIRS IN HTML:', matches.map(m => m[0]).slice(0, 20));
}

dumpState();
