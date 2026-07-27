import { execSync } from 'child_process';
import https from 'https';

async function postJSON(url, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = JSON.stringify(data);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Pheebs-Pusher',
        },
      },
      (res) => {
        let text = '';
        res.on('data', (chunk) => (text += chunk));
        res.on('end', () => resolve(JSON.parse(text)));
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('Initiating GitHub Device Authorization Flow...\n');
  
  // Client ID for GitHub CLI / OAuth app
  const clientId = '178c6fc778ccc68e1d6a'; 

  const res = await postJSON('https://github.com/login/device/code', {
    client_id: clientId,
    scope: 'repo',
  });

  if (!res.user_code) {
    console.error('Failed to get device code:', res);
    process.exit(1);
  }

  console.log('================================──────────────────────────────');
  console.log(`1. Open URL:  ${res.verification_uri}`);
  console.log(`2. Enter Code: ${res.user_code}`);
  console.log('================================──────────────────────────────\n');
  console.log('Waiting for GitHub browser authorization...');

  const interval = (res.interval || 5) * 1000;
  const deviceCode = res.device_code;

  while (true) {
    await new Promise((r) => setTimeout(r, interval));
    const tokenRes = await postJSON('https://github.com/login/oauth/access_token', {
      client_id: clientId,
      device_code: deviceCode,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    });

    if (tokenRes.access_token) {
      console.log('\n✓ Authorized successfully!');
      const token = tokenRes.access_token;
      
      // Push via token
      const repoUrl = `https://azeezr-commits:${token}@github.com/azeezr-commits/Pheebs-OS.git`;
      console.log('Pushing code to https://github.com/azeezr-commits/Pheebs-OS.git ...');
      execSync(`git push --force "${repoUrl}" main`, { stdio: 'inherit' });
      console.log('\n🎉 Successfully pushed Pheebs v0.5 to GitHub (Pheebs-OS)!');
      break;
    } else if (tokenRes.error === 'authorization_pending') {
      process.stdout.write('.');
    } else {
      console.error('\nAuthorization error:', tokenRes);
      break;
    }
  }
}

main().catch(console.error);
