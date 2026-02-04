const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();

  const results = {console: [], network: [], errors: []};

  page.on('console', msg => {
    const logEntry = {type: msg.type(), text: msg.text()};
    results.console.push(logEntry);
    if (msg.type() === 'error') console.log('[PAGE ERROR]', msg.text());
  });
  page.on('pageerror', err => {
    results.errors.push({type: 'pageerror', message: err.message, stack: err.stack});
    console.error('[PAGE EXCEPTION]', err.message);
  });
  page.on('response', res => {
    const url = res.url();
    if (url.includes('/api/auth/register') || url.includes('/api/auth/login')) {
      results.network.push({url: url.replace(/^.*api/, '/api'), status: res.status()});
      console.log('[NETWORK]', res.status(), url.replace(/^.*api/, '/api'));
    }
  });
  page.on('requestfailed', req => {
    if (req.url().includes('/api/auth')) {
      results.network.push({url: req.url().replace(/^.*api/, '/api'), failed: true, failure: req.failure()?.errorText});
      console.error('[REQUEST FAILED]', req.url().replace(/^.*api/, '/api'), req.failure()?.errorText);
    }
  });

  try {
    console.log('Loading register page at http://localhost:5173/register...');
    await page.goto('http://localhost:5173/register', {waitUntil: 'networkidle2', timeout: 10000});
    
    // Fill form
    await page.type('input[type=text]', 'testuser999');
    await page.type('input[type=email]', 'test999@example.com');
    await page.type('input[type=password]', 'Password123!');
    
    console.log('Submitting form...');
    // Submit and wait for any responses/errors
    await page.click('button[type=submit]');
    await new Promise(r => setTimeout(r, 3000)); // Wait 3 sec for response
    
  } catch (e) {
    results.errors.push({type: 'test-error', message: e.message});
    console.error('[TEST ERROR]', e.message);
  }

  console.log('\n=== REGISTER PAGE ERROR CAPTURE ===\n');
  console.log(JSON.stringify({console: results.console, network: results.network, errors: results.errors}, null, 2));
  
  await browser.close();
  process.exit(0);
})();
