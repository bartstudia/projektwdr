import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import lakeService from '../../services/lakeService';
import reservationService from '../../services/reservationService';

const ReservationPage = () => {
  const { lakeId, spotId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [lake, setLake] = useState(null);
  const [spot, setSpot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Pobierz datę z URL query params
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setSelectedDate(new Date(dateParam));
    }
    fetchData();
  }, [lakeId, spotId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const lakeData = await lakeService.getLakeById(lakeId);
      setLake(lakeData.lake);

      const selectedSpot = lakeData.spots.find(s => s._id === spotId);
      if (!selectedSpot) {
        setError('Stanowisko nie zostało znalezione');
        return;
      }
      setSpot(selectedSpot);
      setError('');
    } catch (err) {
      setError(err.message || 'Błąd podczas ładowania danych');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      alert('Proszę wybrać datę rezerwacji');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      await reservationService.createReservation({
        lakeId,
        spotId,
        date: selectedDate.toISOString(),
        notes
      });

      alert('Rezerwacja została utworzona pomyślnie!');
      navigate('/my-reservations');
    } catch (err) {
      setError(err.message || 'Błąd podczas tworzenia rezerwacji');
      alert(err.message || 'Nie udało się utworzyć rezerwacji');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner">Ładowanie...</div>
        </div>
      </div>
    );
  }

  if (error && !spot) {
    return (
      <div className="page-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/lakes')} className="btn-secondary">
          Powrót do jezior
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate(`/lakes/${lakeId}`)} className="btn-back">
        ← Powrót do jeziora
      </button>

      <div className="reservation-page-header">
        <h1>Rezerwacja Stanowiska</h1>
        <div className="reservation-details">
          <div className="detail-item">
            <span className="detail-label">Jezioro:</span>
            <span className="detail-value">{lake?.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Lokalizacja:</span>
            <span className="detail-value">{lake?.location}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Stanowisko:</span>
            <span className="detail-value">{spot?.name}</span>
          </div>
          {spot?.description && (
            <div className="detail-item">
              <span className="detail-label">Opis:</span>
              <span className="detail-value">{spot.description}</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="reservation-form">
        {/* Wyświetl wybrany termin */}
        <div className="selected-date-section">
          <div className="selected-date-header">
            <h2>📅 Wybrany termin rezerwacji</h2>
          </div>
          <div className="selected-date-display">
            {selectedDate ? (
              <>
                <div className="date-value">
                  {new Date(selectedDate).toLocaleDateString('pl-PL', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/lakes/${lakeId}`)}
                  className="btn-change-date"
                >
                  Zmień termin lub stanowisko
                </button>
              </>
            ) : (
              <div className="no-date-warning">
                <p>⚠️ Nie wybrano daty rezerwacji</p>
                <button
                  type="button"
                  onClick={() => navigate(`/lakes/${lakeId}`)}
                  className="btn-primary"
                >
                  Wróć i wybierz termin
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="notes">Notatki (opcjonalnie):</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dodatkowe informacje dotyczące rezerwacji..."
              rows="4"
              maxLength={500}
            />
            <small className="form-hint">
              {notes.length}/500 znaków
            </small>
          </div>

          {error && (
            <div className="error-message" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(`/lakes/${lakeId}`)}
              className="btn-secondary"
              disabled={submitting}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!selectedDate || submitting}
            >
              {submitting ? 'Tworzenie rezerwacji...' : 'Potwierdź rezerwację'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReservationPage;
