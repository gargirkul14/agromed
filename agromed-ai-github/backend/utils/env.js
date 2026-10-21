import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isLoaded = false;
let cachedLoadedPath = null;

/**
 * Loads .env reliably from backend/.env regardless of process.cwd()
 */
export function loadEnv(force = false) {
  if (isLoaded && !force) {
    return cachedLoadedPath;
  }

  const candidatePaths = [
    path.resolve(__dirname, '..', '.env'),           // backend/.env relative to utils/
    path.resolve(process.cwd(), 'backend', '.env'),  // when process.cwd() is project root
    path.resolve(process.cwd(), '.env'),             // when process.cwd() is backend or root
  ];

  for (const envPath of candidatePaths) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      cachedLoadedPath = envPath;
      break;
    }
  }

  isLoaded = true;
  return cachedLoadedPath;
}

// Auto-execute load on import
export const loadedEnvPath = loadEnv();

/**
 * Safe diagnostics for SMTP configuration
 * Never prints password or secrets
 */
export function getSmtpDiagnostics() {
  const host = (process.env.SMTP_HOST || '').trim();
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = (process.env.SMTP_USER || '').trim();
  const rawPass = (process.env.SMTP_PASS || '').trim();
  const emailFrom = (process.env.EMAIL_FROM || '').trim();
  const expiry = parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10);

  const missingVars = [];
  if (!host) missingVars.push('SMTP_HOST');
  if (!user) missingVars.push('SMTP_USER');
  if (!rawPass) missingVars.push('SMTP_PASS');

  const isConfigured = missingVars.length === 0;
  const passLength = rawPass ? rawPass.replace(/\s+/g, '').length : 0;
  const isGmail = host.toLowerCase().includes('gmail');
  const isLikelyAppPassword = isGmail ? passLength === 16 : passLength > 0;

  return {
    isConfigured,
    missingVars,
    host: host || '[MISSING]',
    port,
    secure,
    user: user || '[MISSING]',
    hasPassword: Boolean(rawPass),
    passLength,
    isGmail,
    isLikelyAppPassword,
    emailFrom: emailFrom || `"AgroMed AI" <${user || 'no-reply@agromed.ai'}>`,
    expiryMinutes: expiry,
    envFilePath: loadedEnvPath || '[NO .ENV FOUND]',
    cwd: process.cwd()
  };
}

/**
 * Logs safe startup diagnostics
 */
export function logSmtpDiagnostics() {
  const diag = getSmtpDiagnostics();
  console.log('\n📧 [AgroMed Email Service] SMTP Configuration Check:');
  console.log(`   - Environment File: ${diag.envFilePath}`);
  console.log(`   - Working Directory: ${diag.cwd}`);
  console.log(`   - SMTP Host:        ${diag.host} ${diag.host !== '[MISSING]' ? '✓' : '✗'}`);
  console.log(`   - SMTP Port:        ${diag.port} (secure: ${diag.secure})`);
  console.log(`   - SMTP User:        ${diag.user} ${diag.user !== '[MISSING]' ? '✓' : '✗'}`);
  console.log(`   - SMTP Password:    ${diag.hasPassword ? `[CONFIGURED - ${diag.passLength} chars]` : '[MISSING]'} ${diag.hasPassword ? '✓' : '✗'}`);
  console.log(`   - Email From:       ${diag.emailFrom}`);

  if (diag.isConfigured) {
    if (diag.isGmail && !diag.isLikelyAppPassword) {
      console.log('   ⚠️  NOTE FOR GMAIL: Google requires a 16-character App Password.');
      console.log(`      Your current password length is ${diag.passLength} chars.`);
      console.log('      If delivery fails with EAUTH (535), generate an App Password at:');
      console.log('      https://myaccount.google.com/apppasswords\n');
    } else {
      console.log('   ✓ Status: Ready to dispatch OTP verification emails.\n');
    }
  } else {
    console.log(`   ⚠️  Status: NOT FULLY CONFIGURED. Missing: ${diag.missingVars.join(', ')}`);
    console.log('      Add them to backend/.env to enable live OTP delivery.\n');
  }
}
