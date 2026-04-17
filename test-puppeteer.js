const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://127.0.0.1/article-viewer.html?file=%E6%96%87%E7%AB%A0/%E4%BA%AC%E4%B8%9C%E7%A8%B3%E5%AE%9A%E5%B8%81%E4%B8%9A%E5%8A%A1.md', {waitUntil: 'domcontentloaded'});
  
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'test_screenshot_layout.png', fullPage: true });
  console.log("Screenshot saved to test_screenshot_layout.png");
  await browser.close();
})();
