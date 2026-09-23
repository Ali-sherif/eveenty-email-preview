import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:54701/');
await page.selectOption('#emailSelect', 'activate_email');
await page.selectOption('#viewportSelect', '800');
await page.click('#btnRefresh');
await page.waitForTimeout(500);
const frame = await (await page.$('#previewFrame')).contentFrame();
const info = await frame.evaluate(() => {
  const h1 = document.querySelector('h1');
  const para = document.querySelector('p');
  const a = document.querySelector('a[href*="activate"]');
  const foot = document.querySelector('td[style*="border-top"]');
  return {
    h1Family: getComputedStyle(h1).fontFamily,
    h1Weight: getComputedStyle(h1).fontWeight,
    pFamily: getComputedStyle(para).fontFamily,
    ctaFamily: getComputedStyle(a).fontFamily,
    footerAlign: foot?.getAttribute('align'),
    footerText: foot?.innerText,
    jakartaAvailable: document.fonts ? document.fonts.check("16px 'Plus Jakarta Sans'") : null,
    robotoAvailable: document.fonts ? document.fonts.check('16px Roboto') : null,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
