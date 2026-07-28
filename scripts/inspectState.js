async function inspectState() {
  const url = 'https://www.google.com/maps/place/Artist+Face+Studio/@33.8642215,-84.3080155,793m/data=!3m2!1e3!4b1!4m6!3m5!1s0x88f5092af0bf3839:0xec37763c005089ba!8m2!3d33.8642215!4d-84.3080155!16s%2Fg%2F11j5g2n6_d';
  
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  const html = await res.text();

  // 1. Check window.APP_INITIALIZATION_STATE
  const appStateMatch = html.match(/window\.APP_INITIALIZATION_STATE\s*=\s*(\[[\s\S]*?\]);/);
  
  if (appStateMatch) {
    const rawState = appStateMatch[1];
    
    // Find rating floats e.g. [4.9, 12] or [4.7, 104] or [4.2, 23]
    const ratingMatches = [...rawState.matchAll(/\[([1-5]\.[0-9]),\s*([0-9]{1,7})/g)];
    console.log('RATING MATCHES IN STATE:');
    ratingMatches.forEach(m => console.log(`  ⭐ ${m[1]} (${m[2]} reviews)`));

    // Find website URLs in state
    const urls = [...rawState.matchAll(/https?:\\\/\\\/[^\s"'\\\]]+/g)];
    if (urls.length > 0) {
      const cleanUrls = urls.map(u => u[0].replace(/\\/g, '')).filter(u => !u.includes('google') && !u.includes('gstatic') && !u.includes('ggpht'));
      console.log('WEBSITES IN STATE:', Array.from(new Set(cleanUrls)));
    }
  }

  // 2. Check meta tags
  const ogTitle = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i);
  console.log('OG TITLE:', ogTitle ? ogTitle[1] : null);

  // 3. Search for rating in whole HTML
  const ratingInHtml = [...html.matchAll(/([1-5]\.[0-9])\s*★|\b([1-5]\.[0-9])\s*stars?\b/gi)];
  console.log('RATING IN HTML:', ratingInHtml.map(m => m[0]));
}

inspectState();
