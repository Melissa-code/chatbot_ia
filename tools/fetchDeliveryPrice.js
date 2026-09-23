const puppeteer = require('puppeteer');

// Launch the browser and open a new blank page
(async ()=> {
    const url = 'https://telling-moonstone-856.notion.site/Frais-de-Livraison-Shopping-com-3e4300d3d01480629d58f1fffbeffb98' // Page web Notion publique
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

