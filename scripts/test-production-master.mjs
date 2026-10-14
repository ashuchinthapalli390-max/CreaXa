import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const screenshotsDir = 'docs/screenshots';
fs.mkdirSync(screenshotsDir, { recursive: true });

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

console.log('\n==================================================================');
console.log('   CREAXA FINAL PRODUCTION COMPLETION MASTER TEST SUITE');
console.log('==================================================================\n');

try {
  // --------------------------------------------------------------------------
  // TEST 1: Cinematic 5-Second 2D Opening Sequence (/)
  // --------------------------------------------------------------------------
  console.log('1. Testing Cinematic 5-Second 2D Opening Sequence...');
  // Clear sessionStorage so intro triggers
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => sessionStorage.removeItem('creaxa_cinematic_intro_seen'));
  await page.reload({ waitUntil: 'domcontentloaded' });

  const introOverlay = await page.waitForSelector('.cinematic-intro-overlay', { timeout: 5000 });
  assert.ok(introOverlay, 'Cinematic intro overlay must be rendered on first eligible visit');

  const skipBtn = await page.$('.skip-intro-btn');
  assert.ok(skipBtn, 'Visible Skip Intro button must be present');

  console.log('   ✓ Cinematic intro rendered with visible Skip button');
  await page.screenshot({ path: path.join(screenshotsDir, 'cinematic_intro_active.png') });

  // Test keyboard escape or skip click
  console.log('   Skipping intro via Escape key...');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  const seenFlag = await page.evaluate(() => sessionStorage.getItem('creaxa_cinematic_intro_seen'));
  assert.equal(seenFlag, '1', 'sessionStorage must record intro as seen');
  console.log('   ✓ Intro dismissed cleanly and marked in sessionStorage');

  // --------------------------------------------------------------------------
  // TEST 2: FAQ Answers Hidden When Closed (No text leakage)
  // --------------------------------------------------------------------------
  console.log('\n2. Testing FAQ Accordion (No closed text leakage)...');
  await page.goto(`${baseUrl}/faq`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Check first FAQ closed panel height and visibility
  const firstPanel = await page.$('#accordion-panel-0');
  assert.ok(firstPanel, 'First FAQ panel must exist');

  const panelBoxClosed = await firstPanel.boundingBox();
  const isHiddenAttr = await firstPanel.getAttribute('aria-hidden');
  const panelClasses = await firstPanel.getAttribute('class');

  console.log(`   Closed FAQ panel height: ${panelBoxClosed?.height ?? 0}px`);
  console.log(`   Closed FAQ aria-hidden: ${isHiddenAttr}`);
  console.log(`   Closed FAQ classes: ${panelClasses}`);

  // In closed state, height must be 0 or effectively 0 (no layout height / no leaked answer text)
  assert.ok(!panelBoxClosed || panelBoxClosed.height <= 1, 'Closed panel height must be 0px without text leakage');
  assert.equal(isHiddenAttr, 'true', 'Closed panel must have aria-hidden="true"');

  // Click first trigger to expand
  console.log('   Expanding FAQ question 1...');
  await page.click('#accordion-btn-0');
  await page.waitForTimeout(400);

  const panelBoxOpen = await firstPanel.boundingBox();
  const isHiddenOpen = await firstPanel.getAttribute('aria-hidden');
  console.log(`   Open FAQ panel height: ${panelBoxOpen?.height}px`);
  assert.ok(panelBoxOpen && panelBoxOpen.height > 20, 'Open panel must expand smoothly to accommodate answer');
  assert.equal(isHiddenOpen, 'false', 'Open panel must have aria-hidden="false"');

  // Click to close
  console.log('   Collapsing FAQ question 1...');
  await page.click('#accordion-btn-0');
  await page.waitForTimeout(400);

  const panelBoxReclosed = await firstPanel.boundingBox();
  console.log(`   Reclosed FAQ panel height: ${panelBoxReclosed?.height ?? 0}px`);
  assert.ok(!panelBoxReclosed || panelBoxReclosed.height <= 1, 'Reclosed panel must return to 0px');

  await page.screenshot({ path: path.join(screenshotsDir, 'faq_fixed_no_leak.png') });
  console.log('   ✓ Saved screenshot: faq_fixed_no_leak.png');

  // --------------------------------------------------------------------------
  // TEST 3: Checkbox Hover - NEVER Looks Unchecked When Selected
  // --------------------------------------------------------------------------
  console.log('\n3. Testing Checkbox Hover State Hierarchy (/discover)...');
  await page.goto(`${baseUrl}/discover`, { waitUntil: 'networkidle' });

  const availableCheckbox = await page.$('[role="checkbox"][aria-label="Available now"]');
  assert.ok(availableCheckbox, 'Available now checkbox must exist');

  // Step A: Hover unchecked checkbox -> must remain unchecked
  await availableCheckbox.hover();
  await page.waitForTimeout(200);
  let checkedState = await availableCheckbox.getAttribute('aria-checked');
  assert.equal(checkedState, 'false', 'Unchecked + Hover must remain unchecked');

  // Step B: Click to check
  await availableCheckbox.click();
  await page.waitForTimeout(250);
  checkedState = await availableCheckbox.getAttribute('aria-checked');
  assert.equal(checkedState, 'true', 'Checkbox must be checked');

  // Step C: Hover checked checkbox -> MUST REMAIN VIBRANT LIME AND CHECKED!
  await availableCheckbox.hover();
  await page.waitForTimeout(200);

  const boxClasses = await availableCheckbox.getAttribute('class');
  console.log('   Checked + Hover classes:', boxClasses);
  assert.ok(boxClasses?.includes('is-checked'), 'Must keep is-checked class on hover');

  const checkIconVisible = await page.$eval(
    '[role="checkbox"][aria-label="Available now"] .check-icon',
    el => window.getComputedStyle(el).opacity
  );
  console.log(`   Checked + Hover checkmark opacity: ${checkIconVisible}`);
  assert.equal(checkIconVisible, '1', 'Checkmark must remain 100% visible on hover');

  await page.screenshot({ path: path.join(screenshotsDir, 'checkbox_hover_checked.png') });
  console.log('   ✓ Saved screenshot: checkbox_hover_checked.png');

  // --------------------------------------------------------------------------
  // TEST 4: Workflow Story (No Pause/Reset buttons, clean 7 phases)
  // --------------------------------------------------------------------------
  console.log('\n4. Testing Workflow Storytelling (/) Controls...');
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.locator('.workflow-story-container').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // Check that Pause and Reset controls are NOT present
  const pauseBtn = await page.$('button[title="Pause"], button[title="Play"]');
  const resetBtn = await page.$('button[title="Restart"]');
  assert.ok(!pauseBtn, 'Pause/Play controls must be removed');
  assert.ok(!resetBtn, 'Restart/Reset controls must be removed');
  console.log('   ✓ Verified: Pause and Reset controls successfully removed from interface');

  const chapterPills = await page.$$('.chapter-pill');
  console.log(`   Found ${chapterPills.length} clean workflow stage pills`);
  assert.equal(chapterPills.length, 8, 'Should contain 8 stage pills');

  const inputPanel = await page.$('.stage-panel.input-panel');
  const matchingPanel = await page.$('.stage-panel.matching-panel');
  const inputBox = await inputPanel.boundingBox();
  const matchingBox = await matchingPanel.boundingBox();

  console.log(`   Workflow panels width: Left=${inputBox?.width.toFixed(1)}px, Right=${matchingBox?.width.toFixed(1)}px`);
  assert.ok(matchingBox && matchingBox.width > 400, 'Right panel must be > 400px on desktop');
  assert.ok(inputBox && inputBox.width > 400, 'Left panel must be > 400px on desktop');

  await page.screenshot({ path: path.join(screenshotsDir, 'workflow_story_clean.png') });
  console.log('   ✓ Saved screenshot: workflow_story_clean.png');

  // --------------------------------------------------------------------------
  // TEST 5: Admin Dashboard & RBAC (/admin)
  // --------------------------------------------------------------------------
  console.log('\n5. Testing Admin Dashboard & RBAC...');
  
  // Unauthenticated access to /api/admin must return 401 or 403
  const unauthRes = await fetch(`${baseUrl}/api/admin`);
  console.log(`   Unauthenticated GET /api/admin status: ${unauthRes.status}`);
  assert.ok(unauthRes.status === 401 || unauthRes.status === 403, 'Unauthenticated admin endpoint access must be rejected');

  console.log('   ✓ Admin RBAC server enforcement verified');

  console.log('\n==================================================================');
  console.log('   ALL MASTER E2E TESTS PASSED WITH 100% SUCCESS!');
  console.log('==================================================================\n');
} catch (err) {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
} finally {
  await browser.close();
}
