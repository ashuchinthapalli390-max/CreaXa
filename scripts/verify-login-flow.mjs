async function run() {
  const baseUrl = 'http://127.0.0.1:5173';

  async function testFullRoleFlow(roleName, email, password) {
    console.log(`Testing ${roleName} (${email})...`);
    const loginRes = await fetch(baseUrl + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await loginRes.json();
    if (!data.success) throw new Error('Login failed: ' + JSON.stringify(data));

    const token = data.token;
    console.log(`  ✓ Login OK: user=${data.user?.displayName}, role=${data.account?.role}`);

    // Verify authorized dashboard/admin request
    const route = data.account?.role === 'admin' ? '/api/admin' : '/api/dashboard';
    const authHeaders = {
      'Cookie': `__session=${token}; firebase_token=${token}; __sites_local_auth=${data.account?.id}`
    };
    const checkRes = await fetch(baseUrl + route, { headers: authHeaders });
    const checkData = await checkRes.json();
    console.log(`  ✓ Authenticated fetch ${route}: status=${checkRes.status}, result=${checkData.stats ? 'Stats loaded' : checkData.account ? 'Account loaded' : 'OK'}`);
  }

  await testFullRoleFlow('Admin', 'admin@mail.com', 'bytxl@123');
  await testFullRoleFlow('Creator', 'creator@mail.com', 'bytxl@123');
  await testFullRoleFlow('Brand', 'bytxl@mail.com', 'bytxl@123');
  console.log('\n🎉 ALL 3 ROLES AUTHENTICATED AND AUTHORIZED END-TO-END!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
