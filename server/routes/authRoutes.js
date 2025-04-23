const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config'); // Unified config

// Admin login
router.post('/admin/login', async (req, res) => {
  console.log('Admin login endpoint hit');
  const { email, password } = req.body;
  
  try {
    console.log(`Admin login attempt for: ${email}`);
    // Check if user exists and is admin
    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin') {
      console.log(`Invalid admin login: ${email} - user doesn't exist or is not admin`);
      return res.status(400).json({ 
        success: false, 
        msg: 'Invalid admin credentials' 
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Invalid admin login: ${email} - password mismatch`);
      return res.status(400).json({ 
        success: false, 
        msg: 'Invalid admin credentials' 
      });
    }
    
    console.log(`Admin login successful: ${email}`);
    
    // Create token payload
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };
    
    // Generate token - use consistent JWT secret
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) {
          console.error('JWT generation error:', err);
          throw err;
        }
        res.json({
          success: true,
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
    console.error('Admin login error:', err);
    res.status(500).json({ 
      success: false, 
      msg: 'Server error during admin login' 
    });
  }
});

module.exports = router;