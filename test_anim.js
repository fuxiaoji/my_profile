const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('file://' + __dirname + '/index.html', {waitUntil: 'networkidle0'});
    const errorLogs = [];
    page.on('console', msg => { if(msg.text().includes('GSAP')) errorLogs.push(msg.text()) });
    await page.evaluate(() => {
        return document.querySelector('#tree-container').style.opacity;
    });
    await new Promise(r => setTimeout(r, 6000));
    console.log("Wrapper opacity:", await page.$eval('#tree-container', e => e.style.opacity));
    console.log("Map opacity:", await page.$eval('#learning-map', e => window.getComputedStyle(e).opacity));
    console.log("Hero opacity:", await page.$eval('#hero-content', e => window.getComputedStyle(e).opacity));
    console.log(errorLogs);
    await browser.close();
})();
