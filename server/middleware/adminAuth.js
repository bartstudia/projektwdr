// Middleware do sprawdzania czy użytkownik ma rolę admina
// UWAGA: Ten middleware musi być użyty AFTER middleware auth.js

const adminAuth = (req, res, next) => {
  try {
    // Sprawdź czy użytkownik ma rolę admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        message: 'Brak dostępu. Ta akcja wymaga uprawnień administratora.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({
      message: 'Błąd weryfikacji uprawnień'
    });
  }
};

module.exports = adminAuth;
