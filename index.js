const puppeteer = require('puppeteer');


async function run() {
  const LISTING_SELECTOR_NORMAL = '#search-results > div > section > div:nth-child(2) > section';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://www.ksl.com/classifieds/s/Appliances/Washers+and+Dryers');
  await page.screenshot({ path: 'screenshots/page-1.png' });
  await page.waitFor(2 * 1000);
  const listings = await page.evaluate((sel) => {
    const _listings = document.querySelectorAll(sel).innerHtml;
    console.log(_listings);
    return _listings;
  }, LISTING_SELECTOR_NORMAL);

  //const listings = dom.querySelectorAll(LISTING_SELECTOR_NORMAL);

  //console.log(listings);
  
  browser.close();
}

run();