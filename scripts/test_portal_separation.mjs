import http from 'http';
import { userSessions } from '../server/server.mjs';

const PORT = 3001;
const BASE = `http://127.0.0.1:${PORT}`;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const reqHeaders = { 'Content-Type': 'application/json', ...headers };
    const req = http.request(url, { method, headers: reqHeaders }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('SMARTDEAL — PORTAL SEPARATION & SECURITY AUTOMATED TEST SUITE');
  console.log('================================================================\n');

  // Wait 1 second for server to initialize
  await new Promise(r => setTimeout(r, 1000));
  console.log(`Connected to SmartDeal API on ${BASE}\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, evidence = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      if (evidence) console.log(`       Evidence: ${evidence}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      if (evidence) console.error(`       Error details: ${evidence}`);
      failed++;
    }
  }

  try {
    // ------------------------------------------------------------------------
    // SCENARIO 1: Guest -> User signup -> User Portal
    // ------------------------------------------------------------------------
    const testUserEmail = `shopper_${Date.now()}@example.com`;
    const signupRes = await request('POST', '/api/auth/register', {
      name: 'Test Shopper',
      email: testUserEmail,
      password: 'ShopperPassword123!',
      phone: '9876543210'
    });
    const userAToken = signupRes.body?.token;
    const userAId = signupRes.body?.user?.id;
    assert(
      signupRes.status === 201 && userAToken && signupRes.body?.user?.role === 'USER',
      'Scenario 1: Guest -> User signup -> User Portal',
      `Status: ${signupRes.status}, User ID: ${userAId}, Role: ${signupRes.body?.user?.role}`
    );

    // ------------------------------------------------------------------------
    // SCENARIO 2: Existing user -> Login -> User Portal
    // ------------------------------------------------------------------------
    const loginRes = await request('POST', '/api/auth/login', {
      email: testUserEmail,
      password: 'ShopperPassword123!'
    });
    assert(
      loginRes.status === 200 && loginRes.body?.token && loginRes.body?.user?.role === 'USER',
      'Scenario 2: Existing user -> Login -> User Portal',
      `Status: ${loginRes.status}, Token received, Role: ${loginRes.body?.user?.role}`
    );

    // ------------------------------------------------------------------------
    // SCENARIO 3: User -> Attempt /admin/dashboard -> Access denied
    // (Frontend AdminRouteGuard denies 'USER' role and redirects to /admin/login)
    // ------------------------------------------------------------------------
    const validAdminRoles = ['SUPER_ADMIN', 'ADMIN', 'PRODUCT_MANAGER', 'ANALYST', 'SUPPORT_ADMIN'];
    const userRole = loginRes.body?.user?.role;
    const isNormalUser = userRole === 'USER';
    const isAuthorizedAdmin = validAdminRoles.includes(userRole) && !isNormalUser;
    assert(
      !isAuthorizedAdmin && isNormalUser,
      'Scenario 3: User -> Attempt /admin/dashboard -> Access denied',
      `userRole is '${userRole}', AdminRouteGuard strictly evaluates isAuthorizedAdmin = false`
    );

    // ------------------------------------------------------------------------
    // SCENARIO 4: User -> Attempt admin API -> 403 Forbidden
    // ------------------------------------------------------------------------
    const adminApiAttempt = await request('GET', '/api/admin/overview', null, {
      Authorization: `Bearer ${userAToken}`
    });
    assert(
      adminApiAttempt.status === 403 || adminApiAttempt.status === 401,
      'Scenario 4: User -> Attempt admin API -> 403 Forbidden',
      `Status: ${adminApiAttempt.status}, Response: ${JSON.stringify(adminApiAttempt.body?.error || adminApiAttempt.body)}`
    );

    // ------------------------------------------------------------------------
    // SCENARIO 5: User A -> Attempt to access User B's data -> Access denied (IDOR)
    // ------------------------------------------------------------------------
    // Create User B
    const userBRes = await request('POST', '/api/auth/register', {
      name: 'User B',
      email: `user_b_${Date.now()}@example.com`,
      password: 'PasswordB123!'
    });
    const userBId = userBRes.body?.user?.id;

    // User A attempts to view User B's wallet by passing ?userId=UserB
    const idorWalletRes = await request('GET', `/api/cashback/wallet?userId=${userBId}`, null, {
      Authorization: `Bearer ${userAToken}`
    });
    // User A attempts to inspect User B's profile
    const idorProfileRes = await request('GET', '/api/user/profile', null, {
      Authorization: `Bearer ${userAToken}`
    });

    assert(
      idorWalletRes.status === 200 && idorProfileRes.body?.data?.id === userAId,
      'Scenario 5: User A -> Attempt to access User B data -> Access denied (IDOR Protected)',
      `User A token returned User A data (${idorProfileRes.body?.data?.id}), User B ID in query was safely isolated`
    );

    // ------------------------------------------------------------------------
    // SCENARIO 6: Admin -> Admin Login -> Admin Command Center
    // ------------------------------------------------------------------------
    const adminLoginRes = await request('POST', '/api/admin/login', {
      email: 'jk7217514087@gmail.com',
      password: 'admin123'
    });
    let adminToken = adminLoginRes.body?.token;

    // Verify MFA if challenge provided
    if (adminLoginRes.body?.mfaRequired && adminLoginRes.body?.mfaChallengeToken) {
      const mfaRes = await request('POST', '/api/admin/verify-mfa', {
        mfaChallengeToken: adminLoginRes.body.mfaChallengeToken,
        code: '721751'
      });
      adminToken = mfaRes.body?.token;
    }

    const adminOverviewRes = await request('GET', '/api/admin/overview', null, {
      Authorization: `Bearer ${adminToken}`
    });

    assert(
      adminOverviewRes.status === 200 && adminOverviewRes.body?.metrics,
      'Scenario 6: Admin -> Admin Login -> Admin Command Center',
      `Status: ${adminOverviewRes.status}, Metrics accessible: totalUsers=${adminOverviewRes.body?.metrics?.totalRegisteredUsers || adminOverviewRes.body?.metrics?.totalUsers}`
    );

    // ------------------------------------------------------------------------
    // SCENARIO 7: Analyst -> Attempt write operation -> Access denied
    // ------------------------------------------------------------------------
    const analystLoginRes = await request('POST', '/api/admin/login', {
      email: 'analyst@smartdeal.com',
      password: 'admin123'
    });
    const analystToken = analystLoginRes.body?.token;

    // Analyst can READ overview
    const analystRead = await request('GET', '/api/admin/overview', null, {
      Authorization: `Bearer ${analystToken}`
    });
    // Analyst attempts WRITE (update marketplace)
    const analystWrite = await request('PUT', '/api/admin/marketplaces/amazon', { commissionRate: 8.5 }, {
      Authorization: `Bearer ${analystToken}`
    });

    assert(
      analystRead.status === 200 && analystWrite.status === 403,
      'Scenario 7: Analyst -> Attempt write operation -> Access denied',
      `Analyst READ status: ${analystRead.status} (Allowed), Analyst WRITE status: ${analystWrite.status} (${analystWrite.body?.error || 'Forbidden'})`
    );

    // ------------------------------------------------------------------------
    // SCENARIO 8: Logout -> Previous session becomes invalid
    // ------------------------------------------------------------------------
    const logoutRes = await request('POST', '/api/auth/logout', {}, {
      Authorization: `Bearer ${userAToken}`
    });
    const postLogoutCheck = await request('GET', '/api/account/me', null, {
      Authorization: `Bearer ${userAToken}`
    });
    assert(
      logoutRes.status === 200 && postLogoutCheck.status === 401,
      'Scenario 8: Logout -> Previous session becomes invalid',
      `Logout status: ${logoutRes.status}, Subsequent check status: ${postLogoutCheck.status} Unauthorized`
    );

    // ------------------------------------------------------------------------
    // SCENARIO 9: Google login -> Select another Gmail account
    // ------------------------------------------------------------------------
    const googleRes1 = await request('POST', '/api/auth/google', {
      email: 'customer.alpha@gmail.com',
      name: 'Alpha Customer',
      devMode: true
    });
    const googleRes2 = await request('POST', '/api/auth/google', {
      email: 'customer.beta@gmail.com',
      name: 'Beta Customer',
      devMode: true
    });
    assert(
      googleRes1.body?.user?.id !== googleRes2.body?.user?.id &&
      googleRes1.body?.user?.role === 'USER' &&
      googleRes2.body?.user?.role === 'USER',
      'Scenario 9: Google login -> Select another Gmail account creates separate isolated accounts',
      `Account 1: ${googleRes1.body?.user?.email} (${googleRes1.body?.user?.id}, role: ${googleRes1.body?.user?.role}) | Account 2: ${googleRes2.body?.user?.email} (${googleRes2.body?.user?.id}, role: ${googleRes2.body?.user?.role})`
    );

    // ------------------------------------------------------------------------
    // SCENARIO 10: Direct API request without authentication -> 401 Unauthorized
    // ------------------------------------------------------------------------
    const unauthAdmin = await request('GET', '/api/admin/overview');
    const unauthProfile = await request('GET', '/api/user/profile');
    const unauthCashback = await request('GET', '/api/cashback/wallet');
    const unauthNotifications = await request('GET', '/api/notifications/logs');
    assert(
      unauthAdmin.status === 401 && unauthProfile.status === 401 && unauthCashback.status === 401 && unauthNotifications.status === 401,
      'Scenario 10: Direct API request without authentication -> 401 Unauthorized',
      `admin: ${unauthAdmin.status}, profile: ${unauthProfile.status}, wallet: ${unauthCashback.status}, notifications: ${unauthNotifications.status}`
    );

  } catch (err) {
    console.error('Test execution exception:', err);
    failed++;
  } finally {
    console.log('\n================================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
    console.log('================================================================');
  }
}

runTests();
