import { verifySupabase } from './verify-supabase.mjs';

async function checkDatabase() {
  console.log('================================================================');
  console.log('1. REMOTE SUPABASE DATABASE STATUS');
  console.log('================================================================');
  const remoteOk = await verifySupabase();

  console.log('\n================================================================');
  console.log('2. APPLICATION RUNTIME DATABASE STATUS (via Active Server)');
  console.log('================================================================');
  try {
    const meRes = await fetch('http://127.0.0.1:5173/api/me', {
      headers: { cookie: '__sites_local_auth=creator_alice' }
    });
    const me = await meRes.json();
    console.log('User Account Check:');
    console.log('  Status:       ', meRes.status);
    console.log('  Account ID:   ', me.account?.id || 'none');
    console.log('  Name:         ', me.account?.name || 'none');
    console.log('  Role:         ', me.account?.role || 'none');
    console.log('  AI Available: ', me.aiAvailable);

    const discRes = await fetch('http://127.0.0.1:5173/api/discovery');
    const disc = await discRes.json();
    console.log('\nDiscovery / Creator Directory Check:');
    console.log('  Status:       ', discRes.status);
    console.log('  Count:        ', disc.creators?.length || 0);
    if (disc.creators?.length) {
      console.log('  Sample:       ', disc.creators[0].data?.name, '—', disc.creators[0].data?.headline);
    }

    const brandDashRes = await fetch('http://127.0.0.1:5173/api/dashboard', {
      headers: { cookie: '__sites_local_auth=brand_acme' }
    });
    const brandDash = await brandDashRes.json();
    console.log('\nBrand Dashboard Check:');
    console.log('  Status:       ', brandDashRes.status);
    console.log('  Campaigns:    ', brandDash.campaigns?.length || 0);
    console.log('  Invitations:  ', brandDash.invitations?.length || 0);
    console.log('  Engagements:  ', brandDash.engagements?.length || 0);
    console.log('  Notifications:', brandDash.notifications?.length || 0);

    const creatorDashRes = await fetch('http://127.0.0.1:5173/api/dashboard', {
      headers: { cookie: '__sites_local_auth=creator_alice' }
    });
    const creatorDash = await creatorDashRes.json();
    console.log('\nCreator Dashboard Check:');
    console.log('  Status:       ', creatorDashRes.status);
    console.log('  Portfolios:   ', creatorDash.portfolios?.length || 0);
    console.log('  Engagements:  ', creatorDash.engagements?.length || 0);
    console.log('  Notifications:', creatorDash.notifications?.length || 0);

    console.log('\n================================================================');
    console.log('DATABASE CHECK COMPLETE');
    console.log('================================================================');
  } catch (err) {
    console.error('Failed to query local dev server:', err.message);
  }
}

checkDatabase();
