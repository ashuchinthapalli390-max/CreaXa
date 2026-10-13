import assert from 'node:assert/strict';

const baseUrl = 'http://127.0.0.1:5173';
const origin = 'http://127.0.0.1:5173';

async function request(path, options = {}) {
  const headers = {
    'Origin': origin,
    'Accept': 'application/json',
    ...(options.headers || {})
  };
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers
  });
  const contentType = res.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  return { status: res.status, headers: res.headers, data };
}

console.log('--- STARTING LIVE END-TO-END MARKETPLACE TEST ---');

// STEP 1: Verify /api/me without auth
const anonMe = await request('/api/me');
assert.equal(anonMe.status, 200);
assert.equal(anonMe.data.user, null);
console.log('✓ Step 1: Anonymous session validated');

// STEP 2: Authenticate Brand Acme and Creator Alice
const brandCookie = '__sites_local_auth=brand_acme';
const creatorCookie = '__sites_local_auth=creator_alice';

const brandMe = await request('/api/me', { headers: { cookie: brandCookie } });
assert.equal(brandMe.status, 200);
assert.equal(brandMe.data.user.userId, 'brand_acme');

const creatorMe = await request('/api/me', { headers: { cookie: creatorCookie } });
assert.equal(creatorMe.status, 200);
assert.equal(creatorMe.data.user.userId, 'creator_alice');
console.log('✓ Step 2: Multi-identity sessions verified for Brand and Creator');

// STEP 3: Complete Account Setup
// Set up Brand Acme
const brandSetup = await request('/api/account', {
  method: 'POST',
  headers: { cookie: brandCookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Acme Studios',
    role: 'brand',
    organization: 'Acme Corp',
    industry: 'Entertainment',
    website: 'https://acme.example.com',
    goals: 'Produce high-quality AI cinematics',
    description: 'A global storytelling brand',
    contactEmail: 'producer@acme.example.com',
    country: 'United States',
    currency: 'USD',
    terms: true
  })
});
assert.equal(brandSetup.status, 200, JSON.stringify(brandSetup.data));
assert.equal(brandSetup.data.saved, true);

// Set up Creator Alice
const creatorSetup = await request('/api/account', {
  method: 'POST',
  headers: { cookie: creatorCookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Alice Wonder',
    role: 'creator',
    terms: true
  })
});
assert.equal(creatorSetup.status, 200, JSON.stringify(creatorSetup.data));
assert.equal(creatorSetup.data.saved, true);
console.log('✓ Step 3: Account onboarding completed for Brand and Creator');

// STEP 4: Creator Media Upload to R2 (avatar, cover, portfolio sample)
// PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
const pngBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 10, 73, 68, 65, 84, 120, 156, 99, 0, 1, 0, 0, 5, 0, 1, 13, 10, 45, 180, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

async function uploadFile(cookie, filename, mime, bytes) {
  const formData = new FormData();
  formData.append('file', new File([bytes], filename, { type: mime }));
  const res = await fetch(`${baseUrl}/api/upload`, {
    method: 'POST',
    headers: {
      'Origin': origin,
      'cookie': cookie
    },
    body: formData
  });
  const data = await res.json();
  assert.equal(res.status, 200, JSON.stringify(data));
  return data.id;
}

const avatarId = await uploadFile(creatorCookie, 'avatar.png', 'image/png', pngBytes);
const coverId = await uploadFile(creatorCookie, 'cover.png', 'image/png', pngBytes);
console.log('✓ Step 4: Real media uploaded to R2 (avatar and cover assets)');

// STEP 5: Creator Profile Creation & Publication
const profileRes = await request('/api/profile', {
  method: 'POST',
  headers: { cookie: creatorCookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Alice Wonder',
    slug: 'alice-wonder',
    headline: 'Senior AI Filmmaker & Generative Visual Artist',
    bio: 'Crafting award-winning speculative sci-fi and commercial narrative films using Runway Gen-3 and Kling.',
    location: 'Los Angeles, CA',
    contactPreference: 'Platform messages',
    specializations: ['AI Filmmaking', 'Generative Art'],
    tools: ['Runway', 'Midjourney', 'Kling'],
    styles: ['Cinematic', 'Hyperrealism'],
    contentTypes: ['AI Video', 'AI Image'],
    aspectRatios: ['9:16', '16:9'],
    industries: ['Entertainment', 'Fashion'],
    platforms: ['Instagram', 'YouTube'],
    formats: 'MP4, ProRes',
    rate: 600,
    maxRate: 1500,
    currency: 'USD',
    turnaround: 7,
    availability: 'Available',
    commercial: true,
    revisions: 2,
    avatar: avatarId,
    cover: coverId,
    published: true
  })
});
assert.equal(profileRes.status, 200, JSON.stringify(profileRes.data));
assert.equal(profileRes.data.saved, true);
console.log('✓ Step 5: Creator profile published with commercial-use rights and USD rate');

