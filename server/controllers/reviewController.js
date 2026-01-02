const Review = require('../models/Review');
const Lake = require('../models/Lake');
const Reservation = require('../models/Reservation');

// @desc    Utwórz nową opinię
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { lakeId, rating, comment } = req.body;
    const userId = req.userId;

    // Walidacja danych wejściowych
    if (!lakeId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Wszystkie pola (lakeId, rating, comment) są wymagane'
      });
    }

    // Sprawdź czy jezioro istnieje
    const lake = await Lake.findById(lakeId);
    if (!lake) {
      return res.status(404).json({
        success: false,
        message: 'Jezioro nie zostało znalezione'
      });
    }

    // Sprawdź czy użytkownik miał rezerwację na tym jeziorze
    const hasReservation = await Reservation.findOne({
      userId,
      lakeId,
      status: 'confirmed'
    });

    if (!hasReservation) {
      return res.status(403).json({
        success: false,
        message: 'Możesz wystawiać opinie tylko dla jezior, w których miałeś rezerwację'
      });
    }

    // Sprawdź czy użytkownik nie dodał już opinii dla tego jeziora
    const existingReview = await Review.findOne({ userId, lakeId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Już dodałeś opinię dla tego jeziora. Możesz ją edytować.'
      });
    }

    // Utwórz opinię
    const review = await Review.create({
      userId,
      lakeId,
      rating,
      comment
    });

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'name')
      .populate('lakeId', 'name location');

    res.status(201).json({
      success: true,
      review: populatedReview
    });

  } catch (error) {
    console.error('Błąd podczas tworzenia opinii:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Wystąpił błąd podczas tworzenia opinii'
    });
  }
};

// @desc    Pobierz wszystkie opinie dla jeziora
// @route   GET /api/reviews/lake/:lakeId
// @access  Public
exports.getReviewsByLake = async (req, res) => {
  try {
    const { lakeId } = req.params;

    const reviews = await Review.find({ lakeId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    // Oblicz średnią ocenę
    const stats = await Review.calculateAverageRating(lakeId);

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews,
      reviews
    });

  } catch (error) {
    console.error('Błąd podczas pobierania opinii:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas pobierania opinii'
    });
  }
};

// @desc    Pobierz opinie użytkownika
// @route   GET /api/reviews/my
// @access  Private
exports.getMyReviews = async (req, res) => {
  try {
    const userId = req.userId;

    const reviews = await Review.find({ userId })
      .populate('lakeId', 'name location imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {
    console.error('Błąd podczas pobierania opinii:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas pobierania opinii'
    });
  }
};

// @desc    Zaktualizuj opinię
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.userId;

    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Opinia nie została znaleziona'
      });
    }

    // Sprawdź czy użytkownik jest właścicielem opinii
    if (review.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Brak uprawnień do edycji tej opinii'
      });
    }

    // Aktualizuj tylko jeśli podano nowe wartości
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate('userId', 'name')
      .populate('lakeId', 'name location');

    res.status(200).json({
      success: true,
      message: 'Opinia została zaktualizowana',
      review: updatedReview
    });

  } catch (error) {
    console.error('Błąd podczas aktualizacji opinii:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Wystąpił błąd podczas aktualizacji opinii'
    });
  }
};

// @desc    Usuń opinię
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Opinia nie została znaleziona'
      });
    }

    // Sprawdź czy użytkownik jest właścicielem opinii lub adminem
    if (review.userId.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Brak uprawnień do usunięcia tej opinii'
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Opinia została usunięta'
    });

  } catch (error) {
    console.error('Błąd podczas usuwania opinii:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas usuwania opinii'
    });
  }
};

// @desc    Pobierz wszystkie opinie (ADMIN)
// @route   GET /api/reviews/admin/all
// @access  Private/Admin
exports.getAllReviews = async (req, res) => {
  try {
    const { lakeId } = req.query;

    let query = {};
    if (lakeId) {
      query.lakeId = lakeId;
    }

    const reviews = await Review.find(query)
      .populate('userId', 'name email')
      .populate('lakeId', 'name location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {
    console.error('Błąd podczas pobierania wszystkich opinii:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas pobierania opinii'
    });
  }
};
