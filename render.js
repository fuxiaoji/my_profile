const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:8080/index.html', {waitUntil: 'networkidle0'});
    const svg = await page.$eval('.mermaid svg', el => el.outerHTML).catch(e => e.message);
    const consoleOutput = [];
    page.on('console', msg => consoleOutput.push(msg.text()));
    await page.goto('http://localhost:8080/index.html', {waitUntil: 'networkidle0'});
    console.log("SVG size:", svg.length);
    console.log("Console:", consoleOutput);
    await browser.close();
})();
