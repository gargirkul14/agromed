import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { db } from '../utils/db.js';
import { generateToken } from '../utils/token.js';
import { validateAndNormalizeEmail, validateAndNormalizeIndianPhone } from '../utils/validators.js';
import { sendOtpEmail } from '../services/emailService.js';

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10);
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_OTP_ATTEMPTS = 5;

/**
 * Step 1 of Registration: Validate input, create pending registration, and send Email OTP.
 * POST /api/auth/register/request-otp
 */
export async function requestRegistrationOtp(req, res) {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    // 1. Name validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (name.trim().length > 100) {
      return res.status(400).json({ success: false, message: 'Full name cannot exceed 100 characters.' });
    }

    // 2. Email validation & normalization
    const emailValidation = validateAndNormalizeEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ success: false, message: emailValidation.error });
    }
    const normalizedEmail = emailValidation.normalizedEmail;

    // 3. Indian Phone validation & normalization
    const phoneValidation = validateAndNormalizeIndianPhone(phone);
    if (!phoneValidation.isValid) {
      return res.status(400).json({ success: false, message: phoneValidation.error });
    }
    const normalizedPhone = phoneValidation.normalizedPhone;

    // 4. Password validation
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must contain at least 6 characters.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // 5. Check if email is already registered in active Users
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail }
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.'
      });
    }

    // 6. Check if phone is already registered by another user
    const existingPhoneUser = await db.user.findFirst({
      where: { phone: normalizedPhone }
    });
    if (existingPhoneUser) {
      return res.status(400).json({
        success: false,
        message: 'This mobile number is already associated with another account.'
      });
    }

    // 7. Check rate limit on OTP resends for this email
    const existingPending = await db.pendingRegistration.findUnique({
      where: { email: normalizedEmail }
    });
    if (existingPending) {
      const timeSinceUpdate = Date.now() - new Date(existingPending.updatedAt || existingPending.createdAt).getTime();
      if (timeSinceUpdate < RESEND_COOLDOWN_MS) {
        const secondsRemaining = Math.ceil((RESEND_COOLDOWN_MS - timeSinceUpdate) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${secondsRemaining} seconds before requesting a new verification code.`,
          retryAfterSeconds: secondsRemaining
        });
      }
    }

    // 8. Generate cryptographically secure 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // 9. Send OTP Email first (do not save if email delivery fails)
    try {
      await sendOtpEmail(normalizedEmail, otp, OTP_EXPIRY_MINUTES);
    } catch (mailErr) {
      if (mailErr.code === 'SMTP_NOT_CONFIGURED') {
        return res.status(503).json({
          success: false,
          code: 'SMTP_NOT_CONFIGURED',
          message: mailErr.message || 'Email service is not configured on the server. Please configure SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) in backend/.env to send verification codes.'
        });
      }
      if (mailErr.code === 'SMTP_AUTH_FAILED') {
        return res.status(502).json({
          success: false,
          code: 'SMTP_AUTH_FAILED',
          message: mailErr.message
        });
      }
      return res.status(500).json({
        success: false,
        code: 'EMAIL_DELIVERY_FAILED',
        message: mailErr.message || 'Failed to deliver verification code to your email. Please check your email address or try again later.'
      });
    }

    // 10. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 11. Upsert pending registration record
    await db.pendingRegistration.upsert({
      where: { email: normalizedEmail },
      update: {
        name: name.trim(),
        password: hashedPassword,
        phone: normalizedPhone,
        otpHash,
        expiresAt,
        attempts: 0,
        updatedAt: new Date()
      },
      create: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: normalizedPhone,
        otpHash,
        expiresAt,
        attempts: 0
      }
    });

    return res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been sent to ${normalizedEmail}.`,
      email: normalizedEmail,
      expiresInSeconds: OTP_EXPIRY_MINUTES * 60
    });
  } catch (err) {
    console.error('requestRegistrationOtp error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to process registration request. Please try again.'
    });
  }
}

/**
 * Step 2 of Registration: Verify OTP, finalize user creation, and issue JWT.
 * POST /api/auth/register/verify-otp
 */
