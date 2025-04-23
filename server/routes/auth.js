const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const axios = require('axios');
const config = require('../config/config'); // Unified config

// Register user
router.post(
  '/register',
  [
    // Validation middleware
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('state').notEmpty().withMessage('State is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('captchaToken').notEmpty().withMessage('Captcha verification failed'),
  ],
  async (req, res) => {
    console.log('Registration endpoint hit');
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, state, city, captchaToken } = req.body;
    console.log(`Attempting to register user: ${email}`);

    try {
      // Verify Google reCAPTCHA
      console.log('Verifying reCAPTCHA token');
      const recaptchaSecretKey = config.recaptchaSecret;
      
      if (!recaptchaSecretKey) {
        console.error('RECAPTCHA_SECRET_KEY not found in config');
        return res.status(500).json({ 
          success: false, 
          msg: 'Server configuration error - reCAPTCHA not configured' 
        });
      }
      
      try {
        const captchaResponse = await axios.post(
          `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${captchaToken}`
        );

        console.log('reCAPTCHA response:', captchaResponse.data);

        if (!captchaResponse.data.success) {
          console.log('reCAPTCHA verification failed');
          return res.status(400).json({ 
            success: false, 
            msg: 'reCAPTCHA verification failed' 
          });
        }
      } catch (captchaError) {
        console.error('reCAPTCHA verification error:', captchaError);
        return res.status(500).json({ 
          success: false, 
          msg: 'reCAPTCHA verification service error' 
        });
      }

      // Check if user already exists
      console.log('Checking if user already exists');
      let user = await User.findOne({ email });
      if (user) {
        console.log('User already exists with email:', email);
        return res.status(400).json({ 
          success: false, 
          msg: 'User already exists' 
        });
      }

      // Create new user
      console.log('Creating new user');
      user = new User({
        name,
        email,
        password,
        state,
        city,
      });

      await user.save();
      console.log('User saved successfully with ID:', user._id);

      res.status(201).json({
        success: true,
        msg: 'Registration successful! Please wait for admin approval.',
        userId: user._id
      });
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.name === 'ValidationError') {
        // Handle Mongoose validation errors
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ 
          success: false, 
          msg: messages.join(', ') 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        msg: 'Server error during registration' 
      });
    }
  }
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  async (req, res) => {
    console.log('Login endpoint hit');
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log(`Login attempt for user: ${email}`);

    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found with email:', email);
        return res.status(400).json({ 
          success: false, 
          msg: 'Invalid credentials' 
        });
      }

      // Check if password matches
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log('Password does not match for user:', email);
        return res.status(400).json({ 
          success: false, 
          msg: 'Invalid credentials' 
        });
      }

      // Check if user is approved
      if (!user.isApproved) {
        console.log('User not yet approved:', email);
        return res.status(403).json({
          success: false,
          msg: 'Your account is pending approval. Please wait for admin approval.',
        });
      }

      console.log('User authenticated successfully:', email);

      // Generate JWT token - use consistent JWT secret
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: '1h' },
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
      console.error('Login error:', err);
      res.status(500).json({ 
        success: false, 
        msg: 'Server error during login' 
      });
    }
  }
);

module.exports = router;