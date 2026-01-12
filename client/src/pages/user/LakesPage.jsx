import React, { useState, useEffect } from 'react';
import lakeService from '../../services/lakeService';
import reservationService from '../../services/reservationService';
import LakeCard from '../../components/user/LakeCard';

const LakesPage = () => {
  const [lakes, setLakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityDate, setAvailabilityDate] = useState('');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [availabilityByLake, setAvailabilityByLake] = useState({});
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  useEffect(() => {
    fetchLakes();
  }, []);

  useEffect(() => {
    if (!availabilityOnly || !availabilityDate || lakes.length === 0) {
      return;
    }

    fetchAvailability();
  }, [availabilityOnly, availabilityDate, lakes]);

  const fetchLakes = async () => {
    try {
      setLoading(true);
      const data = await lakeService.getAllLakes();
      const activeLakes = (data.lakes || []).filter(
        (lake) => lake.isActive !== false
      );
      setLakes(activeLakes);
      setError('');
    } catch (err) {
      setError(err.message || 'Błąd podczas ładowania jezior');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      setAvailabilityLoading(true);

      const results = await Promise.all(
        lakes.map(async (lake) => {
          const lakeDetails = await lakeService.getLakeById(lake._id);
          const reserved = await reservationService.getReservedSpotsForDate(
            lake._id,
            availabilityDate
          );
          const totalSpots = (lakeDetails.spots || []).length;
          const reservedCount = (reserved.reservedSpotIds || []).length;
          const availableCount = Math.max(totalSpots - reservedCount, 0);
          return {
            lakeId: lake._id,
            totalSpots,
            availableCount
          };
        })
      );

      const map = results.reduce((acc, item) => {
        acc[item.lakeId] = item;
        return acc;
      }, {});
      setAvailabilityByLake(map);
    } catch (err) {
      console.error('Błąd podczas pobierania dostępności:', err);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const filteredLakes = lakes.filter(lake =>
    lake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lake.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availabilityFilteredLakes = availabilityOnly && availabilityDate
    ? filteredLakes.filter((lake) => {
        const availability = availabilityByLake[lake._id];
        return availability ? availability.availableCount > 0 : false;
      })
    : filteredLakes;

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner">Ładowanie jezior...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="lakes-page-header">
        <h1>Dostępne Jeziora</h1>
        <p>Wybierz jezioro i zarezerwuj swoje wymarzone stanowisko wędkarskie</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="search-section">
        <input
          type="text"
          placeholder="Szukaj jeziora po nazwie lub lokalizacji..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="availability-filters">
        <div className="filter-group">
          <label htmlFor="availability-date">Sprawdź dostępność na dzień:</label>
          <input
            id="availability-date"
            type="date"
            value={availabilityDate}
            onChange={(e) => setAvailabilityDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <label className="availability-toggle">
          <input
            type="checkbox"
            checked={availabilityOnly}
            onChange={(e) => setAvailabilityOnly(e.target.checked)}
            disabled={!availabilityDate}
          />
          Pokaż tylko jeziora z wolnymi stanowiskami
        </label>
        {availabilityOnly && availabilityDate && availabilityLoading && (
          <span className="availability-loading">Sprawdzanie dostępności...</span>
        )}
      </div>

      {availabilityFilteredLakes.length === 0 ? (
        <div className="empty-state">
          {searchTerm ? (
            <p>Nie znaleziono jezior pasujących do "{searchTerm}"</p>
          ) : (
            <p>Brak dostępnych jezior. Sprawdź ponownie później.</p>
          )}
        </div>
      ) : (
        <div className="lakes-grid-user">
          {availabilityFilteredLakes.map((lake) => (
            <LakeCard
              key={lake._id}
              lake={lake}
              availability={availabilityByLake[lake._id]}
              availabilityDate={availabilityDate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LakesPage;
