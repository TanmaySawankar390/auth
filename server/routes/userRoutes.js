const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const config = require('../config/config');

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      status: 'pending' // All new registrations start as pending
    });

    await user.save();

    res.status(201).json({ 
      message: 'Registration successful. Your account is pending admin approval.' 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is approved
    if (user.status === 'pending') {
      return res.status(403).json({ 
        message: 'Your account is pending approval by an administrator' 
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ 
        message: 'Your registration has been rejected' 
      });
    }

    // Create token payload
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // Generate token
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error retrieving user data' });
  }
});

// Get all pending users (Admin only)
router.get('/pending', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayApproved = await User.countDocuments({
      status: 'active',
      updatedAt: { $gte: today }
    });
    
    const todayRejected = await User.countDocuments({
      status: 'rejected',
      updatedAt: { $gte: today }
    });
    
    res.json({
      users,
      todayStats: {
        approved: todayApproved,
        rejected: todayRejected
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error fetching pending users' });
  }
});

// Update user status (Admin only)
router.put('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.status = status;
    user.updatedAt = new Date();
    
    await user.save();
    
    res.json({ 
      message: `User has been ${status === 'active' ? 'approved' : 'rejected'}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error updating user status' });
  }
});

module.exports = router;