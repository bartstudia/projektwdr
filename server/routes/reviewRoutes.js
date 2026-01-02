const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsByLake,
  getMyReviews,
  updateReview,
  deleteReview,
  getAllReviews
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/lake/:lakeId', getReviewsByLake);

// Protected routes
router.use(protect);
router.post('/', createReview);
router.get('/my', getMyReviews);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

// Admin routes
router.get('/admin/all', adminOnly, getAllReviews);

module.exports = router;
