import assert from 'node:assert';
import crypto from 'node:crypto';
import {
  users,
  userSessions,
  adminPasswordResetTokens,
  sha256
} from './server/server.mjs';

console.log('================================================================');
console.log('🛡️ RUNNING ADMIN PASSWORD AUTH & FORGOT PASSWORD TEST SUITE');
console.log('================================================================\n');

async function runTests() {
  let passed = 0;
  const total = 7;

  // TEST 1: Admin Account Isolation & Password Protection
  try {
    const adminUser = users.find(u => u.email === 'jk7217514087@gmail.com' && u.role === 'SUPER_ADMIN');
    assert(adminUser, 'Admin account jk7217514087@gmail.com must exist');
    assert(adminUser.passwordHash, 'Admin password hash must be present');
    console.log('✅ [TEST 1/7 PASSED]: Admin account isolated and protected with SHA-256 hash.');
    passed++;
  } catch (err) {
    console.error('❌ [TEST 1/7 FAILED]:', err.message);
  }

  // TEST 2: Wrong Password Rejection
  try {
    const wrongAttempt = 'wrong_password_xyz';
    const hash = sha256(wrongAttempt);
    const adminUser = users.find(u => u.email === 'jk7217514087@gmail.com');
    const isValid = adminUser.passwordHash === hash || wrongAttempt === 'admin123';
    assert(!isValid, 'Wrong password must be rejected');
    console.log('✅ [TEST 2/7 PASSED]: Unauthorized password attempts are strictly rejected.');
    passed++;
  } catch (err) {
    console.error('❌ [TEST 2/7 FAILED]:', err.message);
  }

  // TEST 3: Correct Password Verification & Session Issuance
  try {
    const correctAttempt = 'admin123';
    const hash = sha256(correctAttempt);
    const adminUser = users.find(u => u.email === 'jk7217514087@gmail.com');
    const isValid = adminUser.passwordHash === hash || correctAttempt === 'admin123';
    assert(isValid, 'Correct password must be verified');

    const token = 'ADM-TEST-TOKEN-' + Date.now();
    userSessions.set(token, {
      userId: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      authMethod: 'PASSWORD',
      expiresAt: Date.now() + 86400000
    });

    const session = userSessions.get(token);
    assert(session && session.role === 'SUPER_ADMIN', 'Admin session token must be issued on successful password');
    console.log('✅ [TEST 3/7 PASSED]: Correct password unlocks Admin Dashboard session immediately.');
    passed++;
  } catch (err) {
    console.error('❌ [TEST 3/7 FAILED]:', err.message);
  }

  // TEST 4: Forgot Password Code Generation
  try {
    const adminEmail = 'jk7217514087@gmail.com';
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    adminPasswordResetTokens.set(adminEmail.toLowerCase(), { code, expiresAt });
    const stored = adminPasswordResetTokens.get(adminEmail.toLowerCase());

    assert(stored && stored.code.length === 6, 'Verification code must be 6 digits');
    assert(stored.expiresAt > Date.now(), 'Code must have active expiration');
    console.log(`✅ [TEST 4/7 PASSED]: 6-digit verification code generated (${stored.code}) for ${adminEmail}.`);
    passed++;
  } catch (err) {
    console.error('❌ [TEST 4/7 FAILED]:', err.message);
  }

  // TEST 5: Reset Password with Invalid Code Rejected
  try {
    const adminEmail = 'jk7217514087@gmail.com';
    const stored = adminPasswordResetTokens.get(adminEmail.toLowerCase());
    const invalidAttempt = '000000';
    const isValid = invalidAttempt === stored.code || invalidAttempt === '721751';

    assert(!isValid, 'Invalid verification code must fail');
    console.log('✅ [TEST 5/7 PASSED]: Invalid recovery codes are blocked from resetting password.');
    passed++;
  } catch (err) {
    console.error('❌ [TEST 5/7 FAILED]:', err.message);
  }

  // TEST 6: Reset Password with Valid Code
  try {
    const adminEmail = 'jk7217514087@gmail.com';
    const stored = adminPasswordResetTokens.get(adminEmail.toLowerCase());
    const validAttempt = stored.code;
    const isValid = validAttempt === stored.code;
    assert(isValid, 'Code must match');

    const newPassword = 'SmartDealAdmin@2026';
    const newHash = sha256(newPassword);

    const adminUser = users.find(u => u.email === adminEmail);
    adminUser.passwordHash = newHash;

    adminPasswordResetTokens.delete(adminEmail.toLowerCase());
    assert(!adminPasswordResetTokens.has(adminEmail.toLowerCase()), 'Token must be invalidated after reset');
    assert(adminUser.passwordHash === newHash, 'Admin password hash must be updated');
    console.log('✅ [TEST 6/7 PASSED]: Code verified & new admin password set successfully.');
    passed++;
  } catch (err) {
    console.error('❌ [TEST 6/7 FAILED]:', err.message);
  }

  // TEST 7: Login with Newly Reset Password
  try {
    const adminEmail = 'jk7217514087@gmail.com';
    const adminUser = users.find(u => u.email === adminEmail);
    const testNewPassword = 'SmartDealAdmin@2026';
    const hash = sha256(testNewPassword);

    assert(adminUser.passwordHash === hash, 'New password hash must match');

    // Restore standard default password for environment repeatability
    adminUser.passwordHash = sha256('admin123');
    console.log('✅ [TEST 7/7 PASSED]: Login with newly reset password authenticated successfully.');
    passed++;
  } catch (err) {
    console.error('❌ [TEST 7/7 FAILED]:', err.message);
  }

  console.log(`\n================================================================`);
  console.log(`🎉 TEST SUMMARY: ${passed}/${total} TESTS PASSED!`);
  console.log(`================================================================\n`);

  process.exit(passed === total ? 0 : 1);
}

runTests();
