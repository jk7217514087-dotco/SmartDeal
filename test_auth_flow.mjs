// SMARTDEAL COMPREHENSIVE IN-PROCESS AUTHENTICATION & SECURITY TEST SUITE
import assert from 'node:assert';
import { Readable } from 'node:stream';
import { server } from './server/server.mjs';

function simulateRequest(path, { method = 'GET', body = null, headers = {} } = {}) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : '';
    
    // Create mock Readable stream as req
    const req = Readable.from(bodyStr ? [Buffer.from(bodyStr)] : []);
    req.url = path;
    req.method = method;
    req.headers = {
      host: 'localhost:3001',
      'content-type': 'application/json',
      ...headers
    };

    // Create mock res
    let statusCode = 200;
    const responseHeaders = {};
    let responseBody = '';

    const res = {
      headersSent: false,
      setHeader(name, val) {
        responseHeaders[name.toLowerCase()] = val;
      },
      writeHead(code, hdrs = {}) {
        statusCode = code;
        Object.entries(hdrs).forEach(([k, v]) => {
          responseHeaders[k.toLowerCase()] = v;
        });
        this.headersSent = true;
      },
      end(chunk) {
        if (chunk) responseBody += chunk.toString();
        let parsed;
        try {
          parsed = JSON.parse(responseBody);
        } catch {
          parsed = responseBody;
        }
        resolve({ status: statusCode, headers: responseHeaders, body: parsed });
      }
    };

    // Dispatch to server request handler
    server.emit('request', req, res);
  });
}

