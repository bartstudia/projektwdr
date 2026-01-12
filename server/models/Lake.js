const mongoose = require('mongoose');

const LakeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nazwa jeziora jest wymagana'],
    unique: true,
    trim: true,
    maxlength: [100, 'Nazwa może mieć maksymalnie 100 znaków']
  },
  description: {
    type: String,
    required: [true, 'Opis jeziora jest wymagany'],
    maxlength: [1000, 'Opis może mieć maksymalnie 1000 znaków']
  },
  location: {
    type: String,
    required: [true, 'Lokalizacja jest wymagana'],
    maxlength: [200, 'Lokalizacja może mieć maksymalnie 200 znaków']
  },
  imageUrl: {
    type: String,
    default: null
  },
  imageWidth: {
    type: Number,
    default: null
  },
  imageHeight: {
    type: Number,
    default: null
  },
  googleMapsUrl: {
    type: String,
    trim: true,
    maxlength: [500, 'Link do Google Maps moze miec maksymalnie 500 znakow'],
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Middleware do aktualizacji updatedAt
LakeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Metoda do pobrania jezior z liczbą stanowisk
LakeSchema.statics.getWithSpotCount = async function() {
  return await this.aggregate([
    {
      $lookup: {
        from: 'fishingspots',
        localField: '_id',
        foreignField: 'lakeId',
        as: 'spots'
      }
    },
    {
      $addFields: {
        spotCount: { $size: '$spots' }
      }
    },
    {
      $project: {
        spots: 0
      }
    }
  ]);
};

module.exports = mongoose.model('Lake', LakeSchema);
