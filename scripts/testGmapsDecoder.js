async function testGmapsDecoder() {
  const url = 'https://maps.app.goo.gl/218Lfq4ivbL8nNn76';
  
  // Fetch initial redirect
  const redirectRes = await fetch(url, {
    headers: { 'User-Agent': 'curl/7.88.1' },
    redirect: 'manual',
  });

  const redirectLocation = redirectRes.headers.get('location') || '';
  console.log('Redirect Location:', redirectLocation);

  const targetUrl = redirectLocation || url;

  // Fetch expanded page HTML
  const res = await fetch(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  const html = await res.text();
  console.log('HTML Length:', html.length);

  // Search for APP_INITIALIZATION_STATE or AF_initDataCallback
  const appStateMatch = html.match(/window\.APP_INITIALIZATION_STATE\s*=\s*(\[[\s\S]*?\]);/);
  if (appStateMatch) {
    console.log('Found APP_INITIALIZATION_STATE!');
    try {
      const data = JSON.parse(appStateMatch[1]);
      console.log('Parsed APP_INITIALIZATION_STATE array structure!');
    } catch (e) {
      console.log('JSON parse error on APP_INITIALIZATION_STATE:', e.message);
    }
  } else {
    console.log('APP_INITIALIZATION_STATE not found directly; searching AF_initDataCallback...');
  }

  // Regex extraction for rating & reviews in Google Maps HTML
  // Rating format in Google Maps: [4.9, 612] or similar arrays
  const ratingMatch = html.match(/\[([1-5]\.[0-9]),\s*([0-9]{1,6}),/);
  if (ratingMatch) {
    console.log(`FOUND RATING VIA DECODER: ⭐ ${ratingMatch[1]} (${ratingMatch[2]} reviews)`);
  }

  // Website extraction from Google Maps page HTML
  const webMatch = html.match(/https?:\/\/[^"'?#\s]+\.(?:com|org|net|io|co|biz|us)[^"'#\s]*/gi);
  if (webMatch) {
    const validWebsites = webMatch.filter((w) => !w.includes('google.com') && !w.includes('gstatic.com') && !w.includes('ggpht.com') && !w.includes('schema.org'));
    console.log('EXTRACTED BUSINESS WEBSITES:', Array.from(new Set(validWebsites)));
  }
}

testGmapsDecoder();
