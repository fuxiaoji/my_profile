const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const consoleOutput = [];
    page.on('console', msg => consoleOutput.push(msg.text()));
    await page.goto('file://' + __dirname + '/index.html', {waitUntil: 'networkidle0'});
    const svgHTML = await page.$eval('.mermaid svg', el => el.outerHTML).catch(e => e.message);
    let size = typeof svgHTML === 'string' ? svgHTML.length : 'none';
    console.log("SVG eval result:", svgHTML.substring(0, 100) + "...");
    console.log("Console errors:", consoleOutput);
    await browser.close();
})();
