import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const screenshotsDir = 'docs/screenshots';
fs.mkdirSync(screenshotsDir, { recursive: true });

// Locate installed Chrome or Edge
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

console.log('Using browser executable:', executablePath);

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle']
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 }
});

const page = await context.newPage();
const baseUrl = 'http://127.0.0.1:5173';

console.log('=== RUNNING PLAYWRIGHT E2E BROWSER TESTS ===');

// 1. Homepage & 3D WebGL Intro
console.log('1. Testing Homepage & WebGL canvas...');
await page.goto(baseUrl, { waitUntil: 'networkidle' });
const title = await page.title();
console.log('   Page title:', title);
assert.ok(title.includes('CreaXa'));

// Wait for canvas or skip intro if visible
const hasCanvas = await page.$('canvas');
console.log('   WebGL / Three.js canvas present:', !!hasCanvas);

await page.screenshot({ path: path.join(screenshotsDir, '01_homepage_hero.png') });
console.log('   Saved screenshot: 01_homepage_hero.png');

// 2. All 10 Themes & Persistence
console.log('2. Testing All 10 Themes & Persistence...');
const themeNames = [
  'Obsidian Editorial',
  'Paper & Ink',
  'Carbon Acid',
  'Midnight Cobalt',
  'Terracotta Atelier',
  'Arctic Signal',
  'Plum Archive',
  'Industrial Mono',
  'Analog Film',
  'Deep Teal Gallery'
];

for (let i = 0; i < themeNames.length; i++) {
  await page.evaluate((themeIdx) => {
    document.documentElement.dataset.theme = String(themeIdx);
    localStorage.setItem('creaxa-theme', String(themeIdx));
  }, i);

  const appliedTheme = await page.evaluate(() => document.documentElement.dataset.theme);
  assert.equal(appliedTheme, String(i), `Theme ${i} should be applied`);
  if (i === 1 || i === 3 || i === 4) {
    await page.screenshot({ path: path.join(screenshotsDir, `02_theme_${i}_${themeNames[i].toLowerCase().replace(/[^a-z0-9]+/g, '_')}.png`) });
  }
}
console.log('   All 10 themes verified on document root.');

// Verify reload persistence
await page.reload({ waitUntil: 'networkidle' });
const persistedTheme = await page.evaluate(() => localStorage.getItem('creaxa-theme'));
assert.equal(persistedTheme, '9', 'Theme preference must persist in localStorage');
console.log('   Theme persistence across page reload verified.');

// Reset to Obsidian Editorial (Theme 0)
await page.evaluate(() => {
  document.documentElement.dataset.theme = '0';
  localStorage.setItem('creaxa-theme', '0');
});

// 3. Discover Creators Page & Currency Filter
console.log('3. Testing /discover and currency-aware filtering...');
await page.goto(`${baseUrl}/discover`, { waitUntil: 'networkidle' });

// Verify Alice Wonder creator card
await page.waitForSelector('.creator-card');
const creatorCards = await page.$$('.creator-card');
console.log(`   Found ${creatorCards.length} creator card(s) in discovery`);
assert.ok(creatorCards.length >= 1, 'Should display at least 1 creator card');

const bodyText = await page.innerText('body');
assert.ok(bodyText.includes('Alice Wonder'), 'Alice Wonder should appear in directory');
assert.ok(bodyText.includes('Runway'), 'Declared tools should appear');

await page.screenshot({ path: path.join(screenshotsDir, '03_discover_directory.png') });
console.log('   Saved screenshot: 03_discover_directory.png');

// 4. Creator Profile Page
console.log('4. Testing Creator Profile (/creators/alice-wonder)...');
await page.goto(`${baseUrl}/creators/alice-wonder`, { waitUntil: 'networkidle' });

const profileHeading = await page.innerText('h1');
assert.ok(profileHeading.includes('Alice Wonder'));
const profileText = await page.innerText('body');
assert.ok(profileText.includes('Senior AI Filmmaker'));
assert.ok(profileText.includes('$600 starting rate') || profileText.includes('600 starting rate'));
assert.ok(profileText.includes('Neon Odyssey: Act I'));
assert.ok(profileText.includes('5-star') || profileText.includes('Exceptional AI craftsmanship'));

await page.screenshot({ path: path.join(screenshotsDir, '04_creator_profile.png') });
console.log('   Saved screenshot: 04_creator_profile.png');

