const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('file://' + __dirname + '/index.html', {waitUntil: 'networkidle0'});
    const test1 = await page.$$eval("section[aria-labelledby='hero-title'] p", e=>e.length);
    const test2 = await page.$$eval("section[aria-labelledby='hero-title'] aside", e=>e.length);
    const test3 = await page.$$eval("section[aria-labelledby='hero-title'] div.flex", e=>e.length);
    const test4 = await page.$$eval(".uppercase.tracking-\\[0\\.16em\\]", e=>e.length);
    const test5 = await page.$$eval("#map-legend", e=>e.length);
    const test6 = await page.$$eval("#global-header", e=>e.length);
    console.log({test1, test2, test3, test4, test5, test6});
    await browser.close();
})();
