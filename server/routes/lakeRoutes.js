const express = require('express');
const router = express.Router();
const lakeController = require('../controllers/lakeController');
const { auth } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', lakeController.getAllLakes);
router.get('/:id', lakeController.getLakeById);

// Admin routes
router.post('/', auth, adminAuth, lakeController.createLake);
router.put('/:id', auth, adminAuth, lakeController.updateLake);
router.delete('/:id', auth, adminAuth, lakeController.deleteLake);
router.post('/:id/image', auth, adminAuth, upload.single('image'), lakeController.uploadLakeImage);

module.exports = router;
