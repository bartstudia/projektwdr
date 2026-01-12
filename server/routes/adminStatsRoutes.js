const express = require('express');
const { auth } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { getAdminStats } = require('../controllers/adminStatsController');

const router = express.Router();

router.get('/stats', auth, adminAuth, getAdminStats);

module.exports = router;
