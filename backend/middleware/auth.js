const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;
  console.log('Auth middleware: Checking authorization headers');
  console.log('Auth middleware: Headers:', req.headers);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    console.log('Auth middleware: Token found in header');
  }

  // Make sure token exists
  if (!token) {
    console.log('Auth middleware: No token found');
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    console.log('Auth middleware: Verifying token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware: Token verified, user ID:', decoded.id);

    req.user = await User.findById(decoded.id);
    console.log('Auth middleware: User found:', req.user ? 'Yes' : 'No');
    next();
  } catch (err) {
    console.error('Auth middleware: Token verification failed:', err);
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
