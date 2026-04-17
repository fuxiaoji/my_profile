const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({width: 1200, height: 800});
    await page.goto('file://' + __dirname + '/index.html', {waitUntil: 'networkidle0'});
    await new Promise(r => setTimeout(r, 6000));
    console.log("Map opacity at top:", await page.$eval('#learning-map', e => window.getComputedStyle(e).opacity));
    await page.evaluate(() => window.scrollBy(0, 300));
    await new Promise(r => setTimeout(r, 1000));
    console.log("Map opacity after scroll:", await page.$eval('#learning-map', e => window.getComputedStyle(e).opacity));
    await browser.close();
})();