// STEP 6: Creator Portfolio Project Creation
// MP4 magic bytes: 'ftyp' at offset 4
const mp4Bytes = new Uint8Array([0, 0, 0, 24, 102, 116, 121, 112, 105, 115, 111, 109, 0, 0, 0, 0, 105, 115, 111, 109, 109, 112, 52, 50]);
const videoMediaId = await uploadFile(creatorCookie, 'reel.mp4', 'video/mp4', mp4Bytes);

const portfolioRes = await request('/api/portfolio', {
  method: 'POST',
  headers: { cookie: creatorCookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Neon Odyssey: Act I',
    description: 'An AI-generated cinematic short film exploring futuristic cityscapes with synchronized soundscapes.',
    contentType: 'AI Video',
    tools: ['Runway', 'Midjourney'],
    skills: ['Prompt Engineering', 'Color Grading', 'Editing'],
    styles: ['Cinematic'],
    workflow: 'Iterative latent prompting with seed locking and color matching in DaVinci Resolve.',
    contribution: 'Full creative direction, prompt crafting, editing, and final composite.',
    aspectRatio: '9:16',
    duration: 60,
    commercialUse: 'Full commercial rights granted for digital streaming and advertising.',
    permission: true,
    cover: coverId,
    media: [videoMediaId],
    published: true
  })
});
assert.equal(portfolioRes.status, 200, JSON.stringify(portfolioRes.data));
assert.ok(portfolioRes.data.id);
console.log('✓ Step 6: Portfolio item published with video media in R2');

// STEP 7: Search and Discovery Verification
const discAll = await request('/api/discovery');
assert.equal(discAll.status, 200);
assert.ok(discAll.data.total >= 1);
const aliceFound = discAll.data.items.find(i => i.slug === 'alice-wonder');
assert.ok(aliceFound, 'Alice should be found in public discovery');

// Test currency-aware filter: USD 500-1000
const discUsd = await request('/api/discovery?currency=USD&min=500&max=1000');
assert.equal(discUsd.status, 200);
assert.ok(discUsd.data.items.some(i => i.slug === 'alice-wonder'));

// Test filter out with USD budget below Alice's rate (max 300)
const discLow = await request('/api/discovery?currency=USD&max=300');
assert.equal(discLow.status, 200);
assert.ok(!discLow.data.items.some(i => i.slug === 'alice-wonder'), 'Should not match Alice when budget is below 600 USD');
console.log('✓ Step 7: Discovery and currency-aware filtering verified');

// STEP 8: Brand Creates Campaign with Commercial Requirements
const futureDate = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
const campaignRes = await request('/api/campaign', {
  method: 'POST',
  headers: { cookie: brandCookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Cyberpunk Sneaker Launch',
    description: 'Futuristic teaser video for high-top sneaker release across digital channels.',
    industry: 'Fashion',
    contentType: 'AI Video',
    styles: ['Cinematic'],
    specializations: ['AI Filmmaking'],
    tools: ['Runway'],
    platform: 'Instagram',
    aspectRatio: '9:16',
    quantity: 1,
    budget: 800,
    currency: 'USD',
    deadline: futureDate,
    revisions: 2,
    commercialUse: 'Paid advertising',
    territory: 'Worldwide',
    usageDuration: '12 months',
    rights: 'Negotiated license',
    status: 'published'
  })
});
assert.equal(campaignRes.status, 200, JSON.stringify(campaignRes.data));
const campaignId = campaignRes.data.id;
console.log('✓ Step 8: Brand campaign brief published with commercial terms');

// STEP 9: Creator Compatibility Matching
const matchRes = await request(`/api/matches/${campaignId}`, {
  headers: { cookie: brandCookie }
});
assert.equal(matchRes.status, 200);
assert.ok(matchRes.data.matches.length >= 1);
const aliceMatch = matchRes.data.matches.find(m => m.slug === 'alice-wonder');
assert.ok(aliceMatch, 'Alice should be matched to campaign');
assert.ok(aliceMatch.match.score >= 70, `Score was ${aliceMatch.match.score}`);
console.log(`✓ Step 9: Creator matching engine scored Alice with ${aliceMatch.match.score}% compatibility`);

// STEP 10: Brand Invites Creator
const inviteRes = await request('/api/invitation', {
  method: 'POST',
  headers: { cookie: brandCookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    campaign: campaignId,
    creator: 'creator_alice',
    budget: 800,
    message: 'We loved your work on Neon Odyssey. Would love to collaborate on our upcoming sneaker launch!',
    start: futureDate,
    responseDeadline: futureDate,
    rights: 'Negotiated license',
    revisions: 2
  })
});
assert.equal(inviteRes.status, 200, JSON.stringify(inviteRes.data));
const inviteId = inviteRes.data.id;
console.log('✓ Step 10: Collaboration invitation sent to Creator Alice');

// STEP 11: Creator Alice Accepts Invitation
const acceptRes = await request(`/api/invitation/${inviteId}`, {
  method: 'POST',
  headers: { cookie: creatorCookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'accept' })
});
assert.equal(acceptRes.status, 200, JSON.stringify(acceptRes.data));
assert.equal(acceptRes.data.saved, true);

