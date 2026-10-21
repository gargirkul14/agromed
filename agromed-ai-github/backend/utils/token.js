import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'agromed_default_jwt_secret_academic_2026';
const JWT_EXPIRES_IN = '7d';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
