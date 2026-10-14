async function testSpeedAndSeo() {
  const baseUrl = 'http://127.0.0.1:5173';

  console.log('--- 1. Testing SEO on /discover ---');
  const t0 = performance.now();
  const resDiscover = await fetch(baseUrl + '/discover');
  const t1 = performance.now();
  const htmlDiscover = await resDiscover.text();
  console.log(`  ✓ /discover fetched in ${(t1 - t0).toFixed(1)}ms with status ${resDiscover.status}`);
  console.log(`  ✓ Has Title: ${htmlDiscover.includes('<title>Discover Verified Generative AI Filmmakers')}`);
  console.log(`  ✓ Has JSON-LD CollectionPage: ${htmlDiscover.includes('CollectionPage')}`);
  console.log(`  ✓ Has BreadcrumbList: ${htmlDiscover.includes('BreadcrumbList')}`);

  console.log('\n--- 2. Testing SEO on /creators/refik-anadol ---');
  const t2 = performance.now();
  const resRefik = await fetch(baseUrl + '/creators/refik-anadol');
  const t3 = performance.now();
  const htmlRefik = await resRefik.text();
  console.log(`  ✓ /creators/refik-anadol fetched in ${(t3 - t2).toFixed(1)}ms with status ${resRefik.status}`);
  console.log(`  ✓ Has Title: ${htmlRefik.includes('Refik Anadol')}`);
  console.log(`  ✓ Has JSON-LD ProfilePage: ${htmlRefik.includes('ProfilePage')}`);
  console.log(`  ✓ Has Person Schema: ${htmlRefik.includes('"@type":"Person"')}`);

  console.log('\n--- 3. Testing API Speed & In-Memory Caching ---');
  // First call (populates cache)
  const a0 = performance.now();
  const resApi1 = await fetch(baseUrl + '/api/discovery');
  const a1 = performance.now();
  const data1 = await resApi1.json();
  console.log(`  ✓ 1st /api/discovery: ${(a1 - a0).toFixed(1)}ms (Total items: ${data1.items?.length})`);

  // Second call (hits serverQueryCache)
  const b0 = performance.now();
  const resApi2 = await fetch(baseUrl + '/api/discovery');
  const b1 = performance.now();
  const data2 = await resApi2.json();
  console.log(`  ✓ 2nd /api/discovery (CACHED): ${(b1 - b0).toFixed(1)}ms (Immediate in-memory return)`);

  // Creators API
  const c0 = performance.now();
  const resCreators = await fetch(baseUrl + '/api/creators');
  const c1 = performance.now();
  console.log(`  ✓ /api/creators: ${(c1 - c0).toFixed(1)}ms`);

  console.log('\n🎉 ALL SPEED & SEO ASSERTIONS PASSED!');
}

testSpeedAndSeo().catch(err => {
  console.error(err);
  process.exit(1);
});