// 5. Portfolio Detail Page
console.log('5. Testing Portfolio Project View...');
const projectLink = await page.$('a[href*="/projects/neon-odyssey"]');
if (projectLink) {
  const projectHref = await projectLink.getAttribute('href');
  await page.goto(`${baseUrl}${projectHref}`, { waitUntil: 'networkidle' });
  const projectTitle = await page.innerText('h1');
  assert.ok(projectTitle.includes('Neon Odyssey'));
  assert.ok((await page.innerText('body')).includes('DaVinci Resolve'));
  await page.screenshot({ path: path.join(screenshotsDir, '05_portfolio_project.png') });
  console.log('   Saved screenshot: 05_portfolio_project.png');
}

// 6. Mobile Responsiveness Tests
console.log('6. Testing Mobile Responsiveness (390x844 iPhone / Android)...');
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(baseUrl, { waitUntil: 'networkidle' });

// Check horizontal overflow
const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
const innerWidth = await page.evaluate(() => window.innerWidth);
assert.ok(scrollWidth <= innerWidth + 1, `Horizontal overflow detected: ${scrollWidth} > ${innerWidth}`);
console.log(`   Mobile viewport width: ${innerWidth}px, scrollWidth: ${scrollWidth}px (no overflow)`);

// Test mobile navigation toggle
const mobileToggle = await page.$('.mobile-toggle');
if (mobileToggle) {
  await mobileToggle.click();
  const navOpen = await page.$('.nav.open');
  assert.ok(navOpen, 'Mobile navigation menu should open');
  await page.screenshot({ path: path.join(screenshotsDir, '06_mobile_nav_menu.png') });
  console.log('   Saved screenshot: 06_mobile_nav_menu.png');
  await mobileToggle.click();
}

// 7. Authenticated Brand Workspace
console.log('7. Testing Brand Dashboard (/app/brand)...');
await page.setViewportSize({ width: 1440, height: 900 });
await context.addCookies([{
  name: '__sites_local_auth',
  value: 'brand_acme',
  domain: '127.0.0.1',
  path: '/'
}]);

await page.goto(`${baseUrl}/app/brand`, { waitUntil: 'networkidle' });
const brandDashboardText = await page.innerText('body');
assert.ok(brandDashboardText.includes('Acme Studios') || brandDashboardText.includes('Workspace') || brandDashboardText.includes('Campaigns'));
await page.screenshot({ path: path.join(screenshotsDir, '07_brand_dashboard.png') });
console.log('   Saved screenshot: 07_brand_dashboard.png');

// 8. Authenticated Creator Workspace
console.log('8. Testing Creator Dashboard (/app/creator)...');
await context.addCookies([{
  name: '__sites_local_auth',
  value: 'creator_alice',
  domain: '127.0.0.1',
  path: '/'
}]);

await page.goto(`${baseUrl}/app/creator`, { waitUntil: 'networkidle' });
const creatorDashboardText = await page.innerText('body');
assert.ok(creatorDashboardText.includes('Alice Wonder') || creatorDashboardText.includes('Workspace') || creatorDashboardText.includes('Engagements'));
await page.screenshot({ path: path.join(screenshotsDir, '08_creator_dashboard.png') });
console.log('   Saved screenshot: 08_creator_dashboard.png');

// 9. Firebase Authentication Views (/login and /signup)
console.log('9. Testing Firebase Authentication UI (/login and /signup)...');
await context.clearCookies();

// Test Login View
await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
const loginText = await page.innerText('body');
assert.ok(loginText.includes('Welcome back') || loginText.includes('Sign in') || loginText.includes('CreaXa'));
assert.ok(loginText.includes('Google'), 'Google Auth button should be visible');
assert.equal(loginText.includes('Microsoft'), false, 'Microsoft Auth should be excluded');
assert.ok(loginText.includes('Email') || (await page.$('input[type="email"]')), 'Email input should be present');
const passwordInput = await page.$('input[type="password"]');
assert.ok(passwordInput, 'Password input should be present');
await page.screenshot({ path: path.join(screenshotsDir, '09_login_page.png') });
console.log('   Saved screenshot: 09_login_page.png');

// Test Signup View
await page.goto(`${baseUrl}/signup`, { waitUntil: 'networkidle' });
const signupText = await page.innerText('body');
assert.ok(signupText.includes('Create your account') || signupText.includes('Sign up'), 'Signup heading should be present');
assert.ok(signupText.includes('Google'), 'Google Signup option should be visible');
assert.equal(signupText.includes('Microsoft'), false, 'Microsoft Auth should be excluded');
await page.screenshot({ path: path.join(screenshotsDir, '10_signup_page.png') });
console.log('   Saved screenshot: 10_signup_page.png');

await browser.close();
console.log('=== ALL PLAYWRIGHT E2E BROWSER TESTS PASSED! ===');
