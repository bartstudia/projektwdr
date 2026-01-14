import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h1>Panel Administratora</h1>
      <p>Witaj, {user?.name}!</p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Zarządzaj Jeziorami</h3>
          <p>Dodawaj, edytuj i usuwaj jeziora</p>
          <Link to="/admin/lakes" className="btn-primary">
            Jeziora
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Stanowiska Wędkarskie</h3>
          <p>Zarządzaj stanowiskami na jeziorach</p>
          <Link to="/admin/spots" className="btn-primary">
            Stanowiska
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Wszystkie Rezerwacje</h3>
          <p>Przeglądaj wszystkie rezerwacje w systemie</p>
          <Link to="/admin/reservations" className="btn-primary">
            Rezerwacje
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Opinie Użytkowników</h3>
          <p>Moderuj opinie o jeziorach</p>
          <Link to="/admin/reviews" className="btn-primary">
            Opinie
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
