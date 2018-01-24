const puppeteer = require('puppeteer');
const config = require('./search-config');


async function run() {
  const LISTING_SELECTOR_NORMAL = config.search_selector;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(config.url);
  await page.waitFor(2 * 1000);
  // Initial listings
  let listings = await page.evaluate(sel => {
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

    let pages = config.pages_to_search && config.pages_to_search > 0 ? config.pages_to_search : 0;
    // Listings for each additional page
    while(pages > 0) {
        await page.click(config.next_selector);
        await page.waitFor(2000);
    
        let listings_next_page = await page.evaluate(sel => {
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
        
        listings = listings.concat(listings_next_page);
        --pages;
    }
    // Just logging out results for now
    console.log(listings);

  browser.close();
}

run();

// setInterval(run, config.loop_time)

