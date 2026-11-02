import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isMongoConnected } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'brahm_shakti_hospital_jwt_secret_key_2026_secured';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication token missing.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (isMongoConnected) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        // Fallback to decoded payload in demo/seed scenarios
        req.user = decoded;
      } else {
        req.user = user;
      }
    } else {
      req.user = decoded;
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Authentication required.'
      });
    }

    // superadmin always has access to everything
    if (req.user.role === 'superadmin') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles [${roles.join(', ')}]. Your role is ${req.user.role}.`
      });
    }

    next();
  };
};
