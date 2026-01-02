const express = require('express');
const router = express.Router();
const spotController = require('../controllers/spotController');
const { auth } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Public routes
router.get('/lake/:lakeId', spotController.getSpotsByLake);
router.get('/:id', spotController.getSpotById);

// Admin routes
router.get('/', auth, adminAuth, spotController.getAllSpots);
router.post('/', auth, adminAuth, spotController.createSpot);
router.put('/:id', auth, adminAuth, spotController.updateSpot);
router.delete('/:id', auth, adminAuth, spotController.deleteSpot);

module.exports = router;