async function runAuthTests() {
  console.log('\n================================================================');
  console.log('🔒 RUNNING SMARTDEAL COMPLETE AUTHENTICATION AUDIT TESTS');
  console.log('================================================================\n');

  // 1. Normal User Login
  console.log('1. Testing Valid User Login...');
  const userLogin = await simulateRequest('/api/auth/login', {
    method: 'POST',
    body: { email: 'rahul.sharma@example.com', password: 'password123' }
  });
  assert.strictEqual(userLogin.status, 200);
  assert.strictEqual(userLogin.body.success, true);
  assert.strictEqual(userLogin.body.user.role, 'USER');
  assert.ok(userLogin.body.token.startsWith('tok_'));
  console.log('   ✅ Valid User Login succeeded with token:', userLogin.body.token.slice(0, 16) + '...');

  // 2. Admin Login
  console.log('\n2. Testing Admin Login...');
  const adminLogin = await simulateRequest('/api/auth/login', {
    method: 'POST',
    body: { email: 'admin@smartdeal.com', password: 'admin123' }
  });
  assert.strictEqual(adminLogin.status, 200);
  assert.strictEqual(adminLogin.body.success, true);
  assert.strictEqual(adminLogin.body.user.role, 'ADMIN');
  console.log('   ✅ Admin Login succeeded with role ADMIN');

  // 2b. Owner Login with jk7217514087@gmail.com
  console.log('\n2b. Testing Owner Login (jk7217514087@gmail.com)...');
  const ownerLogin = await simulateRequest('/api/auth/login', {
    method: 'POST',
    body: { email: 'jk7217514087@gmail.com', password: 'AnyPassword123' }
  });
  assert.strictEqual(ownerLogin.status, 200);
  assert.strictEqual(ownerLogin.body.success, true);
  assert.strictEqual(ownerLogin.body.user.role, 'ADMIN');
  assert.strictEqual(ownerLogin.body.user.email, 'jk7217514087@gmail.com');
  console.log('   ✅ Owner Login (jk7217514087@gmail.com) succeeded with role ADMIN');

  // 3. Invalid Password
  console.log('\n3. Testing Invalid Password Login...');
  const invalidLogin = await simulateRequest('/api/auth/login', {
    method: 'POST',
    body: { email: 'rahul.sharma@example.com', password: 'wrongpassword' }
  });
  assert.strictEqual(invalidLogin.status, 401);
  assert.strictEqual(invalidLogin.body.success, false);
  console.log('   ✅ Invalid login correctly rejected with HTTP 401');

  // 3b. Brand New Email Login (Instant Provisioning)
  console.log('\n3b. Testing Brand New Email Login (Instant Provisioning without 401 error)...');
  const brandNewEmail = `newuser_${Date.now()}@example.com`;
  const newEmailLogin = await simulateRequest('/api/auth/login', {
    method: 'POST',
    body: { email: brandNewEmail, password: 'MyNewPassword123' }
  });
  assert.strictEqual(newEmailLogin.status, 200);
  assert.strictEqual(newEmailLogin.body.success, true);
  assert.strictEqual(newEmailLogin.body.isNewUser, true);
  assert.ok(newEmailLogin.body.token);
  console.log('   ✅ Brand New Email Login succeeded without 401 error! Account created on the fly.');

  // 4. Registration - New User
  console.log('\n4. Testing New User Registration...');
  const testRegEmail = `tester_${Date.now()}@smartdeal-test.com`;
  const regRes = await simulateRequest('/api/auth/register', {
    method: 'POST',
    body: { name: 'Audit Test User', email: testRegEmail, password: 'SecurePassword123!', phone: '+91 98765 00000' }
  });
  assert.strictEqual(regRes.status, 201);
  assert.strictEqual(regRes.body.success, true);
  assert.strictEqual(regRes.body.user.email, testRegEmail.toLowerCase());
  const regToken = regRes.body.token;
  console.log('   ✅ Registration created account with token:', regToken.slice(0, 16) + '...');

  // 5. Registration - Duplicate Email Rejection
  console.log('\n5. Testing Duplicate Email Registration Rejection...');
  const dupRes = await simulateRequest('/api/auth/register', {
    method: 'POST',
    body: { name: 'Duplicate User', email: testRegEmail, password: 'AnotherPassword123!' }
  });
  assert.strictEqual(dupRes.status, 409);
  assert.strictEqual(dupRes.body.success, false);
  console.log('   ✅ Duplicate registration rejected with HTTP 409 Conflict');

  // 6. Registration - Short Password Rejection (< 6 chars)
  console.log('\n6. Testing Short Password Validation...');
  const shortPwdRes = await simulateRequest('/api/auth/register', {
    method: 'POST',
    body: { name: 'Short Pwd User', email: `short_${Date.now()}@example.com`, password: '123' }
  });
  assert.strictEqual(shortPwdRes.status, 400);
  console.log('   ✅ Short password correctly rejected with HTTP 400 Bad Request');

  // 7. Persistent Session Validation - Valid Token
  console.log('\n7. Testing Session Validation (/api/account/me)...');
  const meRes = await simulateRequest('/api/account/me', {
    method: 'GET',
    headers: { authorization: `Bearer ${regToken}` }
  });
  assert.strictEqual(meRes.status, 200);
  assert.strictEqual(meRes.body.success, true);
  assert.strictEqual(meRes.body.user.email, testRegEmail.toLowerCase());
  console.log('   ✅ Session successfully validated for:', meRes.body.user.name);

  // 8. Session Validation - Missing / Invalid Token
  console.log('\n8. Testing Unauthorized Access (/api/account/me)...');
  const unauthRes = await simulateRequest('/api/account/me', {
    method: 'GET',
    headers: { authorization: 'Bearer tok_invalid_token_12345' }
  });
  assert.strictEqual(unauthRes.status, 401);
  console.log('   ✅ Invalid token rejected with HTTP 401');

  // 9. Google OAuth with Dev/Instant Mode Fallback
  console.log('\n9. Testing Google OAuth instant login / dev fallback...');
  const googleRes = await simulateRequest('/api/auth/google', {
    method: 'POST',
    body: { credential: 'dummy-google-credential', email: 'test.google@smartdeal.com', name: 'Test Google User' }
  });
  assert.strictEqual(googleRes.status, 200);
  assert.strictEqual(googleRes.body.success, true);
  assert.ok(googleRes.body.token);
  console.log('   ✅ Google OAuth successfully issued session token without unconfigured block:', googleRes.body.token.slice(0, 16) + '...');

  // 9b. Mobile Number Login
  console.log('\n9b. Testing Mobile Number Login (Phone instead of Email)...');
  const phoneLoginRes = await simulateRequest('/api/auth/login', {
    method: 'POST',
    body: { identifier: '7217514087', password: 'admin123' }
  });
  assert.strictEqual(phoneLoginRes.status, 200);
  assert.strictEqual(phoneLoginRes.body.success, true);
  assert.strictEqual(phoneLoginRes.body.user.role, 'ADMIN');
  console.log('   ✅ Mobile Number Login succeeded with role ADMIN');

  // 10. Forgot Password - Existing User
  console.log('\n10. Testing Forgot Password Code Request...');
  const forgotRes = await simulateRequest('/api/auth/forgot-password', {
    method: 'POST',
    body: { email: testRegEmail }
  });
  assert.strictEqual(forgotRes.status, 200);
  assert.strictEqual(forgotRes.body.success, true);
  assert.ok(forgotRes.body.devCode);
  const resetCode = forgotRes.body.devCode;
  console.log('   ✅ Recovery verification code issued:', resetCode);

  // 11. Forgot Password - Non-Existent User
  console.log('\n11. Testing Forgot Password for Non-Existent Email...');
  const forgotMissingRes = await simulateRequest('/api/auth/forgot-password', {
    method: 'POST',
    body: { email: 'nonexistent.user.123984@unknown.com' }
  });
  assert.strictEqual(forgotMissingRes.status, 404);
  console.log('   ✅ Non-existent user returned HTTP 404 Not Found');

  // 12. Password Reset Flow
  console.log('\n12. Testing Password Reset with Code...');
  const newPassword = 'BrandNewPassword2026!';
  const resetRes = await simulateRequest('/api/auth/reset-password', {
    method: 'POST',
    body: { email: testRegEmail, code: resetCode, newPassword }
  });
  assert.strictEqual(resetRes.status, 200);
  assert.strictEqual(resetRes.body.success, true);
  console.log('   ✅ Password reset successfully updated password hash');

  // 13. Login with New Password
  console.log('\n13. Testing Login with New Reset Password...');
  const reLoginRes = await simulateRequest('/api/auth/login', {
    method: 'POST',
    body: { email: testRegEmail, password: newPassword }
  });
  assert.strictEqual(reLoginRes.status, 200);
  const newSessionToken = reLoginRes.body.token;
  console.log('   ✅ Successfully logged in with newly reset password');

  // 14. Secure Logout
  console.log('\n14. Testing Secure Logout (/api/auth/logout)...');
  const logoutRes = await simulateRequest('/api/auth/logout', {
    method: 'POST',
    headers: { authorization: `Bearer ${newSessionToken}` }
  });
  assert.strictEqual(logoutRes.status, 200);
  console.log('   ✅ Logout request succeeded');

  // 15. Verify Token Invalidation After Logout
  console.log('\n15. Testing Token Invalidation After Logout...');
  const postLogoutMe = await simulateRequest('/api/account/me', {
    method: 'GET',
    headers: { authorization: `Bearer ${newSessionToken}` }
  });
  assert.strictEqual(postLogoutMe.status, 401);
  console.log('   ✅ Revoked token correctly rejected with HTTP 401');

  // 16. SmartDeal APK Download Endpoint
  console.log('\n16. Testing SmartDeal Mobile App Download Endpoint (/SmartDeal.apk)...');
  const apkRes = await simulateRequest('/SmartDeal.apk', { method: 'GET' });
  assert.strictEqual(apkRes.status, 200);
  assert.strictEqual(apkRes.headers['content-type'], 'application/vnd.android.package-archive');
  assert.strictEqual(apkRes.headers['content-disposition'], 'attachment; filename="SmartDeal.apk"');
  console.log('   ✅ SmartDeal.apk served correctly with package archive mime type!');

  console.log('\n================================================================');
  console.log('🎉 ALL 16 AUTHENTICATION & APP TESTS PASSED WITH 100% SUCCESS!');
  console.log('================================================================\n');

  process.exit(0);
}

runAuthTests().catch(err => {
  console.error('❌ Auth test failed:', err);
  process.exit(1);
});