// Verify engagement is created
const creatorDash = await request('/api/dashboard', { headers: { cookie: creatorCookie } });
const engagement = creatorDash.data.engagements.find(e => e.campaign === campaignId);
assert.ok(engagement, 'Engagement must be created upon acceptance');
const engagementId = engagement.id;
console.log('✓ Step 11: Creator accepted invitation; Engagement project workspace active');

// STEP 12: Creator Starts Project and Submits Deliverable v1
await request(`/api/workspace/${engagementId}`, {
  method: 'POST',
  headers: { cookie: creatorCookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'start' })
});

const deliverable1Id = await uploadFile(creatorCookie, 'deliverable_v1.mp4', 'video/mp4', mp4Bytes);
const submit1 = await request(`/api/workspace/${engagementId}`, {
  method: 'POST',
  headers: { cookie: creatorCookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'submit',
    deliverable: 'Hero Sneaker Teaser v1',
    message: 'Here is the first rough cut of the teaser reel.',
    files: [deliverable1Id]
  })
});
assert.equal(submit1.status, 200);

let wsBrand = await request(`/api/workspace/${engagementId}`, { headers: { cookie: brandCookie } });
assert.equal(wsBrand.data.engagement.status, 'submitted');
console.log('✓ Step 12: Deliverable v1 submitted to workspace');

// STEP 13: Brand Requests Revisions
const reviseRes = await request(`/api/workspace/${engagementId}`, {
  method: 'POST',
  headers: { cookie: brandCookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'revise',
    message: 'Looking fantastic! Please boost the product lighting in the final 5 seconds.'
  })
});
assert.equal(reviseRes.status, 200);

let wsCreator = await request(`/api/workspace/${engagementId}`, { headers: { cookie: creatorCookie } });
assert.equal(wsCreator.data.engagement.status, 'changes requested');
assert.equal(wsCreator.data.engagement.revisions, 1);
console.log('✓ Step 13: Brand revision requested with feedback');

// STEP 14: Creator Resubmits Deliverable v2
const deliverable2Id = await uploadFile(creatorCookie, 'deliverable_v2.mp4', 'video/mp4', mp4Bytes);
const submit2 = await request(`/api/workspace/${engagementId}`, {
  method: 'POST',
  headers: { cookie: creatorCookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'submit',
    deliverable: 'Hero Sneaker Teaser v2',
    message: 'Enhanced neon highlights and shoe lighting as requested.',
    files: [deliverable2Id]
  })
});
assert.equal(submit2.status, 200);

wsBrand = await request(`/api/workspace/${engagementId}`, { headers: { cookie: brandCookie } });
assert.equal(wsBrand.data.engagement.status, 'resubmitted');
console.log('✓ Step 14: Deliverable v2 resubmitted');

// STEP 15: Brand Approves Deliverable
const approveRes = await request(`/api/workspace/${engagementId}`, {
  method: 'POST',
  headers: { cookie: brandCookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'approve' })
});
assert.equal(approveRes.status, 200);

wsCreator = await request(`/api/workspace/${engagementId}`, { headers: { cookie: creatorCookie } });
assert.equal(wsCreator.data.engagement.status, 'approved');
console.log('✓ Step 15: Brand approved submission');

// STEP 16: Creator Delivers and Brand Completes Project
const deliverRes = await request(`/api/workspace/${engagementId}`, {
  method: 'POST',
  headers: { cookie: creatorCookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'deliver' })
});
assert.equal(deliverRes.status, 200);

const completeRes = await request(`/api/workspace/${engagementId}`, {
  method: 'POST',
  headers: { cookie: brandCookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'complete' })
});
assert.equal(completeRes.status, 200);

const wsFinal = await request(`/api/workspace/${engagementId}`, { headers: { cookie: brandCookie } });
assert.equal(wsFinal.data.engagement.status, 'completed');
console.log('✓ Step 16: Project marked completed');

// STEP 17: Brand Leaves Review
const reviewRes = await request('/api/review', {
  method: 'POST',
  headers: { cookie: brandCookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    engagement: engagementId,
    rating: 5,
    comment: 'Exceptional AI craftsmanship! Delivered prompt revisions and commercial-grade output.'
  })
});
assert.equal(reviewRes.status, 200);

const publicReviews = await request('/api/reviews/alice-wonder');
assert.equal(publicReviews.status, 200);
assert.ok(publicReviews.data.total >= 1);
assert.equal(publicReviews.data.average, 5);
console.log('✓ Step 17: Post-project review published (5 stars) on public profile');

// STEP 18: Account Export Verification
const exportRes = await request('/api/account-export', { headers: { cookie: creatorCookie } });
assert.equal(exportRes.status, 200);
assert.equal(exportRes.data.account.name, 'Alice Wonder');
assert.ok(exportRes.data.portfolio.length >= 1);
assert.ok(exportRes.data.engagements.length >= 1);
console.log('✓ Step 18: Creator account data export validated');

console.log('--- ALL 18 END-TO-END WORKFLOW STEPS PASSED SUCCESSFULLY! ---');
