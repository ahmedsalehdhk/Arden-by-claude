const puppeteer = require('puppeteer');
const path = require('path');

const OUTPUT_DIR = 'C:\\Users\\ahmed\\AppData\\Roaming\\Claude\\local-agent-mode-sessions\\a2dd79e4-84f7-412c-b1f6-e660acb9571c\\697f6af7-a20e-4d9b-aef2-d3ba72def278\\agent\\local_ditto_697f6af7-a20e-4d9b-aef2-d3ba72def278\\outputs';

const PAGES = [
  { url: 'https://shantaholdings.com/about-us/', file: 'shanta_about.png' },
  { url: 'https://shantaholdings.com/projects/', file: 'shanta_projects.png' },
  { url: 'https://shantaholdings.com/contact/contact-us/', file: 'shanta_contact.png' },
];

async function slowScroll(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const step = 300;
  for (let y = 0; y < height; y += step) {
    await page.evaluate((scrollY) => window.scrollTo({ top: scrollY, behavior: 'smooth' }), y);
    await new Promise(r => setTimeout(r, 800));
  }
  // Scroll back to top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const { url, file } of PAGES) {
    console.log(`Visiting: ${url}`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait 4s for animations
    await new Promise(r => setTimeout(r, 4000));

    // Slow scroll to trigger GSAP/Lenis
    await slowScroll(page);

    // Final wait
    await new Promise(r => setTimeout(r, 1000));

    const outPath = path.join(OUTPUT_DIR, file);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`Saved: ${outPath}`);
    await page.close();
  }

  await browser.close();
  console.log('Done!');
})();
