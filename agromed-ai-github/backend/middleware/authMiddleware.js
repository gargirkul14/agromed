import { verifyToken } from '../utils/token.js';
import { db } from '../utils/db.js';

export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please sign in again.'
      });
    }

    const user = await db.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    // Attach user without password
    const { password, ...safeUser } = user;
    req.user = safeUser;

    // If farmer, attach farmerProfile if exists
    if (safeUser.role === 'FARMER') {
      const profile = await db.farmerProfile.findUnique({
        where: { userId: safeUser.id }
      });
      req.farmerProfile = profile || null;
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication processing error.'
    });
  }
}
