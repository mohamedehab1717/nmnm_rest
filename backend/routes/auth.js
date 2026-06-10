const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const memoryDb = require('../models/memoryDb');

const generateToken = (id, role = 'user') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'nmnm_luxury_secret_key_12345', {
    expiresIn: '30d',
  });
};

const getStaffPin = () => process.env.STAFF_ACCESS_PIN || 'nmnm-staff-2026';

const resolveLoginRole = (dbRole, staffLogin, staffPin) => {
  if (!staffLogin) {
    return 'user';
  }

  if (!staffPin) {
    return null;
  }

  if (staffPin !== getStaffPin()) {
    return null;
  }

  if (dbRole !== 'admin') {
    return null;
  }

  return 'admin';
};

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    // Check if exists
    if (isDbConnected) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }
    } else {
      const userExists = memoryDb.users.find(u => u.email === email.toLowerCase());
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }
    }

    let user;
    if (isDbConnected) {
      user = await User.create({ name, email, password, role: 'user' });
    } else {
      const newUserId = 'u' + (memoryDb.users.length + 1);
      user = {
        _id: newUserId,
        name,
        email: email.toLowerCase(),
        passwordHash: bcrypt.hashSync(password, 10),
        role: 'user',
      };
      memoryDb.users.push(user);
    }

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: 'user',
      token: generateToken(user._id, 'user'),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password, staffLogin = false, staffPin } = req.body;

  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let user = null;
    let passwordValid = false;

    if (isDbConnected) {
      user = await User.findOne({ email }).select('+password');
      passwordValid = user && (await user.matchPassword(password));
    } else {
      user = memoryDb.users.find(u => u.email === email.toLowerCase());
      passwordValid = user && bcrypt.compareSync(password, user.passwordHash);
    }

    if (passwordValid && user) {
      const sessionRole = resolveLoginRole(user.role, staffLogin, staffPin);

      if (staffLogin && sessionRole === null) {
        return res.status(403).json({
          success: false,
          message: 'Invalid staff access code or this account is not authorized for staff login.',
        });
      }

      return res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: sessionRole,
        token: generateToken(user._id, sessionRole),
      });
    }

    res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
