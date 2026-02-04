const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();

  const results = {register: null, login: null, console: [], network: [], navigations: []};

  page.on('console', msg => results.console.push({type: msg.type(), text: msg.text().substring(0, 200)}));
  page.on('response', async res => {
    try {
      const url = res.url();
      if (url.includes('/api/auth/register') || url.includes('/api/auth/login')) {
        results.network.push({url, status: res.status()});
      }
    } catch (e) {}
  });

  // Register
  try {
    console.log('Navigating to register page...');
    await page.goto('http://localhost:5174/register', {waitUntil: 'networkidle2', timeout: 10000});
    results.navigations.push('register-page-loaded');

    const username = 'puppeteer' + Date.now().toString().slice(-4);
    const email = 'puppet' + Date.now().toString().slice(-6) + '@test.com';
    const password = 'Puppet123!';

    await page.type('input[type=text]', username);
    await page.type('input[type=email]', email);
    await page.type('input[type=password]', password);
    
    await Promise.all([
      page.click('button[type=submit]'),
      page.waitForNavigation({waitUntil: 'networkidle2', timeout: 5000}).catch(()=>{})
    ]);
    results.register = {status: 'submitted', email};
    results.navigations.push('register-submitted');
  } catch (e) {
    results.register = {error: e.message};
  }

  // Wait and navigate to login
  try {
    console.log('Navigating to login page...');
    await page.goto('http://localhost:5174/login', {waitUntil: 'networkidle2', timeout: 10000});
    results.navigations.push('login-page-loaded');

    const email = results.register?.email || 'puppet' + Date.now().toString().slice(-6) + '@test.com';
    const password = 'Puppet123!';

    await page.type('input[type=email]', email);
    await page.type('input[type=password]', password);

    await Promise.all([
      page.click('button[type=submit]'),
      page.waitForNavigation({waitUntil: 'networkidle2', timeout: 5000}).catch(()=>{})
    ]);
    results.login = {status: 'submitted', email};
    results.navigations.push('login-submitted');
  } catch (e) {
    results.login = {error: e.message};
  }

  console.log('\nFRONTEND AUTH FLOW RESULTS:\n', JSON.stringify(results, null, 2));
  await browser.close();
  process.exit(0);
})();
