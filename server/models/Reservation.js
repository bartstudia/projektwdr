const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID użytkownika jest wymagane']
  },
  spotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FishingSpot',
    required: [true, 'ID stanowiska jest wymagane']
  },
  lakeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lake',
    required: [true, 'ID jeziora jest wymagane']
  },
  date: {
    type: Date,
    required: [true, 'Data rezerwacji jest wymagana']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notatki mogą mieć maksymalnie 500 znaków']
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

// KRYTYCZNY INDEX - zapobiega podwójnym rezerwacjom tego samego stanowiska na ten sam dzień
ReservationSchema.index({ spotId: 1, date: 1 }, { unique: true });

// Index dla szybkiego wyszukiwania rezerwacji użytkownika
ReservationSchema.index({ userId: 1, date: 1 });

// Index dla wyszukiwania rezerwacji po jeziorze
ReservationSchema.index({ lakeId: 1, date: 1 });

// Middleware do aktualizacji updatedAt
ReservationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Metoda statyczna do sprawdzenia dostępności stanowiska
ReservationSchema.statics.isSpotAvailable = async function(spotId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingReservation = await this.findOne({
    spotId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: { $ne: 'cancelled' }
  });

  return !existingReservation;
};

// Metoda do pobrania zajętych dat dla stanowiska
ReservationSchema.statics.getReservedDates = async function(spotId, startDate, endDate) {
  const reservations = await this.find({
    spotId,
    date: {
      $gte: startDate,
      $lte: endDate
    },
    status: { $ne: 'cancelled' }
  }).select('date');

  return reservations.map(r => r.date);
};

module.exports = mongoose.model('Reservation', ReservationSchema);
