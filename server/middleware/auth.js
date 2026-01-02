const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware do weryfikacji JWT tokenu
const auth = async (req, res, next) => {
  try {
    // Pobierz token z nagłówka Authorization
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Brak autoryzacji. Token nie został podany.'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Weryfikuj token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Znajdź użytkownika
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: 'Użytkownik nie został znaleziony'
      });
    }

    // Dodaj dane użytkownika do request
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = user;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Nieprawidłowy token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token wygasł. Proszę zalogować się ponownie.'
      });
    }

    res.status(500).json({
      message: 'Błąd autentykacji'
    });
  }
};

// Middleware do sprawdzania czy użytkownik jest adminem
const adminOnly = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      message: 'Dostęp tylko dla administratorów'
    });
  }
  next();
};

module.exports = {
  auth,
  protect: auth, // alias dla zgodności
  adminOnly
};
