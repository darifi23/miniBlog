const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const url = process.argv[2] || 'http://localhost:5173/register';
  const out = 'tools/browser_logs.json';
  const logs = {console: [], errors: [], network: []};

  const browser = await puppeteer.launch({args: ['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();

  page.on('console', msg => {
    const text = msg.text();
    logs.console.push({type: msg.type(), text, location: msg.location(), timestamp: Date.now()});
    console.log('[console]', msg.type(), text);
  });

  page.on('pageerror', err => {
    logs.errors.push({type: 'pageerror', message: err.message, stack: err.stack, timestamp: Date.now()});
    console.error('[pageerror]', err.message);
  });

  page.on('response', response => {
    const status = response.status();
    const url = response.url();
    if (status >= 400) {
      logs.network.push({type: 'bad-response', url, status, timestamp: Date.now()});
      console.warn('[network] bad response', status, url);
    }
  });

  page.on('requestfailed', req => {
    logs.network.push({type: 'requestfailed', url: req.url(), failureText: req.failure() && req.failure().errorText, timestamp: Date.now()});
    console.warn('[network] failed', req.url(), req.failure() && req.failure().errorText);
  });

  try {
    await page.goto(url, {waitUntil: 'networkidle2', timeout: 20000});
    if (page.waitForTimeout) {
      await page.waitForTimeout(3000);
    } else {
      await new Promise(r => setTimeout(r, 3000));
    }
  } catch (e) {
    logs.errors.push({type: 'navigation', message: e.message, stack: e.stack, timestamp: Date.now()});
    console.error('[navigation error]', e.message);
  }

  fs.mkdirSync('tools', {recursive: true});
  fs.writeFileSync(out, JSON.stringify(logs, null, 2));
  console.log('Saved logs to', out);

  await browser.close();
  process.exit(0);
})();