export async function verifyRegistrationOtp(req, res) {
  try {
    const { email, otp } = req.body;

    const emailValidation = validateAndNormalizeEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ success: false, message: emailValidation.error });
    }
    const normalizedEmail = emailValidation.normalizedEmail;

    if (!otp || typeof otp !== 'string' || !/^\d{6}$/.test(otp.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit verification code.' });
    }

    const cleanOtp = otp.trim();

    // 1. Fetch pending registration
    const pending = await db.pendingRegistration.findUnique({
      where: { email: normalizedEmail }
    });

    if (!pending) {
      return res.status(404).json({
        success: false,
        message: 'No pending registration found for this email address. Please submit the registration form again.'
      });
    }

    // 2. Check Expiry
    if (new Date() > new Date(pending.expiresAt)) {
      await db.pendingRegistration.delete({ where: { email: normalizedEmail } });
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new code.'
      });
    }

    // 3. Check attempt limit
    if (pending.attempts >= MAX_OTP_ATTEMPTS) {
      await db.pendingRegistration.delete({ where: { email: normalizedEmail } });
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. For security, this verification code has been invalidated. Please request a new code.'
      });
    }

    // 4. Verify OTP Hash
    const submittedHash = crypto.createHash('sha256').update(cleanOtp).digest('hex');
    if (submittedHash !== pending.otpHash) {
      const newAttempts = pending.attempts + 1;
      await db.pendingRegistration.update({
        where: { id: pending.id },
        data: { attempts: newAttempts }
      });

      const attemptsRemaining = MAX_OTP_ATTEMPTS - newAttempts;
      return res.status(400).json({
        success: false,
        message: attemptsRemaining > 0
          ? `Incorrect verification code. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? '' : 's'} remaining.`
          : 'Too many incorrect attempts. Code has been invalidated. Please request a new code.'
      });
    }

    // 5. OTP is valid! Check if an account was created concurrently
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail }
    });
    if (existingUser) {
      await db.pendingRegistration.delete({ where: { email: normalizedEmail } });
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.'
      });
    }

    // 6. Create Verified User
    const newUser = await db.user.create({
      data: {
        name: pending.name,
        email: pending.email,
        password: pending.password,
        phone: pending.phone,
        role: 'FARMER',
        isEmailVerified: true
      }
    });

    // 7. Create default FarmerProfile
    const farmerProfile = await db.farmerProfile.create({
      data: {
        userId: newUser.id,
        profileCompleted: false
      }
    });

    // 8. Delete pending registration (single-use OTP)
    await db.pendingRegistration.delete({
      where: { email: normalizedEmail }
    });

    // 9. Generate JWT
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    return res.status(201).json({
      success: true,
      message: 'Email verified successfully! Welcome to AgroMed AI.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        isEmailVerified: true
      },
      farmerProfile: {
        id: farmerProfile.id,
        profileCompleted: false
      }
    });
  } catch (err) {
    console.error('verifyRegistrationOtp error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify code. Please try again.'
    });
  }
}

/**
 * Resend OTP for pending registration.
 * POST /api/auth/register/resend-otp
 */
