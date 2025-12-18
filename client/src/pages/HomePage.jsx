import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>System Rezerwacji Stanowisk Wędkarskich</h1>
        <p className="hero-subtitle">
          Znajdź idealne miejsce na wędkowanie i zarezerwuj swoje stanowisko już dziś
        </p>

        {!isAuthenticated ? (
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary btn-large">
              Zarejestruj się
            </Link>
            <Link to="/login" className="btn-secondary btn-large">
              Zaloguj się
            </Link>
          </div>
        ) : (
          <div className="hero-buttons">
            <Link
              to={user?.role === 'admin' ? '/admin' : '/dashboard'}
              className="btn-primary btn-large"
            >
              Przejdź do panelu
            </Link>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>Funkcje systemu</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Interaktywne mapy</h3>
            <p>Przeglądaj jeziora z dokładnymi mapami pokazującymi dostępne stanowiska wędkarskie</p>
          </div>
          <div className="feature-card">
            <h3>Łatwa rezerwacja</h3>
            <p>Wybierz datę i stanowisko z kalendarza i dokonaj rezerwacji w kilka sekund</p>
          </div>
          <div className="feature-card">
            <h3>System opinii</h3>
            <p>Czytaj opinie innych wędkarzy i dziel się swoimi doświadczeniami</p>
          </div>
          <div className="feature-card">
            <h3>Zarządzanie rezerwacjami</h3>
            <p>Przeglądaj i zarządzaj swoimi rezerwacjami w jednym miejscu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
