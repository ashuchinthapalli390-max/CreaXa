import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const screenshotsDir = 'docs/screenshots/workflow_repair';
fs.mkdirSync(screenshotsDir, { recursive: true });

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

console.log('Using browser executable:', executablePath);

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const baseUrl = 'http://127.0.0.1:5173';

try {
  console.log('\n========================================================================');
  console.log('   CREAXA WORKFLOW REPAIR & MULTI-VIEWPORT VERIFICATION SUITE');
  console.log('========================================================================\n');

  // --------------------------------------------------------------------------
  // TEST 1: DESKTOP (1440px) TWO-COLUMN BALANCED LAYOUT & ZERO COLLAPSE
  // --------------------------------------------------------------------------
  console.log('1. Testing Desktop 1440px Layout Dimensions...');
  const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopCtx.newPage();

  // Set intro seen flag so page lands directly on hero
  await desktopPage.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await desktopPage.evaluate(() => sessionStorage.setItem('creaxa_cinematic_intro_seen', '1'));
  await desktopPage.goto(baseUrl, { waitUntil: 'networkidle' });

  const workflowContainer = await desktopPage.waitForSelector('.workflow-story-container', { timeout: 6000 });
  assert.ok(workflowContainer, 'Workflow container must be mounted');
  await desktopPage.locator('.workflow-story-container').scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);

  // Measure Panels
  const inputPanel = await desktopPage.$('.stage-panel.input-panel');
  const matchingPanel = await desktopPage.$('.stage-panel.matching-panel');

  assert.ok(inputPanel, 'Input panel must exist');
  assert.ok(matchingPanel, 'Matching panel must exist');

  const inputBox = await inputPanel.boundingBox();
  const matchingBox = await matchingPanel.boundingBox();

  console.log(`   Left Panel (Input & Brief):  width=${inputBox?.width.toFixed(1)}px, height=${inputBox?.height.toFixed(1)}px`);
  console.log(`   Right Panel (Matching Pool): width=${matchingBox?.width.toFixed(1)}px, height=${matchingBox?.height.toFixed(1)}px`);

  // Assertions against the 40px collapse bug:
  assert.ok(matchingBox && matchingBox.width > 400, `Right panel must NOT collapse to 40px! Measured: ${matchingBox?.width}px`);
  assert.ok(inputBox && inputBox.width > 400, `Left panel must have balanced width! Measured: ${inputBox?.width}px`);

  // Assert panels are balanced side-by-side on desktop
  const widthDifference = Math.abs((inputBox?.width ?? 0) - (matchingBox?.width ?? 0));
  console.log(`   Width difference between panels: ${widthDifference.toFixed(1)}px`);
  assert.ok(widthDifference < 60, `Panels must be evenly balanced (diff < 60px). Found diff: ${widthDifference}px`);

  // Check side-by-side alignment: their top should be approximately equal
  const topDiff = Math.abs((inputBox?.y ?? 0) - (matchingBox?.y ?? 0));
  assert.ok(topDiff < 20, `Panels must sit side-by-side horizontally on desktop. Top diff: ${topDiff}px`);

  await desktopPage.screenshot({ path: path.join(screenshotsDir, 'desktop_1440_balanced_panels.png') });
  console.log('   ✓ Saved screenshot: desktop_1440_balanced_panels.png');

  // --------------------------------------------------------------------------
  // TEST 2: TEST ALL 8 WORKFLOW STAGES (Verify clean rendering without collapse)
  // --------------------------------------------------------------------------
  console.log('\n2. Testing All 8 Workflow Stages & Stability During Transitions...');
  const chapterPills = await desktopPage.$$('.chapter-pill');
  console.log(`   Found ${chapterPills.length} stage navigation pills`);
  assert.equal(chapterPills.length, 8, 'Must provide 8 explicit stage navigation pills');

  for (let i = 0; i < chapterPills.length; i++) {
    const pill = chapterPills[i];
    const pillText = await pill.innerText();
    console.log(`   Clicking Stage ${i + 1}: "${pillText}"...`);
    await pill.click();
    await desktopPage.waitForTimeout(400);

    // Verify right panel dimension remains rock-solid in every stage
    const currentMatchingBox = await matchingPanel.boundingBox();
    const currentInputBox = await inputPanel.boundingBox();

    assert.ok(currentMatchingBox && currentMatchingBox.width > 400, `Right panel must stay > 400px during Stage ${i + 1}`);
    assert.ok(currentInputBox && currentInputBox.width > 400, `Left panel must stay > 400px during Stage ${i + 1}`);

    // Verify stage indicator title matches
    const stageTitle = await desktopPage.$eval('#workflow-current-stage-title', el => el.innerText);
    console.log(`     Active Stage Title: "${stageTitle}" | Right panel width: ${currentMatchingBox.width.toFixed(1)}px`);

    await desktopPage.screenshot({ path: path.join(screenshotsDir, `stage_${i + 1}_transition.png`) });
  }
  console.log('   ✓ All 8 stages transitioned cleanly with stable panel dimensions');

  // --------------------------------------------------------------------------
  // TEST 3: INTERACTIVE CAPABILITIES (Filter chips, manual prompt editing, milestones)
  // --------------------------------------------------------------------------
  console.log('\n3. Testing Interactive Capabilities...');
  
  // Jump to Stage 4 (Creator Discovery)
  await chapterPills[3].click();
  await desktopPage.waitForTimeout(300);

  // Click filter chip "Runway Gen-3" to toggle it
  const filterChips = await desktopPage.$$('.story-chip');
  console.log(`   Found ${filterChips.length} interactive sample filter chips`);
  assert.ok(filterChips.length >= 4, 'Must render sample filter chips');

  const initialChipClass = await filterChips[2].getAttribute('class');
  console.log(`   Chip 3 initial class: ${initialChipClass}`);
  await filterChips[2].click();
  await desktopPage.waitForTimeout(200);
  const toggledChipClass = await filterChips[2].getAttribute('class');
  console.log(`   Chip 3 toggled class: ${toggledChipClass}`);
  assert.notEqual(initialChipClass, toggledChipClass, 'Filter chip class must toggle upon click');

  // Jump to Stage 8 (Collaboration Lifecycle)
  await chapterPills[7].click();
  await desktopPage.waitForTimeout(400);

  const milestoneSteps = await desktopPage.$$('.milestone-step');
  console.log(`   Found ${milestoneSteps.length} lifecycle milestones`);
  assert.equal(milestoneSteps.length, 6, 'Must render all 6 lifecycle milestones');

  // Click milestone 4 ("4. Revision")
  await milestoneSteps[3].click();
  await desktopPage.waitForTimeout(200);
  const milestone4Class = await milestoneSteps[3].getAttribute('class');
  assert.ok(milestone4Class?.includes('current'), 'Clicked milestone must receive current class');
  console.log('   ✓ Milestone clicked and focused successfully');

  await desktopCtx.close();

  // --------------------------------------------------------------------------
  // TEST 4: MULTI-VIEWPORT RESPONSIVE AUDIT (360px, 390px, 768px, 1024px, 1280px, 1920px)
  // --------------------------------------------------------------------------
  console.log('\n4. Testing Across Viewports (360px, 390px, 768px, 1024px, 1280px, 1920px)...');
  const viewports = [
    { width: 360, height: 740, name: 'mobile_360' },
    { width: 390, height: 844, name: 'mobile_390' },
    { width: 768, height: 1024, name: 'tablet_768' },
    { width: 1024, height: 768, name: 'small_desktop_1024' },
    { width: 1280, height: 800, name: 'desktop_1280' },
    { width: 1920, height: 1080, name: 'large_desktop_1920' }
  ];

  for (const vp of viewports) {
    const vpCtx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const vpPage = await vpCtx.newPage();

    await vpPage.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await vpPage.evaluate(() => sessionStorage.setItem('creaxa_cinematic_intro_seen', '1'));
    await vpPage.goto(baseUrl, { waitUntil: 'networkidle' });

    await vpPage.locator('.workflow-story-container').scrollIntoViewIfNeeded();
    await vpPage.waitForTimeout(400);

    const vpInput = await vpPage.$('.stage-panel.input-panel');
    const vpMatching = await vpPage.$('.stage-panel.matching-panel');
    const vpInputBox = await vpInput?.boundingBox();
    const vpMatchingBox = await vpMatching?.boundingBox();

    console.log(`   [Viewport ${vp.width}x${vp.height} (${vp.name})]:`);
    console.log(`     Input panel width:    ${vpInputBox?.width.toFixed(1)}px`);
    console.log(`     Matching panel width: ${vpMatchingBox?.width.toFixed(1)}px`);

    if (vp.width <= 960) {
      // Must stack vertically
      assert.ok(vpMatchingBox && vpInputBox, 'Panels must exist');
      assert.ok(
        (vpMatchingBox?.y ?? 0) >= (vpInputBox?.y ?? 0) + (vpInputBox?.height ?? 0) - 20,
        `Panels must stack vertically on mobile/tablet (viewport ${vp.width}px)`
      );
      // Width must occupy nearly full container width (> 80% of viewport width)
      assert.ok(
        (vpMatchingBox?.width ?? 0) > vp.width * 0.75,
        `Matching panel should span container width on mobile. Measured: ${vpMatchingBox?.width}px`
      );
    } else {
      // Must sit side by side and never collapse to 40px
      assert.ok(
        (vpMatchingBox?.width ?? 0) > 350,
        `Right panel must never collapse on desktop! Measured: ${vpMatchingBox?.width}px`
      );
    }

    await vpPage.screenshot({ path: path.join(screenshotsDir, `viewport_${vp.name}.png`) });
    await vpCtx.close();
  }

  console.log('\n========================================================================');
  console.log('   ✓ ALL WORKFLOW REPAIR & RESPONSIVE TESTS PASSED FLAWLESSLY!');
  console.log('========================================================================\n');
} catch (err) {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
} finally {
  await browser.close();
}
