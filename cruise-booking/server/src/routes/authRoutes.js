const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protectRoute } = require('../middleware/authMiddleware');

// Public routes
router.post('/request-otp', authController.requestOtp);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.use(protectRoute); // Apply protection to all routes below
router.get('/profile', authController.getProfile);
router.post('/logout', authController.logout);

module.exports = router;
