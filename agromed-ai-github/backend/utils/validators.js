/**
 * AgroMed AI - Input Validation & Normalization Utilities
 */

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates and normalizes an email address.
 *
 * @param {string} email
 * @returns {{ isValid: boolean, normalizedEmail: string, error?: string }}
 */
export function validateAndNormalizeEmail(email) {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      normalizedEmail: '',
      error: 'Email address is mandatory.'
    };
  }

  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return {
      isValid: false,
      normalizedEmail: '',
      error: 'Email address cannot be empty.'
    };
  }

  if (trimmed.length > 254) {
    return {
      isValid: false,
      normalizedEmail: trimmed.toLowerCase(),
      error: 'Email address exceeds maximum allowed length.'
    };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      isValid: false,
      normalizedEmail: trimmed.toLowerCase(),
      error: 'Please enter a valid email address (e.g. name@example.com).'
    };
  }

  // Ensure domain has a valid dot and at least 2 char TLD
  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return {
      isValid: false,
      normalizedEmail: trimmed.toLowerCase(),
      error: 'Invalid email format.'
    };
  }

  const domain = parts[1];
  if (!domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) {
    return {
      isValid: false,
      normalizedEmail: trimmed.toLowerCase(),
      error: 'Email must contain a valid domain name.'
    };
  }

  return {
    isValid: true,
    normalizedEmail: trimmed.toLowerCase(),
    error: null
  };
}

/**
 * Validates and normalizes an Indian mobile number.
 *
 * Requirements:
 * - Exactly 10 digits starting with 6, 7, 8, or 9
 * - Optionally accepts +91 or 91 country code
 * - Rejects alphabetic characters, symbols, and incomplete numbers
 *
 * @param {string} phone
 * @returns {{ isValid: boolean, normalizedPhone: string, raw10Digit: string, error?: string }}
 */
export function validateAndNormalizeIndianPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return {
      isValid: false,
      normalizedPhone: '',
      raw10Digit: '',
      error: 'Phone number is required.'
    };
  }

  const trimmed = phone.trim();
  if (trimmed.length === 0) {
    return {
      isValid: false,
      normalizedPhone: '',
      raw10Digit: '',
      error: 'Phone number cannot be empty.'
    };
  }

  // Check for invalid characters (only +, -, digits, spaces permitted)
  if (/[^\d+\-\s]/.test(trimmed)) {
    return {
      isValid: false,
      normalizedPhone: '',
      raw10Digit: '',
      error: 'Phone number cannot contain letters or special symbols.'
    };
  }

  // Strip spaces, dashes
  let cleaned = trimmed.replace(/[\s\-]/g, '');

  // Remove leading +91 or 91 if present
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    // Leading 0 trunk prefix
    cleaned = cleaned.substring(1);
  }

  // Now cleaned must be exactly 10 digits
  if (!/^\d{10}$/.test(cleaned)) {
    return {
      isValid: false,
      normalizedPhone: '',
      raw10Digit: cleaned,
      error: 'Indian mobile number must contain exactly 10 digits.'
    };
  }

  // Indian mobile numbers must begin with 6, 7, 8, or 9
  if (!/^[6-9]/.test(cleaned)) {
    return {
      isValid: false,
      normalizedPhone: '',
      raw10Digit: cleaned,
      error: 'Indian mobile number must start with 6, 7, 8, or 9.'
    };
  }

  return {
    isValid: true,
    normalizedPhone: `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`,
    raw10Digit: cleaned,
    error: null
  };
}
