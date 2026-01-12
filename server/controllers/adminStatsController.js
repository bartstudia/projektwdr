const Lake = require('../models/Lake');
const FishingSpot = require('../models/FishingSpot');
const Reservation = require('../models/Reservation');
const Review = require('../models/Review');

// @desc    Pobierz statystyki dla panelu admina
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reviewsSince = new Date();
    reviewsSince.setDate(reviewsSince.getDate() - 7);

    const [
      lakesCount,
      spotsCount,
      activeReservations,
      newReviews
    ] = await Promise.all([
      Lake.countDocuments(),
      FishingSpot.countDocuments(),
      Reservation.countDocuments({
        status: 'confirmed',
        date: { $gte: today }
      }),
      Review.countDocuments({
        createdAt: { $gte: reviewsSince }
      })
    ]);

    res.json({
      success: true,
      stats: {
        lakesCount,
        spotsCount,
        activeReservations,
        newReviews,
        reviewsSince: reviewsSince.toISOString()
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      message: 'Blad podczas pobierania statystyk'
    });
  }
};
