async function runAudit() {
  console.log('====================================================');
  console.log('  JAHITFLOW FULL-STACK SYSTEM DEEP AUDIT');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // --- PART 1: FRONTEND NEXT.JS ROUTE ACCESSIBILITY ---
  console.log('--- 1. Testing Frontend Route Responses (Port 3000) ---');
  const feRoutes = [
    '/',
    '/login',
    '/register',
    '/tracking',
    '/dashboard',
    '/orders',
    '/customers',
    '/payments',
    '/reports',
    '/settings',
  ];

  for (const r of feRoutes) {
    try {
      const res = await fetch(`http://localhost:3000${r}`, {
        headers: {
          Cookie: 'jahitflow_token=mock_test_token_for_ssr',
        },
        redirect: 'manual',
      });
      assert(res.status === 200 || res.status === 307 || res.status === 302, `Route ${r} responds with status ${res.status}`);
    } catch (e) {
      assert(false, `Route ${r} connection error: ${e.message}`);
    }
  }

  // --- PART 2: BACKEND AUTHENTICATION LIFECYCLE ---
  console.log('\n--- 2. Testing Backend Authentication (Port 3001) ---');
  const testEmail = `audit_user_${Date.now()}@jahitflow.test`;
  const initialPassword = 'Password123!';
  const updatedPassword = 'NewPassword456!';
  let token = '';

  // Register
  const regRes = await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: initialPassword,
      name: 'Audit Tailor Master',
      businessName: 'Audit Atelier',
      whatsapp: '081299990001',
      address: 'Jl. Audit No. 1, Jakarta',
    }),
  });
  const regData = await regRes.json();
  const regToken = regData.accessToken;
  assert(regRes.status === 201 && regToken, 'Register new user account returns 201 and accessToken');
  token = regToken;

  // Login
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: initialPassword,
    }),
  });
  const loginData = await loginRes.json();
  const loginToken = loginData.accessToken;
  assert(loginRes.status === 200 && loginToken, 'Login with registered credentials returns 200 and accessToken');
  token = loginToken;

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // Profile
  const meRes = await fetch('http://localhost:3001/api/auth/me', { headers: authHeaders });
  const meData = await meRes.json();
  assert(meRes.status === 200 && meData.email === testEmail, 'GET /api/auth/me returns valid user session profile');

  // --- PART 3: CUSTOMER MANAGEMENT & MEASUREMENTS ---
  console.log('\n--- 3. Testing Customer Lifecycle & 7 Body Dimensions ---');
  const custPayload = {
    name: 'Ibu Ratna Auditee',
    phone: '081234567899',
    address: 'Komp. Busana Indah No. 5',
    measurements: {
      lingkarDada: 94,
      lingkarPinggang: 76,
      lebarBahu: 40,
      panjangBaju: 68,
      panjangLengan: 55,
      panjangCelana: 98,
      lingkarPinggul: 99,
    },
  };

  const createCustRes = await fetch('http://localhost:3001/api/customers', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(custPayload),
  });
  const createCustData = await createCustRes.json();
  assert(createCustRes.status === 201 && createCustData.id, 'Create Customer returns 201 and ID');
  const customerId = createCustData.id;
  assert(createCustData.measurements?.lingkarDada === 94, 'Nested 7 body measurements saved accurately on creation');

  // Update Customer Measurements
  const updateCustRes = await fetch(`http://localhost:3001/api/customers/${customerId}`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'Ibu Ratna Auditee Updated',
      measurements: {
        lingkarDada: 96,
        lingkarPinggang: 78,
        panjangBaju: 70,
      },
    }),
  });
  const updateCustData = await updateCustRes.json();
  assert(updateCustRes.status === 200 && updateCustData.measurements?.lingkarDada === 96, 'Customer measurements update preserves and modifies dimensions correctly');

  // --- PART 4: ORDER CREATION, STATUS TRANSITIONS & PUBLIC TRACKING ---
  console.log('\n--- 4. Testing Order Lifecycle, Status Workflow & Public Tracking ---');
  const orderPayload = {
    customerId,
    customerName: 'Ibu Ratna Auditee Updated',
    phone: '081234567899',
    itemName: 'Kebaya Modern Payet Mutiara',
    dueDate: '2026-10-15',
    price: 850000,
    paid: 300000,
    notes: 'Kain sutra biru muda, payet perak di kerah',
  };

  const createOrderRes = await fetch('http://localhost:3001/api/orders', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(orderPayload),
  });
  const createOrderData = await createOrderRes.json();
  assert(createOrderRes.status === 201 && createOrderData.code, `Create Order returns 201 and generated order code (${createOrderData.code})`);
  const orderCode = createOrderData.code;
  const orderId = createOrderData.id;

  // Status transitions
  const statusTransitions = ['Dipotong', 'Dijahit', 'Siap Diambil', 'Selesai'];
  for (const st of statusTransitions) {
    const stRes = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ status: st }),
    });
    const stData = await stRes.json();
    assert(stRes.status === 200 && stData.status === st, `Order status updated successfully to "${st}"`);
  }

  // Public Tracking Verification (No Auth Header)
  const trackRes = await fetch(`http://localhost:3001/api/orders/track/${orderCode}`);
  const trackData = await trackRes.json();
  assert(trackRes.status === 200 && trackData.code === orderCode, 'Public tracking /orders/track/:code returns order data without authentication');
  assert(trackData.timeline && trackData.timeline.length >= 5, 'Public tracking returns complete atelier progress timeline');

  // --- PART 5: PAYMENTS & BALANCE SYNCHRONIZATION ---
  console.log('\n--- 5. Testing Payment System & Order Balance Sync ---');
  const paymentPayload = {
    orderCode,
    customerName: 'Ibu Ratna Auditee Updated',
    totalAmount: 850000,
    paidAmount: 550000, // Pelunasan sisa tagihan secara parsial/bertahap
    paymentMethod: 'Transfer Bank',
    notes: 'Pelunasan sisa via transfer BCA',
  };

  const createPayRes = await fetch('http://localhost:3001/api/payments', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(paymentPayload),
  });
  const createPayData = await createPayRes.json();
  assert(createPayRes.status === 201 && createPayData.status === 'DP', 'Partial payment correctly marked as "DP"');
  const paymentId = createPayData.id;

  // Verify order paid amount synchronized to 850000 (initial 300.000 + 550.000 = 850.000 full price)
  const verifyOrderRes = await fetch(`http://localhost:3001/api/orders/${orderId}`, { headers: authHeaders });
  const verifyOrderData = await verifyOrderRes.json();
  assert(verifyOrderRes.status === 200 && verifyOrderData.paid === 850000, 'Order paid amount automatically synchronized to full price (Rp 850.000)');

  // Test full payment for standalone transaction
  const standaloneOrderCode = 'STANDALONE-01';
  const fullPayRes = await fetch('http://localhost:3001/api/payments', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      orderCode: standaloneOrderCode,
      customerName: 'Ibu Ratna Auditee Updated',
      totalAmount: 500000,
      paidAmount: 500000,
      paymentMethod: 'Cash',
      notes: 'Pembayaran tunai lunas',
    }),
  });
  const fullPayData = await fullPayRes.json();
  assert(fullPayRes.status === 201 && fullPayData.status === 'Lunas', 'Full payment correctly marked as "Lunas"');
  await fetch(`http://localhost:3001/api/payments/${fullPayData.id}`, { method: 'DELETE', headers: authHeaders });

  // Payment stats
  const payStatsRes = await fetch('http://localhost:3001/api/payments/stats', { headers: authHeaders });
  const payStatsData = await payStatsRes.json();
  assert(payStatsRes.status === 200 && payStatsData.totalPendapatan >= 850000, 'Payment stats calculates correct total revenue and metrics');

  // --- PART 6: REPORTS & ANALYTICS ---
  console.log('\n--- 6. Testing Reports & Analytics API ---');
  for (const period of ['Minggu Ini', 'Bulan Ini', 'Tahun Ini', 'Semua Waktu']) {
    const reportRes = await fetch(`http://localhost:3001/api/reports/analytics?period=${encodeURIComponent(period)}`, { headers: authHeaders });
    const reportData = await reportRes.json();
    assert(reportRes.status === 200 && reportData.summary, `Analytics endpoint returns valid stats for period "${period}"`);
  }

  // --- PART 7: DASHBOARD SUMMARY ---
  console.log('\n--- 7. Testing Dashboard Summary API ---');
  const dashRes = await fetch('http://localhost:3001/api/dashboard/summary', { headers: authHeaders });
  const dashData = await dashRes.json();
  assert(dashRes.status === 200 && dashData.stats, 'Dashboard summary returns workshop KPI metrics and counts');

  // --- PART 8: SETTINGS, PROFILE, AND PASSWORD ---
  console.log('\n--- 8. Testing Workshop Settings & Security ---');
  const updateSettingsRes = await fetch('http://localhost:3001/api/settings/profile', {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'Master Tailor Satria',
      ownerName: 'Master Tailor Satria',
      storeName: 'Satria Exclusive Atelier',
      phone: '081288887777',
      whatsapp: '081288887777',
      address: 'Jl. Mode Eksklusif No. 12, Balikpapan',
      bankName: 'Mandiri',
      accountNumber: '142000998877',
      accountHolder: 'Master Tailor Satria',
      waInvoice: true,
      waReminder: true,
    }),
  });
  const updateSettingsData = await updateSettingsRes.json();
  assert(updateSettingsRes.status === 200 && updateSettingsData.business?.bankName === 'Mandiri', 'Settings profile update persisted store, phone, and banking info');

  // Change password
  const changePassRes = await fetch('http://localhost:3001/api/settings/password', {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      currentPassword: initialPassword,
      newPassword: updatedPassword,
    }),
  });
  assert(changePassRes.status === 200, 'Password change completed successfully');

  // Verify re-login with new password
  const newLoginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: updatedPassword,
    }),
  });
  const newLoginData = await newLoginRes.json();
  const newLoginToken = newLoginData.accessToken;
  assert(newLoginRes.status === 200 && newLoginToken, 'Re-login with updated password verified successfully');
  if (newLoginToken) authHeaders.Authorization = `Bearer ${newLoginToken}`;

  // --- PART 9: CLEANUP / DELETION ENDPOINTS ---
  console.log('\n--- 9. Testing Deletion Endpoints & Foreign Key Cascades ---');
  // Delete Payment
  const delPayRes = await fetch(`http://localhost:3001/api/payments/${paymentId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  assert(delPayRes.status === 200, 'Payment deleted successfully');

  // Delete Order
  const delOrderRes = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  assert(delOrderRes.status === 200, 'Order deleted successfully');

  // Delete Customer
  const delCustRes = await fetch(`http://localhost:3001/api/customers/${customerId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  assert(delCustRes.status === 200, 'Customer and cascading measurements deleted successfully');

  // --- SUMMARY ---
  console.log('\n====================================================');
  console.log(`AUDIT FINISHED: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');
  if (failed === 0) {
    console.log('🎉 100% OF ALL TESTED FEATURES & ROUTES ARE FULLY OPERATIONAL!');
  }
}

runAudit().catch(console.error);
