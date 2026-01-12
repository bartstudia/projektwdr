import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import lakeService from '../../services/lakeService';
import reservationService from '../../services/reservationService';
import ImageMap from '../../components/user/ImageMap';
import ReviewList from '../../components/user/ReviewList';
import ReviewForm from '../../components/user/ReviewForm';
import { useAuth } from '../../context/AuthContext';

const LakeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lake, setLake] = useState(null);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [reviewsKey, setReviewsKey] = useState(0);

  // Nowe: wybór daty i dostępność
  const [selectedDate, setSelectedDate] = useState('');
  const [reservedSpotIds, setReservedSpotIds] = useState([]);

  const buildEmbedUrl = (target) => {
    if (!target) return null;
    const { latitude, longitude, gpsLink } = target;

    if (
      latitude !== null &&
      latitude !== undefined &&
      latitude !== '' &&
      longitude !== null &&
      longitude !== undefined &&
      longitude !== ''
    ) {
      return `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
    }

    return gpsLink || null;
  };

  const buildMapLink = (target) => {
    if (!target) return null;
    const { latitude, longitude, gpsLink } = target;

    if (gpsLink) return gpsLink;
    if (
      latitude !== null &&
      latitude !== undefined &&
      latitude !== '' &&
      longitude !== null &&
      longitude !== undefined &&
      longitude !== ''
    ) {
      return `https://www.google.com/maps?q=${latitude},${longitude}`;
    }

    return null;
  };

  useEffect(() => {
    fetchLakeDetails();
  }, [id]);

  // Pobierz dostępność stanowisk gdy zmieni się data
  useEffect(() => {
    if (selectedDate && id) {
      fetchAvailability();
    }
  }, [selectedDate, id]);

  const fetchLakeDetails = async () => {
    try {
      setLoading(true);
      const data = await lakeService.getLakeById(id);
      setLake(data.lake);
      setSpots(data.spots || []);

      // Ustaw domyślną datę na jutro
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split('T')[0]);

      setError('');
    } catch (err) {
      setError(err.message || 'Błąd podczas ładowania szczegółów jeziora');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      const data = await reservationService.getReservedSpotsForDate(id, selectedDate);
      setReservedSpotIds(data.reservedSpotIds || []);
    } catch (err) {
      console.error('Błąd podczas pobierania dostępności:', err);
      setReservedSpotIds([]);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedSpot(null); // Reset wybranego stanowiska
  };

  const handleSpotClick = (spot) => {
    // Sprawdź czy stanowisko jest zarezerwowane
    if (reservedSpotIds.includes(spot._id)) {
      alert('To stanowisko jest już zarezerwowane w wybranym terminie. Wybierz inną datę lub stanowisko.');
      return;
    }

    if (!selectedDate) {
      alert('Najpierw wybierz datę rezerwacji');
      return;
    }

    setSelectedSpot(spot);
  };

  const handleReserveClick = () => {
    if (!selectedDate) {
      alert('Proszę wybrać datę rezerwacji');
      return;
    }
    if (selectedSpot) {
      // Przekaż datę jako query parameter
      navigate(`/reservation/${lake._id}/${selectedSpot._id}?date=${selectedDate}`);
    }
  };

  const handleReviewSubmitted = () => {
    setReviewsKey(prev => prev + 1);
  };

  const isSpotReserved = (spotId) => {
    return reservedSpotIds.includes(spotId);
  };

  const getAvailableSpotsCount = () => {
    return spots.filter(spot => !reservedSpotIds.includes(spot._id)).length;
  };

  const handleReserveFirstAvailable = () => {
    if (!selectedDate) {
      alert('Proszę wybrać datę rezerwacji');
      return;
    }

    const firstAvailable = spots.find((spot) => !reservedSpotIds.includes(spot._id));
    if (!firstAvailable) {
      alert('Brak dostępnych stanowisk w wybranym terminie');
      return;
    }

    setSelectedSpot(firstAvailable);
    navigate(`/reservation/${lake._id}/${firstAvailable._id}?date=${selectedDate}`);
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

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/lakes')} className="btn-secondary">
          Powrót do listy jezior
        </button>
      </div>
    );
  }

  if (!lake) {
    return (
      <div className="page-container">
        <div className="error-message">Jezioro nie znalezione</div>
        <button onClick={() => navigate('/lakes')} className="btn-secondary">
          Powrót do listy jezior
        </button>
      </div>
    );
  }

  const spotHasCoords = selectedSpot &&
    selectedSpot.latitude !== null &&
    selectedSpot.latitude !== undefined &&
    selectedSpot.longitude !== null &&
    selectedSpot.longitude !== undefined;
  const hasSpotLocation = selectedSpot && (selectedSpot.gpsLink || spotHasCoords);
  const mapTarget = hasSpotLocation ? selectedSpot : lake;
  const embedUrl = buildEmbedUrl(mapTarget);
  const mapLink = buildMapLink(mapTarget);
  const availableCount = getAvailableSpotsCount();

  return (
    <div className="page-container">
      <button onClick={() => navigate('/lakes')} className="btn-back">
        ← Powrót do listy jezior
      </button>

      <div className="lake-detail-header">
        <h1>{lake.name}</h1>
        <p className="lake-detail-location">
          <span className="location-icon">📍</span>
          {lake.location}
        </p>
      </div>

      {/* NOWE: Selektor daty */}
      <div className="date-selector-section">
        <div className="date-selector-header">
          <h2>Wybierz termin rezerwacji</h2>
          <p className="date-selector-hint">
            Stanowiska zarezerwowane w wybranym terminie będą oznaczone na CZERWONO
          </p>
        </div>
        <div className="date-selector-controls">
          <div className="date-input-group">
            <label htmlFor="reservation-date">📅 Data rezerwacji:</label>
            <input
              type="date"
              id="reservation-date"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
              className="date-input-large"
            />
          </div>
            {selectedDate && (
              <div className="availability-info">
                <div className="availability-stat">
                  <span className="stat-label">Dostępne stanowiska:</span>
                  <span className="stat-value available">{availableCount} / {spots.length}</span>
                </div>
                <div className="availability-stat">
                  <span className="stat-label">Zarezerwowane:</span>
                  <span className="stat-value reserved">{reservedSpotIds.length}</span>
                </div>
              </div>
            )}
            {selectedDate && spots.length > 0 && (
              <div className="availability-actions">
                <button
                  onClick={handleReserveFirstAvailable}
                  className="btn-primary btn-small"
                  disabled={availableCount === 0}
                >
                  Zarezerwuj pierwsze dostępne
                </button>
                <a href="#spots-list" className="btn-secondary btn-small">
                  Przejdź do listy stanowisk
                </a>
                {availableCount === 0 && (
                  <span className="availability-note">
                    Brak wolnych stanowisk na wybrany termin.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

      <div className="lake-detail-content">
        <div className="lake-description-section">
          <h2>Opis jeziora</h2>
          <p>{lake.description}</p>
        </div>

        {embedUrl && (
          <div className="lake-location-section">
            <h2>Mapa lokalizacji</h2>
            <p>
              {selectedSpot ? `Stanowisko: ${selectedSpot.name}` : 'Lokalizacja jeziora'}
            </p>
            <div className="map-embed">
              <iframe
                title="Mapa lokalizacji"
                src={embedUrl}
                width="100%"
                height="360"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              />
            </div>
            {mapLink && (
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="map-link"
              >
                Otwórz w Google Maps
              </a>
            )}
          </div>
        )}

        {lake.imageUrl && spots.length > 0 && (
          <div className="lake-map-section">
            <h2>Mapa stanowisk wędkarskich</h2>
            <p className="map-instruction">
              🟢 Zielone = Dostępne &nbsp;&nbsp; 🔴 Czerwone = Zarezerwowane &nbsp;&nbsp; 🔵 Niebieskie = Wybrane
            </p>
            <ImageMap
              lake={lake}
              spots={spots}
              onSpotClick={handleSpotClick}
              selectedSpot={selectedSpot}
              reservedSpotIds={reservedSpotIds}
            />
          </div>
        )}

        {spots.length === 0 && (
          <div className="empty-state">
            <p>Brak dostępnych stanowisk wędkarskich dla tego jeziora.</p>
          </div>
        )}

          {spots.length > 0 && (
            <div className="spots-list-section" id="spots-list">
              <h2>Dostępne stanowiska ({availableCount} / {spots.length})</h2>
            <div className="spots-list">
              {spots.map((spot) => {
                const isReserved = isSpotReserved(spot._id);
                return (
                  <div
                    key={spot._id}
                    className={`spot-item ${selectedSpot?._id === spot._id ? 'selected' : ''} ${
                      isReserved ? 'reserved-spot' : ''
                    }`}
                    onClick={() => !isReserved && handleSpotClick(spot)}
                    style={{ cursor: isReserved ? 'not-allowed' : 'pointer' }}
                  >
                    <h3>
                      {spot.name}
                      {isReserved && <span className="reserved-badge">Zarezerwowane</span>}
                    </h3>
                    {spot.description && <p>{spot.description}</p>}
                    <button
                      className={`btn-small ${isReserved ? 'btn-disabled' : 'btn-primary'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isReserved) {
                          alert('To stanowisko jest zarezerwowane w wybranym terminie');
                          return;
                        }
                        handleSpotClick(spot);
                        handleReserveClick();
                      }}
                      disabled={isReserved}
                    >
                      {isReserved ? '❌ Niedostępne' : '✓ Zarezerwuj'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedSpot && (
          <div className="selected-spot-info">
            <h3>Wybrane stanowisko: {selectedSpot.name}</h3>
            <button onClick={handleReserveClick} className="btn-primary btn-large">
              Przejdź do rezerwacji →
            </button>
          </div>
        )}

        {/* Sekcja opinii */}
        {user && (
          <ReviewForm lakeId={id} onReviewSubmitted={handleReviewSubmitted} />
        )}

        <ReviewList lakeId={id} onReviewAdded={reviewsKey} />
      </div>
    </div>
  );
};

export default LakeDetailPage;
