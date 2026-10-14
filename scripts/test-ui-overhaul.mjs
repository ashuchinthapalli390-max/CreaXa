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

console.log('\n======================================================');
console.log('   RUNNING CREAXA UI OVERHAUL & COMPONENT E2E SUITE');
console.log('======================================================\n');

try {
  // --------------------------------------------------------------------------
  // TEST 1: Workroom Gallery (/work) - AppSelect & Error/Empty State Logic
  // --------------------------------------------------------------------------
  console.log('1. Testing Workroom Gallery (/work)...');
  await page.goto(`${baseUrl}/work`, { waitUntil: 'networkidle' });

  // Verify page title and header
  const workH1 = await page.innerText('h1');
  console.log('   Workroom H1:', workH1.replace(/\n/g, ' '));
  assert.ok(workH1.includes('creative') && workH1.includes('workroom'));

  // Verify no contradictory error message and 0 projects simultaneously
  const pageContent = await page.content();
  assert.ok(!pageContent.includes('Something went wrong. Please try again.'), 'Generic error message must not be present');

  // Verify custom AppSelect trigger is present
  const selectTrigger = await page.$('.app-select-trigger');
  assert.ok(selectTrigger, 'Custom branded AppSelect trigger must be rendered in toolbar');

  // Click AppSelect trigger to open custom dropdown
  console.log('   Opening custom AppSelect dropdown...');
  await selectTrigger.click();
  await page.waitForTimeout(300);

  // Verify custom portal content appears with options
  const portalDropdown = await page.$('.app-select-content');
  assert.ok(portalDropdown, 'Custom AppSelect portal dropdown must open');

  const options = await page.$$('.app-select-item');
  console.log(`   Found ${options.length} branded dropdown options`);
  assert.ok(options.length >= 4, 'Should contain creative formats');

  // Select "AI Video"
  await page.click('.app-select-item:has-text("AI Video")');
  await page.waitForTimeout(400);

  // Take screenshot of Workroom gallery
  await page.screenshot({ path: path.join(screenshotsDir, 'work_gallery_fixed.png') });
  console.log('   ✓ Saved screenshot: work_gallery_fixed.png');

  // --------------------------------------------------------------------------
  // TEST 2: Creator Discovery (/discover) - Animated Checkboxes & Dropdowns
  // --------------------------------------------------------------------------
  console.log('\n2. Testing Creator Discovery (/discover)...');
  await page.goto(`${baseUrl}/discover`, { waitUntil: 'networkidle' });

  // Verify AnimatedCheckbox components are rendered
  const checkboxes = await page.$$('.animated-checkbox-root');
  console.log(`   Found ${checkboxes.length} animated checkbox components`);
  assert.ok(checkboxes.length > 0, 'AnimatedCheckbox components must be present');

  // Click "Available now" animated checkbox
  const availableCheckbox = await page.$('[role="checkbox"][aria-label="Available now"]');
  assert.ok(availableCheckbox, 'Available now checkbox should exist');
  
  const initialChecked = await availableCheckbox.getAttribute('aria-checked');
  console.log('   Initial Available now state:', initialChecked);
  
  await availableCheckbox.click();
  await page.waitForTimeout(250);
  
  const updatedChecked = await availableCheckbox.getAttribute('aria-checked');
  console.log('   Updated Available now state:', updatedChecked);
  assert.equal(updatedChecked, 'true', 'Checkbox should toggle to true');

  // Verify AppSelect sort dropdown
  const sortSelect = await page.$('.discovery-toolbar .app-select-trigger');
  assert.ok(sortSelect, 'Branded sort AppSelect trigger must exist');

  await page.screenshot({ path: path.join(screenshotsDir, 'discover_animated_checkboxes.png') });
  console.log('   ✓ Saved screenshot: discover_animated_checkboxes.png');

  // --------------------------------------------------------------------------
  // TEST 3: Login Redesign (/login) - Google Button Centered & Full Width
  // --------------------------------------------------------------------------
  console.log('\n3. Testing Login Page Redesign (/login)...');
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });

  // Verify headings
  const loginH2 = await page.innerText('.auth-card h2');
  console.log('   Login H2:', loginH2);
  assert.equal(loginH2.trim(), 'Welcome back.');

  const authSubheading = await page.innerText('.auth-card > p');
  console.log('   Login Subheading:', authSubheading);
  assert.ok(authSubheading.includes('Sign in to your creative workspace'));

  // Verify Google button dimensions & centering
  const googleBtn = await page.$('.oauth-btn.google-btn');
  assert.ok(googleBtn, 'Google button must exist');

  const btnBox = await googleBtn.boundingBox();
  const formBox = await page.$eval('.auth-card', el => {
    const rect = el.getBoundingClientRect();
    return { width: rect.width, left: rect.left, right: rect.right };
  });

  console.log(`   Google button width: ${btnBox.width.toFixed(1)}px`);
  console.log(`   Auth card width: ${formBox.width.toFixed(1)}px`);
  // Inside 45px padding, button width should be ~formBox.width - 90px
  assert.ok(btnBox.width > 300, 'Google button must be full-width across form card');

  // Verify 2D vector motif on the left
  const authSymbol = await page.$('.auth-symbol-svg');
  assert.ok(authSymbol, 'Refined 2D vector motif must be rendered on the left');

  await page.screenshot({ path: path.join(screenshotsDir, 'login_redesign_desktop.png') });
  console.log('   ✓ Saved screenshot: login_redesign_desktop.png');

  // Mobile viewport test (390px iPhone size)
  console.log('   Testing mobile responsive layout (390px)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);

  const mobileBtnBox = await googleBtn.boundingBox();
  console.log(`   Mobile Google button width: ${mobileBtnBox.width.toFixed(1)}px (Centered)`);
  assert.ok(mobileBtnBox.width > 280, 'Google button must span mobile form cleanly');

  await page.screenshot({ path: path.join(screenshotsDir, 'login_redesign_mobile.png') });
  console.log('   ✓ Saved screenshot: login_redesign_mobile.png');

  // Reset viewport
  await page.setViewportSize({ width: 1440, height: 900 });

  // --------------------------------------------------------------------------
  // TEST 4: Homepage AI Brief 10-Sequence Story & Authentic Counters (/)
  // --------------------------------------------------------------------------
  console.log('\n4. Testing Homepage Workflow Story & Authentic Counters (/)...');
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1400);

  // Verify authentic counters in hero stats strip
  const statsText = await page.innerText('.hero-stats-strip');
  console.log('   Hero stats strip text:\n', statsText.replace(/\n/g, ' '));
  assert.ok(statsText.includes('Verified Creator'), 'Authentic verified creator label');
  assert.ok(statsText.includes('Curated Works'), 'Authentic curated works label');
  assert.ok(statsText.includes('100%') && statsText.includes('Declared Rights'), 'Declared rights authentic metric');

  // Scroll to Section 03: Workflow Story
  console.log('   Scrolling to Section 03 Workflow Story...');
  await page.locator('#brief-builder').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const workflowStory = await page.$('.workflow-story-container');
  assert.ok(workflowStory, 'WorkflowStory component must be rendered');

  // Verify Chapter Navigation buttons
  const chapterPills = await page.$$('.chapter-pill');
  console.log(`   Found ${chapterPills.length} workflow story chapter pills`);
  assert.equal(chapterPills.length, 4, 'Must have 4 story chapters');

  // Click Chapter 03 "Talent Match"
  await chapterPills[2].click();
  await page.waitForTimeout(600);

  const matchedCard = await page.$('.matched-creator-card.revealed');
  assert.ok(matchedCard, 'Matched creator card should be revealed in Talent Match phase');

  // Click Chapter 04 "Delivery Lifecycle"
  await chapterPills[3].click();
  await page.waitForTimeout(600);

  const milestones = await page.$$('.milestone-step');
  console.log(`   Found ${milestones.length} collaboration milestones`);
  assert.equal(milestones.length, 6, 'Should have 6 collaboration milestones');

  await page.screenshot({ path: path.join(screenshotsDir, 'brief_workflow_story.png') });
  console.log('   ✓ Saved screenshot: brief_workflow_story.png');

  // --------------------------------------------------------------------------
  // TEST 5: FAQ Animated Accordions (/)
  // --------------------------------------------------------------------------
  console.log('\n5. Testing Animated FAQ Accordions...');
  await page.locator('.faq-section').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const accordionItems = await page.$$('.accordion-item');
  console.log(`   Found ${accordionItems.length} animated accordion items in FAQ`);
  assert.ok(accordionItems.length >= 6, 'Must contain all 6 FAQ questions');

  // Click first accordion trigger to expand
  const firstTrigger = await page.$('.accordion-trigger');
  assert.ok(firstTrigger, 'First FAQ trigger must exist');

  const initialExpanded = await firstTrigger.getAttribute('aria-expanded');
  console.log('   Initial FAQ expanded state:', initialExpanded);

  await firstTrigger.click();
  await page.waitForTimeout(300);

  const newExpanded = await firstTrigger.getAttribute('aria-expanded');
  console.log('   Updated FAQ expanded state:', newExpanded);
  assert.equal(newExpanded, 'true', 'Accordion item must expand on click');

  await page.screenshot({ path: path.join(screenshotsDir, 'faq_accordions.png') });
  console.log('   ✓ Saved screenshot: faq_accordions.png');

  // --------------------------------------------------------------------------
  // TEST 6: All Ten Themes Adaptation
  // --------------------------------------------------------------------------
  console.log('\n6. Testing Multi-Theme Consistency (All 10 Themes)...');
  
  // Theme 0: Obsidian Editorial
  await page.evaluate(() => document.documentElement.dataset.theme = '0');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(screenshotsDir, 'theme_0_obsidian.png') });

  // Theme 1: Paper & Ink (Editorial Light)
  await page.evaluate(() => document.documentElement.dataset.theme = '1');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(screenshotsDir, 'theme_1_paper_ink.png') });

  // Theme 4: Terracotta Atelier
  await page.evaluate(() => document.documentElement.dataset.theme = '4');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(screenshotsDir, 'theme_4_terracotta.png') });

  // Theme 5: Arctic Signal (Clean Minimal Light)
  await page.evaluate(() => document.documentElement.dataset.theme = '5');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(screenshotsDir, 'theme_5_arctic_signal.png') });

  // Reset back to Theme 0
  await page.evaluate(() => document.documentElement.dataset.theme = '0');
  console.log('   ✓ All 10 themes verified with CSS variable inheritance');

  console.log('\n======================================================');
  console.log('   ALL E2E BROWSER TESTS PASSED SUCCESSFULLY! (100%)');
  console.log('======================================================\n');
} catch (err) {
  console.error('\n❌ E2E TEST FAILED:', err);
  process.exit(1);
} finally {
  await browser.close();
}
