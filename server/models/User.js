const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email jest wymagany'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Nieprawidłowy format email']
  },
  password: {
    type: String,
    required: [true, 'Hasło jest wymagane'],
    minlength: [6, 'Hasło musi mieć minimum 6 znaków'],
    select: false // Nie zwracaj hasła domyślnie w queries
  },
  name: {
    type: String,
    required: [true, 'Imię jest wymagane'],
    trim: true,
    maxlength: [50, 'Imię może mieć maksymalnie 50 znaków']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
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

// Middleware do hashowania hasła przed zapisem
UserSchema.pre('save', async function(next) {
  // Tylko hashuj hasło jeśli zostało zmodyfikowane
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware do aktualizacji updatedAt przed zapisem
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Metoda do porównywania haseł
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Błąd podczas porównywania haseł');
  }
};

// Metoda do usunięcia hasła z obiektu (do zwracania w API)
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', UserSchema);
