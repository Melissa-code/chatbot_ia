const puppeteer = require('puppeteer');

// Launch the browser and open a new blank page
(async ()=> {
    const url = 'https://telling-moonstone-856.notion.site/PAGE-DE-TEST-3d6300d3d0148099b73ef076bf4825cf' // Page web Notion publique
    // Puppeteer a été créé par Google spécifiquement pour Chromium/Chrome (script tourne en arrière-plan avec Chrome)
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' }); // get the page 

    await page.waitForSelector('.notion-page-content', { timeout: 15000 });

    const title = await page.evaluate(() => {
        const el = document.querySelector('h1, .notion-page-block h1, .notranslate');
        return el ? el.innerText.trim() : null;
    });

    const content = await page.evaluate(() => {
        const el = document.querySelector('.notion-page-content');
        return el ? el.innerText.trim() : null;
    });

    console.log("Titre de la page :" + title, "Contenu de la page :" + content);

    await browser.close();  
})(); 

