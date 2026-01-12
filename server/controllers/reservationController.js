const Reservation = require('../models/Reservation');
const FishingSpot = require('../models/FishingSpot');
const Lake = require('../models/Lake');
const mongoose = require('mongoose');

// @desc    Utwórz nową rezerwację
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { spotId, lakeId, date, notes } = req.body;
    const userId = req.userId;

    // Walidacja danych wejściowych
    if (!spotId || !lakeId || !date) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Wszystkie pola (spotId, lakeId, date) są wymagane'
      });
    }

    // Sprawdź czy stanowisko istnieje i jest aktywne
    const spot = await FishingSpot.findById(spotId).session(session);
    if (!spot) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Stanowisko nie zostało znalezione'
      });
    }

    if (!spot.isActive) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'To stanowisko jest obecnie nieaktywne'
      });
    }

    // Sprawdź czy jezioro istnieje
    const lake = await Lake.findById(lakeId).session(session);
    if (!lake) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Jezioro nie zostało znalezione'
      });
    }

    // Sprawdź czy data nie jest w przeszłości
    const reservationDate = new Date(date);
    reservationDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (reservationDate < today) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Nie można zarezerwować stanowiska w przeszłości'
      });
    }

    // Sprawdź dostępność stanowiska (dodatkowa walidacja przed utworzeniem)
    const isAvailable = await Reservation.isSpotAvailable(spotId, reservationDate);
    if (!isAvailable) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        success: false,
        message: 'To stanowisko jest już zarezerwowane na wybrany dzień'
      });
    }

    // Utwórz rezerwację
    const reservation = await Reservation.create([{
      userId,
      spotId,
      lakeId,
      date: reservationDate,
      notes,
      status: 'confirmed'
    }], { session });

    // Commit transakcji
    await session.commitTransaction();
    session.endSession();

    // Pobierz pełne dane rezerwacji z populacją
    const populatedReservation = await Reservation.findById(reservation[0]._id)
      .populate('userId', 'name email')
      .populate('spotId', 'name description')
      .populate('lakeId', 'name location');

    res.status(201).json({
      success: true,
      reservation: populatedReservation
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Obsługa błędu duplikatu (podwójna rezerwacja)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'To stanowisko jest już zarezerwowane na wybrany dzień'
      });
    }

    console.error('Błąd podczas tworzenia rezerwacji:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas tworzenia rezerwacji'
    });
  }
};

// @desc    Pobierz wszystkie rezerwacje użytkownika
// @route   GET /api/reservations/my
// @access  Private
exports.getMyReservations = async (req, res) => {
  try {
    const userId = req.userId;
    const { status, upcoming } = req.query;

    let query = { userId };

    // Filtruj po statusie jeśli podano
    if (status) {
      query.status = status;
    }

    // Filtruj nadchodzące rezerwacje
    if (upcoming === 'true') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.date = { $gte: today };
    }

    const reservations = await Reservation.find(query)
      .populate('spotId', 'name description')
      .populate('lakeId', 'name location imageUrl')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations
    });

  } catch (error) {
    console.error('Błąd podczas pobierania rezerwacji:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas pobierania rezerwacji'
    });
  }
};

// @desc    Pobierz pojedynczą rezerwację
// @route   GET /api/reservations/:id
// @access  Private
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('spotId', 'name description mapCoordinates')
      .populate('lakeId', 'name location imageUrl');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Rezerwacja nie została znaleziona'
      });
    }

    // Sprawdź czy użytkownik ma dostęp do rezerwacji (własna lub admin)
    if (reservation.userId._id.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Brak uprawnień do tej rezerwacji'
      });
    }

    res.status(200).json({
      success: true,
      reservation
    });

  } catch (error) {
    console.error('Błąd podczas pobierania rezerwacji:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas pobierania rezerwacji'
    });
  }
};

// @desc    Anuluj rezerwację
// @route   PUT /api/reservations/:id/cancel
// @access  Private
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Rezerwacja nie została znaleziona'
      });
    }

    // Sprawdź czy użytkownik ma dostęp do rezerwacji (własna lub admin)
    if (reservation.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Brak uprawnień do anulowania tej rezerwacji'
      });
    }

    // Sprawdź czy rezerwacja nie jest już anulowana
    if (reservation.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Ta rezerwacja jest już anulowana'
      });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    const updatedReservation = await Reservation.findById(reservation._id)
      .populate('spotId', 'name description')
      .populate('lakeId', 'name location');

    res.status(200).json({
      success: true,
      message: 'Rezerwacja została anulowana',
      reservation: updatedReservation
    });

  } catch (error) {
    console.error('Błąd podczas anulowania rezerwacji:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas anulowania rezerwacji'
    });
  }
};

