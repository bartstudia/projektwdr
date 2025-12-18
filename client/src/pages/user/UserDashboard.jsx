import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h1>Panel Użytkownika</h1>
      <p>Witaj, {user?.name}!</p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Moje Rezerwacje</h3>
          <p>Przeglądaj i zarządzaj swoimi rezerwacjami</p>
          <Link to="/my-reservations" className="btn-primary">
            Zobacz rezerwacje
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Przeglądaj Jeziora</h3>
          <p>Znajdź idealne miejsce na wędkowanie</p>
          <Link to="/lakes" className="btn-primary">
            Przeglądaj
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Nowa Rezerwacja</h3>
          <p>Zarezerwuj stanowisko wędkarskie</p>
          <Link to="/lakes" className="btn-primary">
            Zarezerwuj
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Moje Opinie</h3>
          <p>Zobacz swoje opinie o jeziorach</p>
          <Link to="/my-reviews" className="btn-primary">
            Moje opinie
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
