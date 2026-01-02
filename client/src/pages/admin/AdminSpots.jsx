import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import spotService from '../../services/spotService';
import lakeService from '../../services/lakeService';

const AdminSpots = () => {
  const navigate = useNavigate();
  const [spots, setSpots] = useState([]);
  const [lakes, setLakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLake, setSelectedLake] = useState('');

  useEffect(() => {
    fetchLakes();
    fetchAllSpots();
  }, []);

  const fetchLakes = async () => {
    try {
      const data = await lakeService.getAllLakes();
      setLakes(data.lakes || []);
    } catch (err) {
      console.error('Błąd podczas ładowania jezior:', err);
    }
  };

  const fetchAllSpots = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await spotService.getAllSpots();
      setSpots(data.spots || []);
    } catch (err) {
      setError(err.message || 'Błąd podczas ładowania stanowisk');
    } finally {
      setLoading(false);
    }
  };

  const handleLakeFilterChange = async (lakeId) => {
    setSelectedLake(lakeId);

    if (!lakeId) {
      fetchAllSpots();
      return;
    }

    try {
      setLoading(true);
      const data = await spotService.getSpotsByLake(lakeId);
      setSpots(data.spots || []);
    } catch (err) {
      setError(err.message || 'Błąd podczas ładowania stanowisk');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSpot = async (spotId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to stanowisko?')) {
      return;
    }

    try {
      await spotService.deleteSpot(spotId);
      if (selectedLake) {
        handleLakeFilterChange(selectedLake);
      } else {
        fetchAllSpots();
      }
    } catch (err) {
      alert(err.message || 'Błąd podczas usuwania stanowiska');
    }
  };

  const handleToggleActive = async (spot) => {
    try {
      await spotService.updateSpot(spot._id, {
        isActive: !spot.isActive
      });

      if (selectedLake) {
        handleLakeFilterChange(selectedLake);
      } else {
        fetchAllSpots();
      }
    } catch (err) {
      alert(err.message || 'Błąd podczas zmiany statusu stanowiska');
    }
  };

  const getShapeLabel = (shape) => {
    const shapes = {
      circle: 'Okrąg',
      rect: 'Prostokąt',
      poly: 'Wielokąt'
    };
    return shapes[shape] || shape;
  };

  const getLakeNameById = (lakeId) => {
    const lake = lakes.find(l => l._id === lakeId);
    return lake ? `${lake.name} (${lake.location})` : 'N/A';
  };

  if (loading && spots.length === 0) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner">Ładowanie stanowisk...</div>
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
        <h1>Wszystkie Stanowiska Wędkarskie</h1>
        <p className="subtitle">Zarządzaj stanowiskami we wszystkich jeziorach</p>
      </div>

      {/* Filtr */}
      <div className="filters-section">
        <div className="form-group">
          <label htmlFor="lakeFilter">Filtruj po jeziorze:</label>
          <select
            id="lakeFilter"
            value={selectedLake}
            onChange={(e) => handleLakeFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="">Wszystkie jeziora</option>
            {lakes.map(lake => (
              <option key={lake._id} value={lake._id}>
                {lake.name} - {lake.location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statystyki */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">{spots.length}</div>
          <div className="stat-label">Wszystkich stanowisk</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {spots.filter(s => s.isActive).length}
          </div>
          <div className="stat-label">Aktywnych</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {spots.filter(s => !s.isActive).length}
          </div>
          <div className="stat-label">Nieaktywnych</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{lakes.length}</div>
          <div className="stat-label">Jezior</div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Lista stanowisk */}
      {spots.length === 0 ? (
        <div className="empty-state">
          <p>Brak stanowisk dla wybranych kryteriów</p>
          <button onClick={() => navigate('/admin/lakes')} className="btn-primary">
            Przejdź do jezior
          </button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nazwa stanowiska</th>
                <th>Jezioro</th>
                <th>Opis</th>
                <th>Kształt</th>
                <th>Status</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {spots.map((spot) => (
                <tr key={spot._id}>
                  <td>
                    <strong>{spot.name}</strong>
                  </td>
                  <td>{getLakeNameById(spot.lakeId)}</td>
                  <td>
                    {spot.description ? (
                      <small>{spot.description}</small>
                    ) : (
                      <span className="text-muted">Brak opisu</span>
                    )}
                  </td>
                  <td>
                    <span className="shape-badge">
                      {getShapeLabel(spot.mapCoordinates?.shape)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${spot.isActive ? 'status-confirmed' : 'status-cancelled'}`}>
                      {spot.isActive ? 'Aktywne' : 'Nieaktywne'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => handleToggleActive(spot)}
                        className={`btn-small ${spot.isActive ? 'btn-secondary' : 'btn-primary'}`}
                        title={spot.isActive ? 'Dezaktywuj' : 'Aktywuj'}
                      >
                        {spot.isActive ? 'Dezaktywuj' : 'Aktywuj'}
                      </button>
                      <button
                        onClick={() => navigate(`/admin/lakes/${spot.lakeId}/spots`)}
                        className="btn-primary btn-small"
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDeleteSpot(spot._id)}
                        className="btn-danger btn-small"
                      >
                        Usuń
                      </button>
                    </div>
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

export default AdminSpots;
