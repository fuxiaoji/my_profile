const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('file://' + __dirname + '/index.html', {waitUntil: 'networkidle0'});
    const nodesLength = await page.$eval('.mermaid svg', el => el.querySelectorAll('.node').length).catch(e => e.message);
    const edgesLength = await page.$eval('.mermaid svg', el => el.querySelectorAll('.edgePaths path, .edgePath path').length).catch(e => e.message);
    const textSelectors = await page.$$eval('.mermaid svg text', els => el => Object.values(els).map(e=>e.textContent));
    console.log("Nodes length:", nodesLength);
    console.log("Edges len:", edgesLength);
    await browser.close();
})();
