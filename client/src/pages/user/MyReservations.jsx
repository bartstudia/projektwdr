import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import reservationService from '../../services/reservationService';

const MyReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-asc');

  useEffect(() => {
    fetchReservations();
  }, [filter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (filter === 'upcoming') {
        params.upcoming = true;
      }

      const response = await reservationService.getMyReservations(params);

      let filteredReservations = response.reservations;

      // Filtruj rezerwacje przeszłe jeśli wybrano
      if (filter === 'past') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filteredReservations = response.reservations.filter(
          r => new Date(r.date) < today
        );
      }

      setReservations(filteredReservations);
    } catch (err) {
      setError(err.message || 'Błąd podczas ładowania rezerwacji');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('Czy na pewno chcesz anulować tę rezerwację?')) {
      return;
    }

    try {
      await reservationService.cancelReservation(reservationId);
      alert('Rezerwacja została anulowana');
      fetchReservations();
    } catch (err) {
      alert(err.message || 'Błąd podczas anulowania rezerwacji');
    }
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

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) < today;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    if (sortedReservations.length === 0) {
      alert('Brak rezerwacji do eksportu');
      return;
    }

    const escapeCell = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value).replace(/\"/g, '\"\"');
      return `"${str}"`;
    };

    const header = [
      'Jezioro',
      'Lokalizacja',
      'Stanowisko',
      'Data rezerwacji',
      'Status',
      'Utworzona',
      'Notatki'
    ];

    const rows = sortedReservations.map((reservation) => ([
      reservation.lakeId?.name || '',
      reservation.lakeId?.location || '',
      reservation.spotId?.name || '',
      new Date(reservation.date).toISOString().split('T')[0],
      reservation.status,
      new Date(reservation.createdAt).toISOString().split('T')[0],
      reservation.notes || ''
    ]));

    const csvContent = [header, ...rows]
      .map((row) => row.map(escapeCell).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rezerwacje.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredReservations = reservations.filter((reservation) => {
    if (statusFilter !== 'all' && reservation.status !== statusFilter) {
      return false;
    }

    const search = searchTerm.trim().toLowerCase();
    if (!search) return true;

    const haystack = [
      reservation.lakeId?.name,
      reservation.lakeId?.location,
      reservation.spotId?.name,
      reservation.notes
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(search);
  });

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'created-desc') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'created-asc') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return new Date(a.date) - new Date(b.date);
  });

  if (loading) {
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
      <div className="my-reservations-header">
        <div>
          <h1>Moje Rezerwacje</h1>
          <p className="reservations-subtitle">Zarządzaj swoimi rezerwacjami i historią wizyt</p>
        </div>
        <div className="my-reservations-actions">
          <button onClick={() => navigate('/lakes')} className="btn-primary">
            + Nowa Rezerwacja
          </button>
          <button onClick={handleExportCsv} className="btn-secondary">
            Eksport CSV
          </button>
          <button onClick={handlePrint} className="btn-secondary">
            Drukuj
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="reservations-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Wszystkie ({reservations.length})
        </button>
        <button
          className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          Nadchodzące
        </button>
        <button
          className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
          onClick={() => setFilter('past')}
        >
          Przeszłe
        </button>
      </div>

      <div className="reservations-tools">
        <div className="reservations-tool-group">
          <label htmlFor="reservation-status">Status:</label>
          <select
            id="reservation-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Wszystkie</option>
            <option value="confirmed">Potwierdzone</option>
            <option value="pending">Oczekujące</option>
            <option value="cancelled">Anulowane</option>
          </select>
        </div>
        <div className="reservations-tool-group">
          <label htmlFor="reservation-search">Szukaj:</label>
          <input
            id="reservation-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Jezioro, stanowisko, notatki..."
          />
        </div>
        <div className="reservations-tool-group">
          <label htmlFor="reservation-sort">Sortowanie:</label>
          <select
            id="reservation-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-asc">Data: rosnąco</option>
            <option value="date-desc">Data: malejąco</option>
            <option value="created-desc">Utworzone: najnowsze</option>
            <option value="created-asc">Utworzone: najstarsze</option>
          </select>
        </div>
        <div className="reservations-tool-meta">
          Widocznych: {sortedReservations.length}
        </div>
      </div>

      {sortedReservations.length === 0 ? (
        <div className="empty-state">
          <h2>Brak rezerwacji</h2>
          <p>
            {filter === 'upcoming'
              ? 'Nie masz żadnych nadchodzących rezerwacji'
              : filter === 'past'
              ? 'Nie masz żadnych przeszłych rezerwacji'
              : 'Nie masz jeszcze żadnych rezerwacji. Zarezerwuj swoje pierwsze stanowisko!'}
          </p>
          <button onClick={() => navigate('/lakes')} className="btn-primary">
            Przeglądaj Jeziora
          </button>
        </div>
      ) : (
        <div className="reservations-list">
          {sortedReservations.map((reservation) => (
            <div key={reservation._id} className="reservation-card">
              <div className="reservation-card-header">
                <div>
                  <h3>{reservation.lakeId?.name}</h3>
                  <p className="reservation-location">{reservation.lakeId?.location}</p>
                </div>
                {getStatusBadge(reservation.status)}
              </div>

              {reservation.lakeId?.imageUrl && (
                <div className="reservation-image">
                  <img
                    src={`http://localhost:5000${reservation.lakeId.imageUrl}`}
                    alt={reservation.lakeId.name}
                  />
                </div>
              )}

              <div className="reservation-details">
                <div className="detail-row">
                  <span className="detail-label">Stanowisko:</span>
                  <span className="detail-value">{reservation.spotId?.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Data:</span>
                  <span className="detail-value date-highlight">
                    {new Date(reservation.date).toLocaleDateString('pl-PL', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {reservation.notes && (
                  <div className="detail-row">
                    <span className="detail-label">Notatki:</span>
                    <span className="detail-value">{reservation.notes}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Utworzona:</span>
                  <span className="detail-value">
                    {new Date(reservation.createdAt).toLocaleDateString('pl-PL')}
                  </span>
                </div>
              </div>

              <div className="reservation-actions">
                <button
                  onClick={() => navigate(`/lakes/${reservation.lakeId._id}`)}
                  className="btn-secondary btn-small"
                >
                  Zobacz Jezioro
                </button>
                {reservation.status !== 'cancelled' && !isPastDate(reservation.date) && (
                  <button
                    onClick={() => handleCancelReservation(reservation._id)}
                    className="btn-danger btn-small"
                    data-testid="reservation-cancel"
                  >
                    Anuluj Rezerwację
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;
