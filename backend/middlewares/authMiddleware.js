const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Protect routes middleware
exports.protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

      // Get admin from the token (exclude password)
      req.admin = await Admin.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Error in auth middleware:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin role middleware
exports.admin = (req, res, next) => {
  if (req.admin && req.admin.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};
