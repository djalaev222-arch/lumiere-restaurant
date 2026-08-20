import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { signStaffToken } from '../lib/jwt.js';

// Bcrypt hash of a random value, used to keep comparison time constant when
// no account exists for the given email (avoids leaking valid emails via timing).
const DUMMY_HASH = '$2b$10$Hr8Jp4gk8l2OENe1JIHoe.S1y9jkmiVk22OxSLcPbpcM2R69iPVEq';

const COOKIE_NAME = 'admin_session';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 12 * 60 * 60 * 1000,
  path: '/',
};

export async function login(req, res, next) {
  try {
    const { email, password } = req.validated;

    const staff = await prisma.staff.findUnique({ where: { email } });
    const passwordMatches = await bcrypt.compare(password, staff?.passwordHash || DUMMY_HASH);

    if (!staff || !passwordMatches) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = signStaffToken(staff);
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
    res.json({
      success: true,
      data: { staff: { id: staff.id, email: staff.email, name: staff.name, role: staff.role } },
    });
  } catch (error) {
    next(error);
  }
}

export function logout(req, res) {
  res.clearCookie(COOKIE_NAME, { ...COOKIE_OPTIONS, maxAge: undefined });
  res.json({ success: true, data: null });
}

export async function me(req, res) {
  const { id, email, name, role } = req.staff;
  res.json({ success: true, data: { id, email, name, role } });
}

export { COOKIE_NAME };
