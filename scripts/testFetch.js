async function test() {
  const cleanUrl = 'https://maps.app.goo.gl/218Lfq4ivbL8nNn76';
  const res = await fetch(cleanUrl, {
    headers: {
      'User-Agent': 'curl/7.88.1',
    },
    redirect: 'manual',
  });

  console.log('STATUS WITH CURL UA:', res.status);
  const loc = res.headers.get('location');
  console.log('LOCATION WITH CURL UA:', loc);

  if (!loc) {
    const text = await res.text();
    console.log('TEXT LENGTH:', text.length);
    const m = text.match(/https?:\/\/[^"'\s]*google\.com\/maps\/place\/([^"'\s?\/]+)/i);
    console.log('FOUND IN HTML BODY:', m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null);
  } else if (loc.includes('/maps/place/')) {
    const name = decodeURIComponent(loc.split('/maps/place/')[1].split('/')[0].replace(/\+/g, ' '));
    console.log('FOUND IN LOCATION HEADER:', name);
  }
}

test();
