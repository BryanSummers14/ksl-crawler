const puppeteer = require('puppeteer');


async function run() {
  const LISTING_SELECTOR_NORMAL = '.listing-item.normal';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://www.ksl.com/classifieds/s/Appliances/Washers+and+Dryers');
  await page.waitFor(2 * 1000);
  await page.screenshot({ path: 'screenshots/page-1.png' });
  let listings = await page.evaluate(sel => {
      const potentialListings = [];
      document.querySelectorAll(sel).forEach(_elem => {
        const elemData = _elem.children[1];
        const _title = elemData.children[0].textContent;
        const _price = parseInt(elemData.children[1].textContent.replace('$', ''), 10);
        potentialListings.push({title : _title, price: _price});
      });
      return potentialListings;
    }, LISTING_SELECTOR_NORMAL);

  console.log(listings);
  
  browser.close();
}

run();

