const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('file://' + __dirname + '/index.html', {waitUntil: 'networkidle0'});
    const opacity = await page.$eval('#learning-map', el => window.getComputedStyle(el).opacity);
    console.log("Map opacity:", opacity);
    await browser.close();
})();
