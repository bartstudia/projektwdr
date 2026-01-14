const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getReservationById,
  cancelReservation,
  getReservedDates,
  getReservedSpotsForDate,
  getAllReservations
} = require('../controllers/reservationController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes (dostępność stanowisk dla wszystkich)
router.get('/lake/:lakeId/date/:date', getReservedSpotsForDate);

// Protected routes
router.use(protect);

// User routes
router.post('/', createReservation);
router.get('/my', getMyReservations);
router.get('/spot/:spotId/reserved-dates', getReservedDates);
router.get('/:id', getReservationById);
router.put('/:id/cancel', cancelReservation);

// Admin routes
router.get('/admin/all', adminOnly, getAllReservations);

module.exports = router;
