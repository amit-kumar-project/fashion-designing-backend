import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { User } from '../models/UserSchema.js';

const extractToken = authHeader => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.split(' ')[1];
};

export const protect = async (req, res, next) => {
  try {
    if (!config.jwtSecret) {
      return res.status(500).json({
        success: false,
        error: 'JWT_SECRET is not configured'
      });
    }

    const token = extractToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token missing. Use Bearer <token>.'
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found for this token'
      });
    }

    req.user = {
      userId: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      name: user.name
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }

  return next();
};
