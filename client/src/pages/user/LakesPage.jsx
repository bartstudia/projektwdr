import React, { useState, useEffect } from 'react';
import lakeService from '../../services/lakeService';
import LakeCard from '../../components/user/LakeCard';

const LakesPage = () => {
  const [lakes, setLakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLakes();
  }, []);

  const fetchLakes = async () => {
    try {
      setLoading(true);
      const data = await lakeService.getAllLakes();
      setLakes(data.lakes || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Błąd podczas ładowania jezior');
    } finally {
      setLoading(false);
    }
  };

  const filteredLakes = lakes.filter(lake =>
    lake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lake.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {filteredLakes.length === 0 ? (
        <div className="empty-state">
          {searchTerm ? (
            <p>Nie znaleziono jezior pasujących do "{searchTerm}"</p>
          ) : (
            <p>Brak dostępnych jezior. Sprawdź ponownie później.</p>
          )}
        </div>
      ) : (
        <div className="lakes-grid-user">
          {filteredLakes.map((lake) => (
            <LakeCard key={lake._id} lake={lake} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LakesPage;
