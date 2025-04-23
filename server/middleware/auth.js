const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User'); // Fixed import syntax

module.exports = function(req, res, next) {
  console.log('Auth middleware executed');
  
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // Use consistent JWT secret from config
    const jwtSecret = config.jwtSecret;
    console.log('Verifying token');
    
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    console.log('Token verified for user:', req.user.id);
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};