import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

const env = Object.fromEntries(
  fs.readFileSync('.env', 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const now = Date.now();

console.log('================================================================');
console.log('PROVISIONING THE 3 SPECIFIED REAL ACCOUNTS IN SUPABASE');
console.log('================================================================');

// 1. Admin Account: admin@mail.com
const adminUid = 'OW6liwdp4ITceIP87vcmjozyo9U2';
console.log('\n1. Upserting Admin Account:', adminUid, '(admin@mail.com)');
const { error: errAdmin } = await sb.from('accounts').upsert({
  id: adminUid,
  email: 'admin@mail.com',
  name: 'CreaXa Administrator',
  role: 'admin',
  data: {
    name: 'CreaXa Administrator',
    role: 'admin',
    organization: 'CreaXa Platform Governance',
    terms: true,
    contactEmail: 'admin@mail.com',
    contactEmailVerified: true,
    contactEmailVerifiedAt: now
  },
  created: now,
  updated: now
});
if (errAdmin) console.error('  ❌ Admin account error:', errAdmin.message);
else console.log('  ✅ Admin account upserted successfully.');

// 2. Creator Account: creator@mail.com
const creatorUid = '7jp10RLjWMSYPDLT86v3pMgdCcK2';
console.log('\n2. Upserting Creator Account:', creatorUid, '(creator@mail.com)');
const { error: errCreator } = await sb.from('accounts').upsert({
  id: creatorUid,
  email: 'creator@mail.com',
  name: 'CreaXa Creator',
  role: 'creator',
  data: {
    name: 'CreaXa Creator',
    role: 'creator',
    terms: true,
    contactEmail: 'creator@mail.com',
    contactEmailVerified: false
  },
  created: now,
  updated: now
});
if (errCreator) console.error('  ❌ Creator account error:', errCreator.message);
else console.log('  ✅ Creator account upserted successfully.');

// 2b. Creator Profile
const creatorProfileData = {
  name: 'CreaXa Creator',
  slug: 'creaxa-creator',
  headline: 'AI Video & Generative Visual Specialist',
  bio: 'Directing high-concept AI video, neural animations, and speculative visual narratives using Runway Gen-3, Midjourney v6, and ComfyUI. Proven workflow in commercial advertising and cinematic storytelling.',
  tools: ['Runway', 'Midjourney', 'ComfyUI', 'Kling', 'DaVinci Resolve', 'Sora'],
  specializations: ['AI Filmmaking', 'AI Animation', 'Motion Graphics', 'Generative Images'],
  styles: ['Cinematic', 'Luxury', 'Futuristic', 'Surreal'],
  contentTypes: ['AI Video', 'AI Animation', 'AI Image'],
  aspectRatios: ['16:9', '9:16', '1:1', '4:5'],
  industries: ['Entertainment', 'Fashion', 'Technology', 'Gaming'],
  platforms: ['YouTube', 'Instagram', 'Broadcast'],
  rate: 45000,
  maxRate: 95000,
  currency: 'INR',
  turnaround: 7,
  revisions: 2,
  availability: 'Available',
  commercial: true,
  location: 'Mumbai, India',
  published: true
};

const { error: errProfile } = await sb.from('profiles').upsert({
  id: creatorUid,
  slug: 'creaxa-creator',
  published: 1,
  verification: 'self-declared',
  data: creatorProfileData,
  updated: now
});
if (errProfile) console.error('  ❌ Creator profile error:', errProfile.message);
else console.log('  ✅ Creator profile upserted successfully.');

// 2c. Creator Portfolio Work
const portfolioId = 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d';
const { error: errPortfolio } = await sb.from('portfolios').upsert({
  id: portfolioId,
  owner: creatorUid,
  slug: 'neural-odyssey-cinema',
  published: 1,
  data: {
    title: 'Neural Odyssey: Cybernetic Frontiers',
    description: 'High-concept speculative trailer featuring synthetic biology, robotic architectures, and neural landscapes. Built with multi-pass diffusion and custom latent upscaling.',
    contentType: 'AI Video',
    tools: ['Runway Gen-3', 'Midjourney v6', 'ComfyUI', 'DaVinci Resolve'],
    styles: ['Cinematic', 'Futuristic'],
    aspectRatio: '16:9',
    commercial: true,
    workflow: 'Iterative prompt exploration in Midjourney v6 for keyframe coherence, camera motion conditioning in Runway Gen-3 at 4K, and color mastering in DaVinci Resolve Studio.',
    published: true
  },
  updated: now
});
if (errPortfolio) console.error('  ❌ Creator portfolio error:', errPortfolio.message);
else console.log('  ✅ Creator portfolio upserted successfully.');

// 3. Brand Account: bytxl@mail.com
const brandUid = 'FElnevGuMnbYvsjkVpG9JDHMHM72';
console.log('\n3. Upserting Brand Account:', brandUid, '(bytxl@mail.com)');
const { error: errBrand } = await sb.from('accounts').upsert({
  id: brandUid,
  email: 'bytxl@mail.com',
  name: 'CreaXa Studio',
  role: 'brand',
  data: {
    name: 'CreaXa Studio',
    role: 'brand',
    organization: 'CreaXa Studio',
    industry: 'Fashion & Luxury',
    website: 'https://creaxa.com',
    goals: 'Commission award-winning generative fashion films and cinematic product teasers',
    terms: true,
    contactEmail: 'bytxl@mail.com',
    contactEmailVerified: false
  },
  created: now,
  updated: now
});
if (errBrand) console.error('  ❌ Brand account error:', errBrand.message);
else console.log('  ✅ Brand account upserted successfully.');

// 3b. Brand Campaign
const campaignId = 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e';
const { error: errCampaign } = await sb.from('campaigns').upsert({
  id: campaignId,
  owner: brandUid,
  status: 'published',
  data: {
    title: 'Cinematic Fashion Launch',
    description: 'High-concept luxury AI fashion campaign showcasing speculative haute couture in zero-gravity architectural environments. Targeting social launch and digital billboards.',
    creativeObjective: 'Establish an avant-garde visual identity blending hyper-realistic textile simulation with surreal generative motion.',
    contentType: 'AI Video',
    styles: ['Luxury', 'Cinematic', 'Editorial'],
    specializations: ['AI Fashion', 'AI Filmmaking', 'Motion Graphics'],
    platform: 'Instagram',
    aspectRatio: '9:16',
    budget: 85000,
    currency: 'INR',
    deadline: '2026-11-15',
    quantity: 3,
    revisions: 2,
    commercialUse: 'Paid digital advertising and worldwide social rights',
    territory: 'Worldwide',
    usageDuration: '12 Months',
    status: 'published',
    industry: 'Fashion'
  },
  created: now,
  updated: now
});
if (errCampaign) console.error('  ❌ Brand campaign error:', errCampaign.message);
else console.log('  ✅ Brand campaign upserted successfully.');

// 4. Invitation between Brand and Creator
const invitationId = 'c3d4e5f6-a1b2-4c3d-8e4f-5a6b7c8d9e0f';
const { error: errInvitation } = await sb.from('invitations').upsert({
  id: invitationId,
  campaign: campaignId,
  brand: brandUid,
  creator: creatorUid,
  status: 'pending',
  data: {
    message: 'We would love for you to direct our upcoming Cinematic Fashion Launch campaign. Your expertise with Runway and luxury aesthetics is a perfect match.',
    proposedBudget: 85000,
    currency: 'INR',
    timeline: '3 weeks',
    revisions: 2
  },
  created: now
});
if (errInvitation) console.error('  ❌ Invitation error:', errInvitation.message);
else console.log('  ✅ Brand-to-Creator Invitation upserted successfully.');

console.log('\n================================================================');
console.log('PROVISIONING COMPLETE');
console.log('================================================================');
