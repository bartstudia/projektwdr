const mongoose = require('mongoose');

const FishingSpotSchema = new mongoose.Schema({
  lakeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lake',
    required: [true, 'ID jeziora jest wymagane']
  },
  name: {
    type: String,
    required: [true, 'Nazwa stanowiska jest wymagana'],
    trim: true,
    maxlength: [50, 'Nazwa może mieć maksymalnie 50 znaków']
  },
  description: {
    type: String,
    maxlength: [500, 'Opis może mieć maksymalnie 500 znaków']
  },
  gpsLink: {
    type: String,
    default: null
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  // Współrzędne dla clickable area na mapie obrazkowej
  mapCoordinates: {
    shape: {
      type: String,
      enum: ['circle', 'rect', 'poly'],
      required: [true, 'Kształt obszaru jest wymagany']
    },
    coords: {
      type: [Number],
      required: [true, 'Współrzędne są wymagane'],
      validate: {
        validator: function(arr) {
          // Walidacja liczby współrzędnych w zależności od kształtu
          if (this.mapCoordinates.shape === 'circle') {
            return arr.length === 3; // [x, y, radius]
          } else if (this.mapCoordinates.shape === 'rect') {
            return arr.length === 4; // [x1, y1, x2, y2]
          } else if (this.mapCoordinates.shape === 'poly') {
            return arr.length >= 6 && arr.length % 2 === 0; // Minimum 3 punkty (x,y pary)
          }
          return false;
        },
        message: 'Nieprawidłowa liczba współrzędnych dla wybranego kształtu'
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index dla szybszego wyszukiwania stanowisk po jeziorze
FishingSpotSchema.index({ lakeId: 1 });

// Middleware do aktualizacji updatedAt
FishingSpotSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FishingSpot', FishingSpotSchema);