export async function resendRegistrationOtp(req, res) {
  try {
    const { email } = req.body;

    const emailValidation = validateAndNormalizeEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ success: false, message: emailValidation.error });
    }
    const normalizedEmail = emailValidation.normalizedEmail;

    const pending = await db.pendingRegistration.findUnique({
      where: { email: normalizedEmail }
    });

    if (!pending) {
      return res.status(404).json({
        success: false,
        message: 'No pending registration found for this email. Please fill out the registration form.'
      });
    }

    // Cooldown check
    const timeSinceUpdate = Date.now() - new Date(pending.updatedAt || pending.createdAt).getTime();
    if (timeSinceUpdate < RESEND_COOLDOWN_MS) {
      const secondsRemaining = Math.ceil((RESEND_COOLDOWN_MS - timeSinceUpdate) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${secondsRemaining} seconds before requesting another code.`,
        retryAfterSeconds: secondsRemaining
      });
    }

    // Generate new OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Send email
    try {
      await sendOtpEmail(normalizedEmail, otp, OTP_EXPIRY_MINUTES);
    } catch (mailErr) {
      if (mailErr.code === 'SMTP_NOT_CONFIGURED') {
        return res.status(503).json({
          success: false,
          code: 'SMTP_NOT_CONFIGURED',
          message: mailErr.message || 'Email service is not configured on the server. Please configure SMTP credentials in backend/.env.'
        });
      }
      if (mailErr.code === 'SMTP_AUTH_FAILED') {
        return res.status(502).json({
          success: false,
          code: 'SMTP_AUTH_FAILED',
          message: mailErr.message
        });
      }
      return res.status(500).json({
        success: false,
        code: 'EMAIL_DELIVERY_FAILED',
        message: mailErr.message || 'Failed to deliver verification code. Please check your email or try again later.'
      });
    }

    // Update pending registration
    await db.pendingRegistration.update({
      where: { email: normalizedEmail },
      data: {
        otpHash,
        expiresAt,
        attempts: 0,
        updatedAt: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      message: `A new verification code has been sent to ${normalizedEmail}.`,
      expiresInSeconds: OTP_EXPIRY_MINUTES * 60
    });
  } catch (err) {
    console.error('resendRegistrationOtp error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to resend verification code. Please try again.'
    });
  }
}

/**
 * Direct user registration.
 * Checks that mobile number is 10 digits.
 * POST /api/auth/register
 */
export async function register(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Only check phone number is 10 digits
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }
    const phoneDigits = phone.toString().replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      return res.status(400).json({ success: false, message: 'Mobile number must be exactly 10 digits.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // Check if user already exists
    const existing = await db.user.findUnique({
      where: { email: normalizedEmail }
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phoneDigits,
        password: hashedPassword,
        role: 'FARMER',
        isEmailVerified: true
      }
    });

    // Create default farmer profile
    const farmerProfile = await db.farmerProfile.create({
      data: {
        userId: newUser.id,
        profileCompleted: false
      }
    });

    // Issue JWT token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to AgroMed AI.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        isEmailVerified: true
      },
      farmerProfile: {
        id: farmerProfile.id,
        profileCompleted: false
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.'
    });
  }
}

/**
 * User login.
 * POST /api/auth/login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }
    const normalizedEmail = email.trim().toLowerCase();

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required.' });
    }

    const user = await db.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Fetch farmer profile if farmer
    let farmerProfile = null;
    let workProfile = null;
    if (user.role === 'FARMER') {
      farmerProfile = await db.farmerProfile.findUnique({
        where: { userId: user.id },
        include: { workProfile: true }
      });
      if (farmerProfile?.workProfile) {
        workProfile = farmerProfile.workProfile;
      }
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified ?? true
      },
      farmerProfile: farmerProfile
        ? {
            id: farmerProfile.id,
            userId: farmerProfile.userId,
            age: farmerProfile.age,
            gender: farmerProfile.gender,
            village: farmerProfile.village,
            district: farmerProfile.district,
            state: farmerProfile.state,
            yearsOfFarming: farmerProfile.yearsOfFarming,
            profileCompleted: farmerProfile.profileCompleted
          }
        : null,
      workProfile
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
}

/**
 * Get current profile.
 * GET /api/auth/profile
 */
export async function getProfile(req, res) {
  try {
    const user = await db.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let farmerProfile = null;
    let workProfile = null;
    if (user.role === 'FARMER') {
      farmerProfile = await db.farmerProfile.findUnique({
        where: { userId: user.id },
        include: { workProfile: true }
      });
      if (farmerProfile?.workProfile) {
        workProfile = farmerProfile.workProfile;
      }
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified ?? true
      },
      farmerProfile,
      workProfile
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
}

/**
 * Update current profile.
 * PUT /api/auth/profile
 */
export async function updateProfile(req, res) {
  try {
    const { name, phone } = req.body;

    const data = {};
    if (name) data.name = name.trim();
    if (phone !== undefined) {
      if (phone) {
        const phoneValidation = validateAndNormalizeIndianPhone(phone);
        if (!phoneValidation.isValid) {
          return res.status(400).json({ success: false, message: phoneValidation.error });
        }
        data.phone = phoneValidation.normalizedPhone;
      } else {
        data.phone = null;
      }
    }

    const updatedUser = await db.user.update({
      where: { id: req.user.id },
      data
    });

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        isEmailVerified: updatedUser.isEmailVerified ?? true
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
}
