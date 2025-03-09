const express = require('express');
const { 
  protectCustomer, 
  protectAdmin, 
  checkPermission 
} = require('../middleware/authMiddleware');
const {
  createBooking,
  verifyPayment,
  getMyBookings,
  getBooking,
  cancelBooking,
  getBookingStats
} = require('../controllers/bookingController');

const router = express.Router();

// All routes require customer authentication
router.use(protectCustomer);

// Customer routes
router.post('/', createBooking);
router.post('/verify-payment', verifyPayment);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBooking);
router.post('/:id/cancel', cancelBooking);

// Admin routes
router.use(protectAdmin);
router.get('/stats', checkPermission('manageBookings'), getBookingStats);

module.exports = router;
