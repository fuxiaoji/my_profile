const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log(msg.text()));
  await page.goto('http://127.0.0.1/test_event.html');
  await new Promise(r => setTimeout(r, 1000));
  await browser.close();
})();
