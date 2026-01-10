const FishingSpot = require('../models/FishingSpot');
const Lake = require('../models/Lake');

// @desc    Pobierz wszystkie stanowiska dla jeziora
// @route   GET /api/spots/lake/:lakeId
// @access  Public
exports.getSpotsByLake = async (req, res) => {
  try {
    const spots = await FishingSpot.find({
      lakeId: req.params.lakeId,
      isActive: true
    }).sort({ name: 1 });

    res.json({
      success: true,
      count: spots.length,
      spots
    });
  } catch (error) {
    console.error('Get spots error:', error);
    res.status(500).json({
      message: 'Błąd podczas pobierania stanowisk'
    });
  }
};

// @desc    Pobierz pojedyncze stanowisko
// @route   GET /api/spots/:id
// @access  Public
exports.getSpotById = async (req, res) => {
  try {
    const spot = await FishingSpot.findById(req.params.id)
      .populate('lakeId', 'name location');

    if (!spot) {
      return res.status(404).json({
        message: 'Stanowisko nie znalezione'
      });
    }

    res.json({
      success: true,
      spot
    });
  } catch (error) {
    console.error('Get spot error:', error);
    res.status(500).json({
      message: 'Błąd podczas pobierania stanowiska'
    });
  }
};

// @desc    Utwórz nowe stanowisko
// @route   POST /api/spots
// @access  Private (Admin)
exports.createSpot = async (req, res) => {
  try {
    const { lakeId, name, description, mapCoordinates, gpsLink, latitude, longitude } = req.body;

    // Walidacja
    if (!lakeId || !name || !mapCoordinates) {
      return res.status(400).json({
        message: 'Proszę podać wszystkie wymagane dane: lakeId, name, mapCoordinates'
      });
    }

    // Sprawdź czy jezioro istnieje
    const lake = await Lake.findById(lakeId);
    if (!lake) {
      return res.status(404).json({
        message: 'Jezioro nie znalezione'
      });
    }

    // Walidacja mapCoordinates
    if (!mapCoordinates.shape || !mapCoordinates.coords) {
      return res.status(400).json({
        message: 'mapCoordinates musi zawierać shape i coords'
      });
    }

    // Utwórz stanowisko
    const spot = await FishingSpot.create({
      lakeId,
      name,
      description,
      mapCoordinates,
      gpsLink: gpsLink || null,
      latitude: latitude !== undefined ? latitude : null,
      longitude: longitude !== undefined ? longitude : null
    });

    res.status(201).json({
      success: true,
      message: 'Stanowisko utworzone pomyślnie',
      spot
    });
  } catch (error) {
    console.error('Create spot error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Błąd walidacji',
        errors: messages
      });
    }

    res.status(500).json({
      message: 'Błąd podczas tworzenia stanowiska'
    });
  }
};

// @desc    Zaktualizuj stanowisko
// @route   PUT /api/spots/:id
// @access  Private (Admin)
exports.updateSpot = async (req, res) => {
  try {
    const { name, description, mapCoordinates, isActive, gpsLink, latitude, longitude } = req.body;

    const spot = await FishingSpot.findById(req.params.id);

    if (!spot) {
      return res.status(404).json({
        message: 'Stanowisko nie znalezione'
      });
    }

    // Aktualizuj pola
    if (name) spot.name = name;
    if (description !== undefined) spot.description = description;
    if (mapCoordinates) spot.mapCoordinates = mapCoordinates;
    if (isActive !== undefined) spot.isActive = isActive;
    if (gpsLink !== undefined) spot.gpsLink = gpsLink || null;
    if (latitude !== undefined) spot.latitude = latitude;
    if (longitude !== undefined) spot.longitude = longitude;

    await spot.save();

    res.json({
      success: true,
      message: 'Stanowisko zaktualizowane pomyślnie',
      spot
    });
  } catch (error) {
    console.error('Update spot error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Błąd walidacji',
        errors: messages
      });
    }

    res.status(500).json({
      message: 'Błąd podczas aktualizacji stanowiska'
    });
  }
};

// @desc    Usuń stanowisko
// @route   DELETE /api/spots/:id
// @access  Private (Admin)
exports.deleteSpot = async (req, res) => {
  try {
    const spot = await FishingSpot.findById(req.params.id);

    if (!spot) {
      return res.status(404).json({
        message: 'Stanowisko nie znalezione'
      });
    }

    await spot.deleteOne();

    res.json({
      success: true,
      message: 'Stanowisko usunięte pomyślnie'
    });
  } catch (error) {
    console.error('Delete spot error:', error);
    res.status(500).json({
      message: 'Błąd podczas usuwania stanowiska'
    });
  }
};

// @desc    Pobierz wszystkie stanowiska (admin)
// @route   GET /api/spots
// @access  Private (Admin)
exports.getAllSpots = async (req, res) => {
  try {
    const spots = await FishingSpot.find()
      .populate('lakeId', 'name location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: spots.length,
      spots
    });
  } catch (error) {
    console.error('Get all spots error:', error);
    res.status(500).json({
      message: 'Błąd podczas pobierania stanowisk'
    });
  }
};
