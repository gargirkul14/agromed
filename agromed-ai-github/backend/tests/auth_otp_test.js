import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { db, initializeDatabase } from '../utils/db.js';
import { validateAndNormalizeEmail, validateAndNormalizeIndianPhone } from '../utils/validators.js';
import {
  requestRegistrationOtp,
  verifyRegistrationOtp,
  resendRegistrationOtp,
  register,
  login
} from '../controllers/authController.js';

// Helper to create mock Express req and res
function createMockReqRes(body = {}, headers = {}) {
  const req = { body, headers, user: null };
  const res = {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    }
  };
  return { req, res };
}

async function runTests() {
  console.log('🧪 Starting AgroMed AI Authentication & OTP Test Suite...\n');
  await initializeDatabase();

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // --- Test 1: Valid registration details validation ---
  const validEmail = validateAndNormalizeEmail('   Ramesh.Farmer@gmail.com  ');
  const validPhone = validateAndNormalizeIndianPhone('+91 98765 43210');
  assert(
    validEmail.isValid && validEmail.normalizedEmail === 'ramesh.farmer@gmail.com',
    'Case 1.1: Valid email correctly normalized and accepted'
  );
  assert(
    validPhone.isValid && validPhone.raw10Digit === '9876543210' && validPhone.normalizedPhone === '+91 98765 43210',
    'Case 1.2: Valid Indian phone correctly normalized'
  );

  // --- Test 2: Invalid email format ---
  const invalid1 = validateAndNormalizeEmail('usergmail.com');
  const invalid2 = validateAndNormalizeEmail('user@');
  const invalid3 = validateAndNormalizeEmail('user@domain');
  assert(!invalid1.isValid && !invalid2.isValid && !invalid3.isValid, 'Case 2: Invalid email formats rejected');

  // --- Test 3: Empty email ---
  const emptyEmail1 = validateAndNormalizeEmail('');
  const emptyEmail2 = validateAndNormalizeEmail('   ');
  assert(!emptyEmail1.isValid && !emptyEmail2.isValid, 'Case 3: Empty email rejected');

  // --- Test 4: Invalid Indian phone number ---
  const badPhone1 = validateAndNormalizeIndianPhone('12345'); // too short
  const badPhone2 = validateAndNormalizeIndianPhone('abcdefghij'); // alpha
  const badPhone3 = validateAndNormalizeIndianPhone('5987654321'); // starts with 5 (not 6,7,8,9)
  const goodPhone = validateAndNormalizeIndianPhone('9876543210'); // valid 10 digits
  assert(
    !badPhone1.isValid && !badPhone2.isValid && !badPhone3.isValid && goodPhone.isValid,
    'Case 4: Invalid Indian phone numbers rejected; valid 10-digit starting with 6-9 accepted'
  );

  // --- Test 5: Existing email address ---
  {
    const { req, res } = createMockReqRes({
      name: 'Duplicate Test',
      email: 'farmer@agromed.ai',
      phone: '9876500001',
      password: 'Password@123',
      confirmPassword: 'Password@123'
    });
    await requestRegistrationOtp(req, res);
    assert(
      res.statusCode === 400 && res.data.message.includes('already exists'),
      'Case 5: Existing email address rejected with friendly message'
    );
  }

  // --- Test 6 & 12: SMTP delivery behavior ---
  // When SMTP is unconfigured in development/test, it must return HTTP 503 and not falsely claim success
  {
    const originalHost = process.env.SMTP_HOST;
    delete process.env.SMTP_HOST;
    const testEmail = 'newfarmer.test@example.com';
    const { req, res } = createMockReqRes({
      name: 'New Farmer',
      email: testEmail,
      phone: '9876599999',
      password: 'SecurePassword@123',
      confirmPassword: 'SecurePassword@123'
    });
    await requestRegistrationOtp(req, res);
    assert(
      res.statusCode === 503 && res.data.code === 'SMTP_NOT_CONFIGURED',
      'Case 12: SMTP unconfigured returns HTTP 503 without fake success'
    );
    if (originalHost) process.env.SMTP_HOST = originalHost;
  }

  // Now, to test OTP verification lifecycle in database, we seed a pending registration directly
  const testPendingEmail = 'test.verification@example.com';
  const testOtp = '849201';
  const testOtpHash = crypto.createHash('sha256').update(testOtp).digest('hex');
  const testPassword = 'FarmerPassword@123';
  const hashedPassword = await bcrypt.hash(testPassword, 10);

  await db.pendingRegistration.upsert({
    where: { email: testPendingEmail },
    update: {
      name: 'Test Farmer',
      password: hashedPassword,
      phone: '+91 98765 11111',
      otpHash: testOtpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
      updatedAt: new Date()
    },
    create: {
      name: 'Test Farmer',
      email: testPendingEmail,
      password: hashedPassword,
      phone: '+91 98765 11111',
      otpHash: testOtpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0
    }
  });

  // --- Test 7: Incorrect OTP ---
  {
    const { req, res } = createMockReqRes({
      email: testPendingEmail,
      otp: '000000'
    });
    await verifyRegistrationOtp(req, res);
    assert(
      res.statusCode === 400 && res.data.message.includes('Incorrect verification code'),
      'Case 7: Incorrect OTP rejected and attempts tracked'
    );
  }

  // --- Test 8: Expired OTP ---
  {
    const expiredEmail = 'expired.user@example.com';
    await db.pendingRegistration.upsert({
      where: { email: expiredEmail },
      update: {
        name: 'Expired User',
        password: hashedPassword,
        phone: '+91 98765 22222',
        otpHash: testOtpHash,
        expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
        attempts: 0
      },
      create: {
        name: 'Expired User',
        email: expiredEmail,
        password: hashedPassword,
        phone: '+91 98765 22222',
        otpHash: testOtpHash,
        expiresAt: new Date(Date.now() - 1000),
        attempts: 0
      }
    });

    const { req, res } = createMockReqRes({
      email: expiredEmail,
      otp: testOtp
    });
    await verifyRegistrationOtp(req, res);
    assert(
      res.statusCode === 400 && res.data.message.includes('expired'),
      'Case 8: Expired OTP rejected'
    );
  }

  // --- Test 10: Excessive incorrect OTP attempts (Attempt limiting) ---
  {
    const bruteEmail = 'brute.test@example.com';
    await db.pendingRegistration.upsert({
      where: { email: bruteEmail },
      update: {
        name: 'Brute User',
        password: hashedPassword,
        phone: '+91 98765 33333',
        otpHash: testOtpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 4 // Already 4 attempts
      },
      create: {
        name: 'Brute User',
        email: bruteEmail,
        password: hashedPassword,
        phone: '+91 98765 33333',
        otpHash: testOtpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 4
      }
    });

    // 5th failed attempt
    const { req: req1, res: res1 } = createMockReqRes({ email: bruteEmail, otp: '111111' });
    await verifyRegistrationOtp(req1, res1);

    // 6th attempt should be blocked with 429
    const { req: req2, res: res2 } = createMockReqRes({ email: bruteEmail, otp: '111111' });
    await verifyRegistrationOtp(req2, res2);

    assert(
      res2.statusCode === 429 && res2.data.message.includes('Too many incorrect attempts'),
      'Case 10: Excessive incorrect attempts invalidates OTP and locks verification'
    );
  }

  // --- Test 11: Excessive resend requests (Rate limiting) ---
  {
    const resendEmail = 'resend.test@example.com';
    await db.pendingRegistration.upsert({
      where: { email: resendEmail },
      update: {
        name: 'Resend User',
        password: hashedPassword,
        phone: '+91 98765 44444',
        otpHash: testOtpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 0,
        updatedAt: new Date() // just updated
      },
      create: {
        name: 'Resend User',
        email: resendEmail,
        password: hashedPassword,
        phone: '+91 98765 44444',
        otpHash: testOtpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 0
      }
    });

    const { req, res } = createMockReqRes({ email: resendEmail });
    await resendRegistrationOtp(req, res);
    assert(
      res.statusCode === 429 && res.data.message.includes('Please wait'),
      'Case 11: Resend OTP requested within 60s cooldown is rate-limited (HTTP 429)'
    );
  }

  // --- Test 13: Attempt to bypass OTP through direct backend API calls ---
  {
    const { req, res } = createMockReqRes({
      name: 'Bypass Attacker',
      email: 'attacker@example.com',
      password: 'HackerPassword@123'
    });
    await register(req, res);
    assert(
      res.statusCode === 403 && res.data.message.includes('Direct registration is disabled'),
      'Case 13: Direct registration endpoint blocked with HTTP 403 (OTP bypass prevented)'
    );
  }

  // --- Test 14: Successful registration followed by login ---
  {
    // Verify our test pending account with the correct OTP
    const { req: vReq, res: vRes } = createMockReqRes({
      email: testPendingEmail,
      otp: testOtp
    });
    await verifyRegistrationOtp(vReq, vRes);

    assert(
      vRes.statusCode === 201 && vRes.data.success && vRes.data.token,
      'Case 14.1: Successful OTP verification creates verified user and returns JWT'
    );

    // Attempt to reuse the already-verified OTP (Case 9)
    const { req: reuseReq, res: reuseRes } = createMockReqRes({
      email: testPendingEmail,
      otp: testOtp
    });
    await verifyRegistrationOtp(reuseReq, reuseRes);
    assert(
      reuseRes.statusCode === 404,
      'Case 9: Reusing an already-verified OTP rejected (Pending record was deleted)'
    );

    // Login with the newly registered user's credentials
    const { req: lReq, res: lRes } = createMockReqRes({
      email: testPendingEmail,
      password: testPassword
    });
    await login(lReq, lRes);
    assert(
      lRes.statusCode === 200 && lRes.data.success && lRes.data.user.email === testPendingEmail,
      'Case 14.2: Newly registered and verified user can successfully log in'
    );
  }

  // --- Test 15: Existing farmer and admin login functionality ---
  {
    // Demo Farmer
    const { req: fReq, res: fRes } = createMockReqRes({
      email: 'farmer@agromed.ai',
      password: 'Farmer@123'
    });
    await login(fReq, fRes);
    assert(
      fRes.statusCode === 200 && fRes.data.user.role === 'FARMER' && fRes.data.token,
      'Case 15.1: Demo Farmer login works flawlessly'
    );

    // Demo Admin
    const { req: aReq, res: aRes } = createMockReqRes({
      email: 'admin@agromed.ai',
      password: 'Admin@123'
    });
    await login(aReq, aRes);
    assert(
      aRes.statusCode === 200 && aRes.data.user.role === 'ADMIN' && aRes.data.token,
      'Case 15.2: Demo Admin login works flawlessly'
    );
  }

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
