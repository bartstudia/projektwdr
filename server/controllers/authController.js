const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Funkcja do generowania JWT tokenu
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token ważny przez 7 dni
  );
};

// @desc    Rejestracja nowego użytkownika
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Walidacja danych
    if (!email || !password || !name) {
      return res.status(400).json({
        message: 'Proszę podać wszystkie wymagane dane: email, hasło i imię'
      });
    }

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'Użytkownik z tym adresem email już istnieje'
      });
    }

    // Utwórz nowego użytkownika
    const user = await User.create({
      email,
      password,
      name,
      role: 'user' // Domyślnie user, admin musi być ustawiony ręcznie w bazie
    });

    // Generuj token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'Rejestracja przebiegła pomyślnie',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);

    // Obsługa błędów walidacji Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Błąd walidacji',
        errors: messages
      });
    }

    res.status(500).json({
      message: 'Błąd podczas rejestracji użytkownika'
    });
  }
};

// @desc    Logowanie użytkownika
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Walidacja danych
    if (!email || !password) {
      return res.status(400).json({
        message: 'Proszę podać email i hasło'
      });
    }

    // Znajdź użytkownika (włącz hasło)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Nieprawidłowy email lub hasło'
      });
    }

    // Sprawdź hasło
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Nieprawidłowy email lub hasło'
      });
    }

    // Generuj token
    const token = generateToken(user._id, user.role);

    res.json({
      message: 'Logowanie pomyślne',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Błąd podczas logowania'
    });
  }
};

// @desc    Pobierz dane zalogowanego użytkownika
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // req.user jest ustawione przez middleware auth
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Użytkownik nie znaleziony'
      });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      message: 'Błąd podczas pobierania danych użytkownika'
    });
  }
};
