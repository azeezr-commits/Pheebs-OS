import fs from 'fs';

const html = fs.readFileSync('scripts/gmaps_sample.html', 'utf8');

// 1. Search for any external website URLs in HTML
const rawUrls = html.match(/https?:\/\/[^"'\s<>\\]+/gi) || [];
const externalWebsites = Array.from(new Set(rawUrls)).filter((u) => 
  !u.includes('google.com') && 
  !u.includes('gstatic.com') && 
  !u.includes('ggpht.com') && 
  !u.includes('googleapis.com') && 
  !u.includes('w3.org') && 
  !u.includes('schema.org') &&
  !u.includes('youtube.com')
);

console.log('EXTERNAL WEBSITES FOUND IN GMAPS PAYLOAD:', externalWebsites);

// 2. Search for AF_initDataCallback or APP_INITIALIZATION_STATE
const initCallbacks = [...html.matchAll(/AF_initDataCallback\(\{[\s\S]*?data:([\s\S]*?)\}\);/g)];
console.log('AF_initDataCallback COUNT:', initCallbacks.length);

for (let i = 0; i < initCallbacks.length; i++) {
  const dataText = initCallbacks[i][1];
  if (dataText.includes('http') || dataText.includes('4.') || dataText.includes('5.')) {
    console.log(`Callback #${i} length: ${dataText.length}`);
    const websitesInCallback = dataText.match(/https?:\/\/[^"'\s\\]+/gi);
    if (websitesInCallback) {
      console.log(`  Websites in Callback #${i}:`, websitesInCallback);
    }
  }
}
