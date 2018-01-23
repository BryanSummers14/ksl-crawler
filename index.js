const puppeteer = require('puppeteer');


async function run() {
  const LISTING_SELECTOR_NORMAL = '.listing-item.normal';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://www.ksl.com/classifieds/s/Appliances/Washers+and+Dryers');
  await page.waitFor(2 * 1000);
  await page.screenshot({ path: 'screenshots/page-1.png' });
  let listings_front_page = await page.evaluate(sel => {
      const potentialListings = [];
      document.querySelectorAll(sel).forEach(_elem => {
        const elemData = _elem.children[1];
        const _title = elemData.children[0].children[0].textContent;
        const _link = elemData.children[0].children[0].href;
        const _price = parseInt(elemData.children[1].textContent.replace('$', ''), 10);
        potentialListings.push({title : _title, link: _link, price: _price});
      });
      return potentialListings;
    }, LISTING_SELECTOR_NORMAL);

    // page.click('body > div.ksl-assets-container.ddm-menu-container > div.inner.ddm-menu-container__inner > div.content.ddm-menu-container__content > div.page-wrap > div.search-results-footer > div.mobile-pagination > a.icon.icon--circle-right-arrow.active-link');

    // await page.waitFor(10 * 1000);

    // let listings_first_page = await page.evaluate(sel => {
    //     const potentialListings = [];
    //     document.querySelectorAll(sel).forEach(_elem => {
    //       const elemData = _elem.children[1];
    //       const _title = elemData.children[0].children[0].textContent;
    //       const _link = elemData.children[0].children[0].href;
    //       const _price = parseInt(elemData.children[1].textContent.replace('$', ''), 10);
    //       potentialListings.push({title : _title, link: _link, price: _price});
    //     });
    //     return potentialListings;
    //   }, LISTING_SELECTOR_NORMAL);

    // const allListings = [].concat(listings_first_page, listings_front_page);

    // console.log(allListings);

    console.log(listings_front_page);
  
  browser.close();
}

run();

