const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

const protectRoute = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await Customer.findById(decoded.userId).select('-__v');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const protectCustomer = async (req, res, next) => {
  try {
    await protectRoute(req, res, () => {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized as a customer' });
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};

const protectAdmin = async (req, res, next) => {
  try {
    await protectRoute(req, res, () => {
      if (!req.user || !req.user.isAdmin) {
        return res.status(401).json({ message: 'Not authorized as an admin' });
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    next();
  };
};

module.exports = {
  protectRoute,
  protectCustomer,
  protectAdmin,
  checkPermission
};
