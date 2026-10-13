import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

function loadEnv() {
  const envPath = path.resolve('.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq !== -1) {
      env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
  }
  return env;
}

async function seedSupabase() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('Supabase URL or key missing in .env');
    process.exit(1);
  }

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  console.log('Seeding Supabase database at', url);

  const now = Date.now();

  // 1. Accounts
  const accounts = [
    {
      id: 'creator_alice',
      email: 'creator_alice@sites.test',
      name: 'Alice Wonder',
      role: 'creator',
      data: { name: 'Alice Wonder', role: 'creator', terms: true },
      created: now - 86400000,
      updated: now
    },
    {
      id: 'brand_acme',
      email: 'brand_acme@sites.test',
      name: 'Acme Studios',
      role: 'brand',
      data: {
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
      },
      created: now - 86400000,
      updated: now
    }
  ];

  for (const acc of accounts) {
    const { error } = await sb.from('accounts').upsert(acc);
    if (error) console.error('Account upsert error:', acc.id, error.message);
    else console.log('✓ Account upserted:', acc.id, `(${acc.name})`);
  }

  // 2. Profiles
  const profile = {
    id: 'creator_alice',
    slug: 'alice-wonder',
    published: 1,
    verification: 'verified',
    data: {
      name: 'Alice Wonder',
      slug: 'alice-wonder',
      headline: 'Senior AI Filmmaker & Generative Visual Artist',
      bio: 'Crafting award-winning speculative sci-fi and commercial narrative films using Runway Gen-3 and Kling. Specializing in high-fidelity world-building and character consistency.',
      location: 'Los Angeles, CA',
      contactPreference: 'Platform messages',
      website: 'https://alicewonder.ai',
      specializations: ['AI Filmmaking', 'Generative Art', '3D Scene Synthesis'],
      tools: ['Runway', 'Midjourney', 'Kling', 'ComfyUI', 'DaVinci Resolve'],
      styles: ['Cinematic', 'Hyperrealism', 'Sci-Fi', 'Atmospheric Noir'],
      contentTypes: ['AI Video', 'AI Image', '3D Assets'],
      aspectRatios: ['9:16', '16:9', '2.39:1'],
      industries: ['Entertainment', 'Fashion', 'Gaming', 'Advertising'],
      platforms: ['Instagram', 'YouTube', 'TikTok', 'Vimeo'],
      formats: ['MP4', 'ProRes', 'PNG', 'EXR'],
      workflow: 'Iterative latent space exploration combined with multi-pass video upscaling and spatial audio mastering.',
      experience: '5+ years in visual effects; 2+ years leading generative AI production teams for top global brands.',
      rate: 600,
      maxRate: 1500,
      currency: 'USD',
      turnaround: 7,
      availability: 'Available',
      commercial: true,
      revisions: 2,
      avatar: 'b916b347-7f00-474a-932a-745176a544f0',
      cover: '55ca6a14-4462-4f3e-af61-a15dc3f792a3',
      published: true
    },
    updated: now
  };

  const { error: profError } = await sb.from('profiles').upsert(profile);
  if (profError) console.error('Profile upsert error:', profError.message);
  else console.log('✓ Creator profile upserted: alice-wonder (Verified)');

  // 3. Portfolios
  const portfolios = [
    {
      id: '4c6e8224-d0f8-4228-af74-7572975bada4',
      owner: 'creator_alice',
      slug: 'neon-odyssey-act-i-4c6e8224',
      published: 1,
      data: {
        title: 'Neon Odyssey: Act I',
        description: 'Speculative architectural visualizer exploring neon-lit cybernetic megalopolises with cinematic generative camera paths.',
        contentType: 'AI Video',
        tools: ['Runway', 'Midjourney', 'ComfyUI'],
        skills: ['Generative Cinematography', 'Style LoRA Training'],
        styles: ['Cinematic', 'Sci-Fi', 'Cyberpunk'],
        workflow: 'Rendered using Runway Gen-3 with custom LoRAs trained on brutalist glass architectures.',
        contribution: 'Direction, prompt engineering, audio spatialization.',
        aspectRatio: '16:9',
        resolution: '4K',
        duration: 45,
        commercialUse: 'Commercial rights cleared for streaming and theatrical teaser broadcast.',
        permission: true,
        cover: '55ca6a14-4462-4f3e-af61-a15dc3f792a3',
        media: ['7c05ccb2-3c9f-4b5e-a370-e978ba4470e6'],
        published: true
      },
      updated: now - 3600000
    },
    {
      id: 'bb8a4289-0a79-46b3-b5ff-cc2851f41b8c',
      owner: 'creator_alice',
      slug: 'solar-chronicles-bb8a4289',
      published: 1,
      data: {
        title: 'Solar Chronicles',
        description: 'Photorealistic solar storm sequences constructed with multi-layered latent diffusion.',
        contentType: 'AI Video',
        tools: ['Kling', 'Midjourney'],
        skills: ['Particle Simulation', 'Diffusion Control'],
        styles: ['Hyperrealism', 'Documentary'],
        workflow: 'Multi-stage Kling video synthesis with deep chromatic color grading in DaVinci.',
        contribution: 'Creative Director, prompt architect.',
        aspectRatio: '16:9',
        resolution: '4K',
        duration: 60,
        commercialUse: 'Cleared for broadcast and museum installation.',
        permission: true,
        cover: '55ca6a14-4462-4f3e-af61-a15dc3f792a3',
        media: ['7c05ccb2-3c9f-4b5e-a370-e978ba4470e6'],
        published: true
      },
      updated: now - 7200000
    },
    {
      id: 'f00c38ed-f3a4-4e4a-bdd3-9ee2cb3bf31c',
      owner: 'creator_alice',
      slug: 'synthetic-haut-couture-f00c38ed',
      published: 1,
      data: {
        title: 'Synthetic Haute Couture',
        description: 'Generative fashion editorial featuring impossible biomechanical drapery and kinetic textiles.',
        contentType: 'AI Image',
        tools: ['Midjourney', 'Photoshop'],
        skills: ['Virtual Fashion', 'High Fashion Lighting'],
        styles: ['Editorial', 'Avant-Garde'],
        workflow: 'Raw latent prompt curation followed by 8K texture enhancement and fabric physics balancing.',
        contribution: 'Lead Visual Designer.',
        aspectRatio: '9:16',
        resolution: '8K',
        commercialUse: 'Approved for global digital campaigns and print lookbooks.',
        permission: true,
        cover: '55ca6a14-4462-4f3e-af61-a15dc3f792a3',
        media: ['b916b347-7f00-474a-932a-745176a544f0'],
        published: true
      },
      updated: now - 10800000
    }
  ];

  for (const p of portfolios) {
    const { error } = await sb.from('portfolios').upsert(p);
    if (error) console.error('Portfolio upsert error:', p.slug, error.message);
    else console.log('✓ Portfolio project upserted:', p.data.title);
  }

  // 4. Campaigns
  const campaigns = [
    {
      id: 'c101-ai-launch',
      owner: 'brand_acme',
      status: 'published',
      data: {
        title: 'Next-Gen Brand Launch Video',
        description: 'Seeking visionary AI filmmakers to produce an immersive 30s teaser celebrating synthetic creativity and boundary-pushing visual storytelling.',
        industry: 'Entertainment',
        contentType: 'AI Video',
        platform: 'YouTube',
        aspectRatio: '16:9',
        budget: 2500,
        currency: 'USD',
        deadline: '2026-11-30',
        revisions: 2,
        commercialUse: 'Worldwide Digital & Streaming',
        rights: 'Full buyout',
        territory: 'Worldwide',
        usageDuration: 'Perpetual',
        quantity: 1,
        status: 'published'
      },
      created: now - 86400000,
      updated: now
    },
    {
      id: 'c102-fashion-kinetic',
      owner: 'brand_acme',
      status: 'published',
      data: {
        title: 'Kinetic Fashion Showcase',
        description: 'Editorial luxury brand campaign showcasing generative fabrics in motion for Paris Fashion Week digital experience.',
        industry: 'Fashion',
        contentType: 'AI Video',
        platform: 'Instagram',
        aspectRatio: '9:16',
        budget: 1800,
        currency: 'USD',
        deadline: '2026-12-15',
        revisions: 3,
        commercialUse: 'Social Media & DOOH',
        rights: 'Exclusive digital rights 12 months',
        territory: 'Worldwide',
        usageDuration: '1 Year',
        quantity: 3,
        status: 'published'
      },
      created: now - 43200000,
      updated: now
    }
  ];

  for (const c of campaigns) {
    const { error } = await sb.from('campaigns').upsert(c);
    if (error) console.error('Campaign upsert error:', c.id, error.message);
    else console.log('✓ Brand campaign upserted:', c.data.title);
  }

  // 5. Files catalog
  const files = [
    {
      id: 'b916b347-7f00-474a-932a-745176a544f0',
      owner: 'creator_alice',
      name: 'avatar.png',
      mime: 'image/png',
      size: 67,
      created: now
    },
    {
      id: '55ca6a14-4462-4f3e-af61-a15dc3f792a3',
      owner: 'creator_alice',
      name: 'cover.png',
      mime: 'image/png',
      size: 67,
      created: now
    },
    {
      id: '7c05ccb2-3c9f-4b5e-a370-e978ba4470e6',
      owner: 'creator_alice',
      name: 'reel.mp4',
      mime: 'video/mp4',
      size: 24,
      created: now
    }
  ];

  for (const f of files) {
    const { error } = await sb.from('files').upsert(f);
    if (error) console.error('File upsert error:', f.id, error.message);
    else console.log('✓ File record upserted:', f.name, `(${f.id})`);
  }

  console.log('\n🎉 SUPABASE SEEDING COMPLETE! All demo creators, profiles, portfolios & campaigns are active in PostgreSQL!\n');
}

seedSupabase();
