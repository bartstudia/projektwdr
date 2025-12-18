const Lake = require('../models/Lake');
const FishingSpot = require('../models/FishingSpot');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// @desc    Pobierz wszystkie jeziora
// @route   GET /api/lakes
// @access  Public
exports.getAllLakes = async (req, res) => {
  try {
    const lakes = await Lake.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: lakes.length,
      lakes
    });
  } catch (error) {
    console.error('Get lakes error:', error);
    res.status(500).json({
      message: 'Błąd podczas pobierania jezior'
    });
  }
};

// @desc    Pobierz pojedyncze jezioro ze stanowiskami
// @route   GET /api/lakes/:id
// @access  Public
exports.getLakeById = async (req, res) => {
  try {
    const lake = await Lake.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!lake) {
      return res.status(404).json({
        message: 'Jezioro nie znalezione'
      });
    }

    // Pobierz stanowiska dla tego jeziora
    const spots = await FishingSpot.find({ lakeId: lake._id, isActive: true });

    res.json({
      success: true,
      lake,
      spots
    });
  } catch (error) {
    console.error('Get lake error:', error);
    res.status(500).json({
      message: 'Błąd podczas pobierania jeziora'
    });
  }
};

// @desc    Utwórz nowe jezioro
// @route   POST /api/lakes
// @access  Private (Admin)
exports.createLake = async (req, res) => {
  try {
    const { name, description, location } = req.body;

    // Walidacja
    if (!name || !description || !location) {
      return res.status(400).json({
        message: 'Proszę podać wszystkie wymagane dane: nazwa, opis, lokalizacja'
      });
    }

    // Sprawdź czy jezioro o tej nazwie już istnieje
    const existingLake = await Lake.findOne({ name });
    if (existingLake) {
      return res.status(400).json({
        message: 'Jezioro o tej nazwie już istnieje'
      });
    }

    // Utwórz jezioro
    const lake = await Lake.create({
      name,
      description,
      location,
      createdBy: req.userId
    });

    res.status(201).json({
      success: true,
      message: 'Jezioro utworzone pomyślnie',
      lake
    });
  } catch (error) {
    console.error('Create lake error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Błąd walidacji',
        errors: messages
      });
    }

    res.status(500).json({
      message: 'Błąd podczas tworzenia jeziora'
    });
  }
};

// @desc    Zaktualizuj jezioro
// @route   PUT /api/lakes/:id
// @access  Private (Admin)
exports.updateLake = async (req, res) => {
  try {
    const { name, description, location } = req.body;

    const lake = await Lake.findById(req.params.id);

    if (!lake) {
      return res.status(404).json({
        message: 'Jezioro nie znalezione'
      });
    }

    // Jeśli zmieniamy nazwę, sprawdź czy nowa nazwa nie jest zajęta
    if (name && name !== lake.name) {
      const existingLake = await Lake.findOne({ name });
      if (existingLake) {
        return res.status(400).json({
          message: 'Jezioro o tej nazwie już istnieje'
        });
      }
    }

    // Aktualizuj pola
    if (name) lake.name = name;
    if (description) lake.description = description;
    if (location) lake.location = location;

    await lake.save();

    res.json({
      success: true,
      message: 'Jezioro zaktualizowane pomyślnie',
      lake
    });
  } catch (error) {
    console.error('Update lake error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Błąd walidacji',
        errors: messages
      });
    }

    res.status(500).json({
      message: 'Błąd podczas aktualizacji jeziora'
    });
  }
};

// @desc    Usuń jezioro
// @route   DELETE /api/lakes/:id
// @access  Private (Admin)
exports.deleteLake = async (req, res) => {
  try {
    const lake = await Lake.findById(req.params.id);

    if (!lake) {
      return res.status(404).json({
        message: 'Jezioro nie znalezione'
      });
    }

    // Usuń powiązane stanowiska
    await FishingSpot.deleteMany({ lakeId: lake._id });

    // Usuń obraz jeśli istnieje
    if (lake.imageUrl) {
      const imagePath = path.join(__dirname, '..', lake.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await lake.deleteOne();

    res.json({
      success: true,
      message: 'Jezioro usunięte pomyślnie'
    });
  } catch (error) {
    console.error('Delete lake error:', error);
    res.status(500).json({
      message: 'Błąd podczas usuwania jeziora'
    });
  }
};

// @desc    Upload obrazu jeziora
// @route   POST /api/lakes/:id/image
// @access  Private (Admin)
exports.uploadLakeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Proszę wybrać plik obrazu'
      });
    }

    const lake = await Lake.findById(req.params.id);

    if (!lake) {
      // Usuń uploadowany plik jeśli jezioro nie istnieje
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        message: 'Jezioro nie znalezione'
      });
    }

    // Usuń stary obraz jeśli istnieje
    if (lake.imageUrl) {
      const oldImagePath = path.join(__dirname, '..', lake.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Pobierz wymiary obrazu używając sharp
    const metadata = await sharp(req.file.path).metadata();

    // Zapisz ścieżkę do obrazu i wymiary
    lake.imageUrl = '/uploads/lakes/' + req.file.filename;
    lake.imageWidth = metadata.width;
    lake.imageHeight = metadata.height;

    await lake.save();

    res.json({
      success: true,
      message: 'Obraz przesłany pomyślnie',
      lake
    });
  } catch (error) {
    console.error('Upload image error:', error);

    // Usuń plik w przypadku błędu
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: 'Błąd podczas przesyłania obrazu'
    });
  }
};
