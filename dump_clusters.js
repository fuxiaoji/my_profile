const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('file://' + __dirname + '/index.html', {waitUntil: 'networkidle0'});
    const subgraphs = await page.$$eval('.mermaid svg .cluster rect, .mermaid svg .cluster text', els => els.length);
    console.log("subgraphs found:", subgraphs);
    const clusterRects = await page.$$eval('.mermaid svg rect', els => els.map(e => e.className.baseVal || e.className));
    console.log("all rect classes:", clusterRects);
    await browser.close();
})();
