import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import reservationService from '../../services/reservationService';
import lakeService from '../../services/lakeService';

const AdminReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [lakes, setLakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    lakeId: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchLakes();
    fetchReservations();
  }, []);

  const fetchLakes = async () => {
    try {
      const data = await lakeService.getAllLakes();
      setLakes(data.lakes || []);
    } catch (err) {
      console.error('Błąd podczas ładowania jezior:', err);
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (filters.lakeId) params.lakeId = filters.lakeId;
      if (filters.status) params.status = filters.status;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const data = await reservationService.getAllReservations(params);
      setReservations(data.reservations || []);
    } catch (err) {
      setError(err.message || 'Błąd podczas ładowania rezerwacji');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    fetchReservations();
  };

  const handleResetFilters = () => {
    setFilters({
      lakeId: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    setTimeout(() => fetchReservations(), 100);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      confirmed: { text: 'Potwierdzona', class: 'status-confirmed' },
      pending: { text: 'Oczekująca', class: 'status-pending' },
      cancelled: { text: 'Anulowana', class: 'status-cancelled' }
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && reservations.length === 0) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner">Ładowanie rezerwacji...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate('/admin')} className="btn-back">
        ← Powrót do panelu admina
      </button>

      <div className="admin-page-header">
        <h1>Wszystkie Rezerwacje</h1>
        <p className="subtitle">Zarządzaj rezerwacjami użytkowników</p>
      </div>

      {/* Filtry */}
      <div className="filters-section">
        <h3>Filtry</h3>
        <div className="filters-grid">
          <div className="form-group">
            <label htmlFor="lakeFilter">Jezioro:</label>
            <select
              id="lakeFilter"
              value={filters.lakeId}
              onChange={(e) => handleFilterChange('lakeId', e.target.value)}
            >
              <option value="">Wszystkie jeziora</option>
              {lakes.map(lake => (
                <option key={lake._id} value={lake._id}>
                  {lake.name} - {lake.location}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="statusFilter">Status:</label>
            <select
              id="statusFilter"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Wszystkie statusy</option>
              <option value="confirmed">Potwierdzona</option>
              <option value="pending">Oczekująca</option>
              <option value="cancelled">Anulowana</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Data od:</label>
            <input
              type="date"
              id="startDate"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">Data do:</label>
            <input
              type="date"
              id="endDate"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={handleApplyFilters} className="btn-primary">
            Zastosuj filtry
          </button>
          <button onClick={handleResetFilters} className="btn-secondary">
            Wyczyść filtry
          </button>
        </div>
      </div>

      {/* Statystyki */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">{reservations.length}</div>
          <div className="stat-label">Wszystkich rezerwacji</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {reservations.filter(r => r.status === 'confirmed').length}
          </div>
          <div className="stat-label">Potwierdzonych</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {reservations.filter(r => r.status === 'cancelled').length}
          </div>
          <div className="stat-label">Anulowanych</div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Lista rezerwacji */}
      {reservations.length === 0 ? (
        <div className="empty-state">
          <p>Brak rezerwacji spełniających kryteria</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Użytkownik</th>
                <th>Email</th>
                <th>Jezioro</th>
                <th>Stanowisko</th>
                <th>Data rezerwacji</th>
                <th>Status</th>
                <th>Utworzona</th>
                <th>Notatki</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>{reservation.userId?.name || 'N/A'}</td>
                  <td>{reservation.userId?.email || 'N/A'}</td>
                  <td>
                    <strong>{reservation.lakeId?.name}</strong>
                    <br />
                    <small>{reservation.lakeId?.location}</small>
                  </td>
                  <td>{reservation.spotId?.name || 'N/A'}</td>
                  <td className="date-cell">
                    <strong>{formatDate(reservation.date)}</strong>
                  </td>
                  <td>{getStatusBadge(reservation.status)}</td>
                  <td>{formatDate(reservation.createdAt)}</td>
                  <td>
                    {reservation.notes ? (
                      <small>{reservation.notes}</small>
                    ) : (
                      <span className="text-muted">Brak</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;
