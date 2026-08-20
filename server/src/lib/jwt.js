import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error('JWT_SECRET is not configured');
}

export function signStaffToken(staff) {
  return jwt.sign({ sub: staff.id, role: staff.role }, SECRET, { expiresIn: '12h' });
}

export function verifyStaffToken(token) {
  return jwt.verify(token, SECRET);
}
