import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError('');
        const data = await adminService.getStats();
        setStats(data.stats || null);
      } catch (err) {
        setStatsError(err.message || 'Blad podczas ladowania statystyk');
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Panel Administratora</h1>
      <p>Witaj, {user?.name}!</p>

      {statsLoading ? (
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">...</div>
            <div className="stat-label">Ladowanie</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">...</div>
            <div className="stat-label">Ladowanie</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">...</div>
            <div className="stat-label">Ladowanie</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">...</div>
            <div className="stat-label">Ladowanie</div>
          </div>
        </div>
      ) : statsError ? (
        <div className="error-message">{statsError}</div>
      ) : (
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{stats?.lakesCount ?? 0}</div>
            <div className="stat-label">Jeziora</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats?.spotsCount ?? 0}</div>
            <div className="stat-label">Stanowiska</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats?.activeReservations ?? 0}</div>
            <div className="stat-label">Aktywne rezerwacje</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats?.newReviews ?? 0}</div>
            <div className="stat-label">Opinie (7 dni)</div>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Zarzadzaj Jeziorami</h3>
          <p>Dodawaj, edytuj i usuwaj jeziora</p>
          <Link to="/admin/lakes" className="btn-primary">
            Jeziora
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Stanowiska Wedkarskie</h3>
          <p>Zarzadzaj stanowiskami na jeziorach</p>
          <Link to="/admin/spots" className="btn-primary">
            Stanowiska
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Wszystkie Rezerwacje</h3>
          <p>Przegladaj wszystkie rezerwacje w systemie</p>
          <Link to="/admin/reservations" className="btn-primary">
            Rezerwacje
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Opinie Uzytkownikow</h3>
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
