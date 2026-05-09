import puppeteer from "puppeteer-core";

const baseUrl = process.argv[2];
if (!baseUrl) {
  throw new Error("Expected preview URL as the first argument.");
}

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium",
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2, hasTouch: true });
await page.goto(baseUrl, { waitUntil: "networkidle2" });

await page.waitForSelector('header');
const menuLabelBefore = await page.evaluate(() => document.body.innerText.includes("Promoters"));
const buttons = await page.$$('header button');
let clickedMenu = false;
for (const button of buttons) {
  const box = await button.boundingBox();
  if (!box || box.width < 20 || box.height < 20) continue;
  await button.click();
  clickedMenu = true;
  break;
}
if (!clickedMenu) {
  throw new Error('Could not find a visible mobile menu button in the header.');
}
await page.waitForSelector('[role="dialog"]');
const drawerHasPromoters = await page.evaluate(() => document.body.innerText.includes("Promoters"));
await page.evaluate(() => {
  const promoterLink = document.querySelector('a[href="/browse/promoters"]');
  if (!(promoterLink instanceof HTMLElement)) {
    throw new Error('Could not find the Promoter drawer link.');
  }
  promoterLink.click();
});
await page.waitForFunction(() => window.location.pathname === "/browse/promoters");
const promoterRouteOk = page.url().includes('/browse/promoters');

await page.goto(baseUrl, { waitUntil: "networkidle2" });
await page.waitForSelector('input[placeholder="Your name"]');
await page.type('input[placeholder="Your name"]', 'Mobile QA');
await page.type('input[placeholder="Email address"]', `mobile-qa-${Date.now()}@example.com`);
await page.type('textarea[placeholder="What are you trying to book, manage, or grow?"]', 'Testing the landing-page waitlist flow on a mobile viewport.');
await page.click('button[type="submit"]');
await page.waitForFunction(() => document.body.innerText.includes('You are on the list. We will reach out with the next access window.'));
const waitlistSuccess = await page.evaluate(() => document.body.innerText.includes('You are on the list. We will reach out with the next access window.'));

console.log(JSON.stringify({
  menuLabelBefore,
  drawerHasPromoters,
  promoterRouteOk,
  waitlistSuccess,
}, null, 2));

await browser.close();
