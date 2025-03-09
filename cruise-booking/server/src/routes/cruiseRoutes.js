const express = require('express');
const { 
  protectCustomer, 
  protectAdmin, 
  checkPermission 
} = require('../middleware/authMiddleware');
const {
  getCruises,
  getCruise,
  createCruise,
  updateCruise,
  deleteCruise,
  searchByDestination,
  getAvailableDates,
  addReview,
  getCruiseReviews
} = require('../controllers/cruiseController');

const router = express.Router();

// Public routes
router.get('/', getCruises);
router.get('/search', searchByDestination);
router.get('/:id', getCruise);
router.get('/:id/available-dates', getAvailableDates);
router.get('/:id/reviews', getCruiseReviews);

// Protected customer routes
router.use(protectCustomer);
router.post('/:id/reviews', addReview);

// Protected admin routes
router.use(protectAdmin);
router.post('/', checkPermission('manageCruises'), createCruise);
router.patch('/:id', checkPermission('manageCruises'), updateCruise);
router.delete('/:id', checkPermission('manageCruises'), deleteCruise);

module.exports = router;
