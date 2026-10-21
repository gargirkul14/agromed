import nodemailer from 'nodemailer';
import { loadEnv, getSmtpDiagnostics } from '../utils/env.js';

/**
 * Creates and verifies the Nodemailer SMTP transporter.
 * Returns null if SMTP credentials are missing or unconfigured.
 */
export function getTransporter() {
  loadEnv(); // Ensure env vars are loaded even if called in isolation

  const host = (process.env.SMTP_HOST || '').trim();
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = (process.env.SMTP_USER || '').trim();
  const rawPass = (process.env.SMTP_PASS || '').trim();

  // If credentials are empty or placeholder
  if (!host || !user || !rawPass) {
    return null;
  }

  // Remove spaces if user entered a 16-character Google App Password with spaces
  const pass = rawPass.replace(/\s+/g, '');

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
  });
}

/**
 * Verifies the SMTP transporter connection with the remote server.
 * Returns an object with { configured, ready, message, code }.
 */
export async function verifySmtpConnection() {
  const transporter = getTransporter();
  if (!transporter) {
    const diag = getSmtpDiagnostics();
    return {
      configured: false,
      ready: false,
      code: 'SMTP_NOT_CONFIGURED',
      message: `Missing SMTP configuration: ${diag.missingVars.join(', ')}`
    };
  }

  try {
    await transporter.verify();
    return {
      configured: true,
      ready: true,
      message: 'SMTP connection verified successfully.'
    };
  } catch (err) {
    const isAuthError = err.code === 'EAUTH' || (err.responseCode && err.responseCode === 535);
    return {
      configured: true,
      ready: false,
      code: isAuthError ? 'EAUTH' : (err.code || 'SMTP_ERROR'),
      message: isAuthError
        ? 'SMTP Authentication failed. For Gmail, make sure you use a 16-character Google App Password (not your standard account password).'
        : `SMTP Connection error: ${err.message}`
    };
  }
}

/**
 * Sends a 6-digit OTP email to the user.
 *
 * @param {string} email - Destination email address
 * @param {string} otp - 6-digit verification code
 * @param {number} [expiryMinutes=5] - OTP lifetime in minutes
 * @returns {Promise<{ messageId: string }>}
 */
export async function sendOtpEmail(email, otp, expiryMinutes = 5) {
  const transporter = getTransporter();

  if (!transporter) {
    const diag = getSmtpDiagnostics();
    console.error(`\n[AgroMed Email Service] Cannot send OTP: Missing SMTP variables: ${diag.missingVars.join(', ')}`);
    console.error(`[AgroMed Email Service] Working Directory: ${diag.cwd}`);
    console.error(`[AgroMed Email Service] Environment File: ${diag.envFilePath}\n`);

    const error = new Error(
      `Email service (SMTP) is not configured on the server. Missing: ${diag.missingVars.join(', ')}. Please check backend/.env.`
    );
    error.code = 'SMTP_NOT_CONFIGURED';
    error.missingVars = diag.missingVars;
    throw error;
  }

  const user = (process.env.SMTP_USER || '').trim();
  let sender = (process.env.EMAIL_FROM || '').trim();
  // Ensure the From address has a valid format and doesn't trigger Gmail sender mismatches
  if (!sender || sender.includes('no-reply@agromed.ai')) {
    sender = `"AgroMed AI" <${user}>`;
  }

  console.log(`[AgroMed Email Service] Attempting to dispatch OTP to <${email}> via ${process.env.SMTP_HOST}:${process.env.SMTP_PORT || 587}...`);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background: linear-gradient(135deg, #15803d, #16a34a); padding: 28px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
        .content { padding: 32px 28px; text-align: center; }
        .content p { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px; }
        .otp-box { background: #f0fdf4; border: 2px dashed #86efac; border-radius: 16px; padding: 18px 24px; margin: 24px 0; display: inline-block; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #166534; margin: 0; }
        .warning-box { background: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 14px; font-size: 12px; color: #92400e; text-align: left; margin-top: 24px; }
        .footer { padding: 20px 28px; background: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 11px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AgroMed AI</h1>
          <p>Farmer Health & Safety Assistant</p>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Thank you for registering on <strong>AgroMed AI</strong>. Please use the following 6-digit verification code to complete your account setup:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>

          <p>This code is valid for <strong>${expiryMinutes} minutes</strong> and can only be used once.</p>

          <div class="warning-box">
            <strong>Security Notice:</strong> Never share this verification code with anyone. AgroMed AI team members will never ask for your OTP. If you did not request this registration, you can safely ignore this email.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} AgroMed AI. Dedicated to protecting agricultural workers.
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `AgroMed AI - Verification Code: ${otp}\n\nUse this code within ${expiryMinutes} minutes to complete your farmer registration.\n\nDo not share this code with anyone. If you did not request this, please ignore this email.`;

  try {
    const info = await transporter.sendMail({
      from: sender,
      to: email,
      subject: `Your AgroMed AI Verification Code: ${otp}`,
      text: textContent,
      html: htmlContent
    });

    console.log(`[AgroMed Email Service] ✓ OTP email successfully dispatched to ${email}! (Message ID: ${info.messageId})`);
    return { messageId: info.messageId };
  } catch (err) {
    console.error('[AgroMed Email Service] ✗ Nodemailer error:', err.message);

    const isAuthError = err.code === 'EAUTH' || (err.responseCode && err.responseCode === 535);
    if (isAuthError) {
      console.error('\n[AgroMed Email Service] ⚠️  SMTP Authentication Failed (535 BadCredentials):');
      console.error(`   - Account: ${user}`);
      console.error('   - Cause: Google rejected the provided password.');
      console.error('   - FIX: For Gmail, you MUST generate a 16-character App Password at:');
      console.error('     https://myaccount.google.com/apppasswords');
      console.error('     Then set it in backend/.env: SMTP_PASS=xxxx xxxx xxxx xxxx\n');

      const authError = new Error(
        'SMTP Authentication failed: Google rejected the username or password. For Gmail, you must generate and use a 16-character Google App Password (not your normal Gmail password or PIN) in backend/.env.'
      );
      authError.code = 'SMTP_AUTH_FAILED';
      authError.originalCode = err.code;
      throw authError;
    }

    const deliveryError = new Error(`Failed to deliver OTP email: ${err.message}`);
    deliveryError.code = 'SMTP_DELIVERY_FAILED';
    deliveryError.originalCode = err.code;
    throw deliveryError;
  }
}
