const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('file://' + __dirname + '/index.html', {waitUntil: 'networkidle0'});
    const classes = await page.$$eval('.mermaid svg .node', els => els.map(e => e.className.baseVal || e.className));
    console.log(classes);
    await browser.close();
})();
