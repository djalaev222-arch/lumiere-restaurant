import { verifyStaffToken } from '../lib/jwt.js';
import { prisma } from '../lib/prisma.js';

const COOKIE_NAME = 'admin_session';

export async function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  try {
    const payload = verifyStaffToken(token);
    const staff = await prisma.staff.findUnique({ where: { id: payload.sub } });
    if (!staff) {
      return res.status(401).json({ success: false, error: 'Invalid session' });
    }
    req.staff = staff;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.staff || !roles.includes(req.staff.role)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }
    next();
  };
}
