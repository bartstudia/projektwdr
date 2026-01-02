import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import reservationService from '../../services/reservationService';

const ReservationCalendar = ({ spotId, onDateSelect, selectedDate }) => {
  const [reservedDates, setReservedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservedDates();
  }, [spotId]);

  const fetchReservedDates = async () => {
    try {
      setLoading(true);
      setError('');

      // Pobierz daty dla następnych 3 miesięcy
      const today = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      const response = await reservationService.getReservedDates(
        spotId,
        today.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );

      setReservedDates(response.reservedDates.map(date => new Date(date)));
    } catch (err) {
      console.error('Błąd podczas pobierania zajętych dat:', err);
      setError('Nie udało się pobrać dostępności stanowiska');
    } finally {
      setLoading(false);
    }
  };

  const isDateReserved = (date) => {
    return reservedDates.some(
      reservedDate =>
        reservedDate.getFullYear() === date.getFullYear() &&
        reservedDate.getMonth() === date.getMonth() &&
        reservedDate.getDate() === date.getDate()
    );
  };

  const isDateDisabled = ({ date, view }) => {
    if (view !== 'month') return false;

    // Zablokuj daty w przeszłości
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Zablokuj zarezerwowane daty
    return isDateReserved(date);
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;

    const classes = [];

    // Dzisiejsza data
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date.getTime() === today.getTime()) {
      classes.push('today-tile');
    }

    // Zarezerwowane daty
    if (isDateReserved(date)) {
      classes.push('reserved-tile');
    }

    // Wybrana data
    if (
      selectedDate &&
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    ) {
      classes.push('selected-tile');
    }

    // Daty w przeszłości
    if (date < today) {
      classes.push('past-tile');
    }

    return classes.join(' ');
  };

  const handleDateChange = (date) => {
    // Ustaw godzinę na 00:00:00 dla spójności
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    // Sprawdź czy data nie jest zarezerwowana
    if (!isDateReserved(normalizedDate)) {
      onDateSelect(normalizedDate);
    }
  };

  if (loading) {
    return (
      <div className="calendar-loading">
        <div className="loading-spinner">Ładowanie dostępności...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-error">
        <p>{error}</p>
        <button onClick={fetchReservedDates} className="btn-secondary btn-small">
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <div className="reservation-calendar">
      <div className="calendar-header">
        <h3>Wybierz datę rezerwacji</h3>
        <p className="calendar-hint">Kliknij na dostępny dzień, aby go zarezerwować</p>
      </div>

      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileDisabled={isDateDisabled}
        tileClassName={tileClassName}
        minDate={new Date()}
        maxDate={(() => {
          const maxDate = new Date();
          maxDate.setMonth(maxDate.getMonth() + 3);
          return maxDate;
        })()}
        locale="pl-PL"
        className="custom-calendar"
      />

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-box available"></span>
          <span>Dostępne</span>
        </div>
        <div className="legend-item">
          <span className="legend-box reserved"></span>
          <span>Zarezerwowane</span>
        </div>
        <div className="legend-item">
          <span className="legend-box selected"></span>
          <span>Wybrane</span>
        </div>
      </div>

      {selectedDate && (
        <div className="selected-date-info">
          <strong>Wybrana data:</strong>{' '}
          {selectedDate.toLocaleDateString('pl-PL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      )}
    </div>
  );
};

export default ReservationCalendar;
