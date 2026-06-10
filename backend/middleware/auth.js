const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const memoryDb = require('../models/memoryDb');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nmnm_luxury_secret_key_12345');

      if (mongoose.connection.readyState === 1) {
        const dbUser = await User.findById(decoded.id).select('-password');
        if (dbUser) {
          req.user = {
            _id: dbUser._id,
            name: dbUser.name,
            email: dbUser.email,
            role: decoded.role || dbUser.role,
          };
        }
      } else {
        const memUser = memoryDb.users.find(u => u._id === decoded.id);
        if (memUser) {
          req.user = {
            _id: memUser._id,
            name: memUser.name,
            email: memUser.email,
            role: decoded.role || memUser.role,
          };
        }
      }
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
