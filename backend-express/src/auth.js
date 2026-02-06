import jwt from 'jsonwebtoken';
import { readData } from './db.js';

const createToken = (user) => {
  const payload = { id: user.id, email: user.email, is_admin: user.is_admin === true };
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const data = readData();
    const user = data.users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.is_admin !== true) {
    return res.status(403).json({ status: 'error', message: 'Forbidden' });
  }
  return next();
};

export { createToken, authMiddleware, adminMiddleware };
