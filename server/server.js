const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Załaduj zmienne środowiskowe
dotenv.config();

// Połącz z bazą danych
connectDB();

// Inicjalizacja aplikacji Express
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serwowanie statycznych plików (upload obrazów)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Podstawowa route do testowania
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Serwer działa prawidłowo',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/lakes', require('./routes/lakeRoutes'));
app.use('/api/spots', require('./routes/spotRoutes'));
// app.use('/api/reservations', require('./routes/reservationRoutes'));
// app.use('/api/reviews', require('./routes/reviewRoutes'));

// Obsługa błędów 404
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint nie znaleziony' });
});

// Globalny error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Wewnętrzny błąd serwera',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na porcie ${PORT} w trybie ${process.env.NODE_ENV}`);
});
