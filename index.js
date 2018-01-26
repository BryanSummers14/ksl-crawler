const puppeteer = require('puppeteer');
const config = require('./selector-config');
const search_data = require('./search-config');

async function run() {
  const LISTING_SELECTORS = {
    LISTINGS: ".listing-item.normal"
  };
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(config.search_url);
  await page.waitFor(4 * 1000);
  // Fill search form
  try {
    await page.click(config.keyword_search_input);
    await page.keyboard.type(search_data.keywords);
  
    await page.click(config.price_range_low);
    await page.keyboard.type(search_data.price_min);
  
    await page.click(config.price_range_high);
    await page.keyboard.type(search_data.price_max);
  
    await page.click(config.zip);
    await page.keyboard.type(search_data.zip_code);
  
    await page.select(config.zip_range, search_data.range);
  
    await page.click(config.search_button);
    await page.waitForNavigation();
    // Initial listings
    let listings = await page.evaluate(sel => {
      const potentialListings = [];
      document.querySelectorAll(sel.LISTINGS).forEach(_elem => {
        const elemData = _elem.children[1];
        const _title = elemData.children[0].children[0].textContent;
        const _link = elemData.children[0].children[0].href;
        const _price = parseInt(elemData.children[1].textContent.replace('$', ''), 10);
        potentialListings.push({title : _title, link: _link, price: _price});
      });
      return potentialListings;
    }, LISTING_SELECTORS);
    
    let pages = search_data.pages_to_search && search_data.pages_to_search > 0 ? search_data.pages_to_search : 0;
    // Listings for each additional page
    while(pages > 0) {
      await page.click(config.next_selector);
      await page.waitFor(2000);
      
      let listings_next_page = await page.evaluate(sel => {
        const potentialListings = [];
        document.querySelectorAll(sel.LISTINGS).forEach(_elem => {
          const elemData = _elem.children[1];
          const _title = elemData.children[0].children[0].textContent;
          const _link = elemData.children[0].children[0].href;
          const _price = parseInt(elemData.children[1].textContent.replace('$', ''), 10);
          potentialListings.push({title : _title, link: _link, price: _price});
        });
        return potentialListings;
      }, LISTING_SELECTORS);
      
      listings = listings.concat(listings_next_page);
      --pages;
    }
    // Just logging out results for now
    console.log(listings);
    
  } catch (err) {
    console.error(err);
  }
  browser.close();
}
let intervalHandle;
if (search_data.loop_time) {
  intervalHandle = setInterval(run, search_data.loop_time);
} else {
  run();
}

if (search_data.times_to_loop) {
  const total_time = search_data.times_to_loop * search_data.loop_time;
  setTimeout(_ => { clearInterval(intervalHandle); }, total_time);
}

// setInterval(run, config.loop_time)