// @desc    Pobierz zajęte daty dla stanowiska
// @route   GET /api/reservations/spot/:spotId/reserved-dates
// @access  Private
exports.getReservedDates = async (req, res) => {
  try {
    const { spotId } = req.params;
    const { startDate, endDate } = req.query;

    // Walidacja dat
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Parametry startDate i endDate są wymagane'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: 'Data rozpoczęcia nie może być późniejsza niż data zakończenia'
      });
    }

    // Sprawdź czy stanowisko istnieje
    const spot = await FishingSpot.findById(spotId);
    if (!spot) {
      return res.status(404).json({
        success: false,
        message: 'Stanowisko nie zostało znalezione'
      });
    }

    const reservedDates = await Reservation.getReservedDates(spotId, start, end);

    res.status(200).json({
      success: true,
      spotId,
      reservedDates
    });

  } catch (error) {
    console.error('Błąd podczas pobierania zajętych dat:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas pobierania zajętych dat'
    });
  }
};

// @desc    Pobierz zarezerwowane stanowiska dla jeziora w danym dniu
// @route   GET /api/reservations/lake/:lakeId/date/:date
// @access  Public
exports.getReservedSpotsForDate = async (req, res) => {
  try {
    const { lakeId, date } = req.params;

    // Normalizuj datę do początku dnia
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Znajdź wszystkie potwierdzone rezerwacje dla tego jeziora w tym dniu
    const reservations = await Reservation.find({
      lakeId,
      date: {
        $gte: targetDate,
        $lte: endOfDay
      },
      status: { $ne: 'cancelled' }
    }).select('spotId');

    // Wyciągnij listę zarezerwowanych spotId
    const reservedSpotIds = reservations.map(r => r.spotId.toString());

    res.status(200).json({
      success: true,
      date: targetDate,
      reservedSpotIds
    });

  } catch (error) {
    console.error('Błąd podczas pobierania zarezerwowanych stanowisk:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas pobierania dostępności'
    });
  }
};

// @desc    Pobierz dostępność jeziora w zakresie dat
// @route   GET /api/reservations/lake/:lakeId/availability?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
// @access  Public
exports.getLakeAvailability = async (req, res) => {
  try {
    const { lakeId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Parametry startDate i endDate są wymagane'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: 'Data rozpoczęcia nie może być późniejsza niż data zakończenia'
      });
    }

    const startOfDay = new Date(start);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999);

    const totalSpots = await FishingSpot.countDocuments({ lakeId, isActive: true });

    if (totalSpots === 0) {
      return res.status(200).json({
        success: true,
        totalSpots: 0,
        availability: {}
      });
    }

    const reservations = await Reservation.aggregate([
      {
        $match: {
          lakeId: new mongoose.Types.ObjectId(lakeId),
          date: { $gte: startOfDay, $lte: endOfDay },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          reservedCount: { $sum: 1 }
        }
      }
    ]);

    const availability = reservations.reduce((acc, entry) => {
      const reservedCount = entry.reservedCount || 0;
      acc[entry._id] = {
        reservedCount,
        availableCount: Math.max(totalSpots - reservedCount, 0)
      };
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      totalSpots,
      availability
    });
  } catch (error) {
    console.error('Błąd podczas pobierania dostępności jeziora:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas pobierania dostępności'
    });
  }
};

// @desc    Pobierz wszystkie rezerwacje (ADMIN)
// @route   GET /api/reservations/admin/all
// @access  Private/Admin
exports.getAllReservations = async (req, res) => {
  try {
    const { status, lakeId, startDate, endDate } = req.query;

    let query = {};

    // Filtruj po statusie
    if (status) {
      query.status = status;
    }

    // Filtruj po jeziorze
    if (lakeId) {
      query.lakeId = lakeId;
    }

    // Filtruj po zakresie dat
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const reservations = await Reservation.find(query)
      .populate('userId', 'name email')
      .populate('spotId', 'name')
      .populate('lakeId', 'name location')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations
    });

  } catch (error) {
    console.error('Błąd podczas pobierania wszystkich rezerwacji:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas pobierania rezerwacji'
    });
  }
};
