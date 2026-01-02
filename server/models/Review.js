const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID użytkownika jest wymagane']
  },
  lakeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lake',
    required: [true, 'ID jeziora jest wymagane']
  },
  rating: {
    type: Number,
    required: [true, 'Ocena jest wymagana'],
    min: [1, 'Minimalna ocena to 1'],
    max: [5, 'Maksymalna ocena to 5']
  },
  comment: {
    type: String,
    required: [true, 'Komentarz jest wymagany'],
    minlength: [10, 'Komentarz musi mieć minimum 10 znaków'],
    maxlength: [1000, 'Komentarz może mieć maksymalnie 1000 znaków']
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

// Index dla szybkiego wyszukiwania opinii po jeziorze
ReviewSchema.index({ lakeId: 1, createdAt: -1 });

// Index dla wyszukiwania opinii użytkownika
ReviewSchema.index({ userId: 1 });

// Middleware do aktualizacji updatedAt
ReviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Metoda statyczna do obliczenia średniej oceny jeziora
ReviewSchema.statics.calculateAverageRating = async function(lakeId) {
  const result = await this.aggregate([
    {
      $match: { lakeId: new mongoose.Types.ObjectId(lakeId) }
    },
    {
      $group: {
        _id: '$lakeId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  return result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };
};

module.exports = mongoose.model('Review', ReviewSchema);
