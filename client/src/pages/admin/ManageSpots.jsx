import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import lakeService from '../../services/lakeService';
import spotService from '../../services/spotService';
import ImageMapEditor from '../../components/admin/ImageMapEditor';

const ManageSpots = () => {
  const { lakeId } = useParams();
  const navigate = useNavigate();
  const [lake, setLake] = useState(null);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [newSpot, setNewSpot] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, [lakeId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const lakeData = await lakeService.getLakeById(lakeId);
      setLake(lakeData.lake);
      setSpots(lakeData.spots || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Błąd podczas ładowania danych');
    } finally {
      setLoading(false);
    }
  };

  const handleMapCoordinatesSave = async (mapCoordinates) => {
    if (!newSpot.name) {
      alert('Proszę podać nazwę stanowiska');
      setShowEditor(false);
      return;
    }

    try {
      await spotService.createSpot({
        lakeId,
        name: newSpot.name,
        description: newSpot.description,
        mapCoordinates
      });

      setNewSpot({ name: '', description: '' });
      setShowEditor(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Błąd podczas tworzenia stanowiska');
    }
  };

  const handleDeleteSpot = async (spotId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to stanowisko?')) {
      return;
    }

    try {
      await spotService.deleteSpot(spotId);
      fetchData();
    } catch (err) {
      alert(err.message || 'Błąd podczas usuwania stanowiska');
    }
  };

  const handleAddSpotClick = () => {
    if (!lake.imageUrl) {
      alert('Jezioro musi mieć obraz przed dodaniem stanowisk');
      return;
    }
    setShowEditor(true);
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
        <button onClick={() => navigate('/admin/lakes')} className="btn-secondary">
          Powrót do jezior
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate('/admin/lakes')} className="btn-back">
        ← Powrót do jezior
      </button>

      <div className="manage-spots-header">
        <div>
          <h1>Stanowiska - {lake?.name}</h1>
          <p>{lake?.location}</p>
        </div>
        {!showEditor && (
          <button onClick={handleAddSpotClick} className="btn-primary">
            + Dodaj Stanowisko
          </button>
        )}
      </div>

      {showEditor && (
        <div className="spot-editor-section">
          <h2>Dodaj nowe stanowisko</h2>

          <div className="form-group">
            <label htmlFor="spotName">Nazwa stanowiska*:</label>
            <input
              type="text"
              id="spotName"
              value={newSpot.name}
              onChange={(e) => setNewSpot({ ...newSpot, name: e.target.value })}
              placeholder="np. Stanowisko 1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="spotDescription">Opis (opcjonalnie):</label>
            <textarea
              id="spotDescription"
              value={newSpot.description}
              onChange={(e) => setNewSpot({ ...newSpot, description: e.target.value })}
              placeholder="Dodatkowe informacje o stanowisku..."
              rows="3"
            />
          </div>

          <p className="editor-info">
            Teraz kliknij na obrazie jeziora, aby zaznaczyć lokalizację stanowiska:
          </p>

          <ImageMapEditor
            lakeImage={`http://localhost:5000${lake.imageUrl}`}
            onSave={handleMapCoordinatesSave}
            existingSpots={spots}
            lake={lake}
          />

          <button
            onClick={() => {
              setShowEditor(false);
              setNewSpot({ name: '', description: '' });
            }}
            className="btn-secondary"
          >
            Anuluj
          </button>
        </div>
      )}

      <div className="spots-list-admin">
        <h2>Istniejące stanowiska ({spots.length})</h2>

        {spots.length === 0 ? (
          <div className="empty-state">
            <p>Brak stanowisk. Dodaj pierwsze stanowisko!</p>
          </div>
        ) : (
          <div className="spots-grid-admin">
            {spots.map((spot) => (
              <div key={spot._id} className="spot-admin-card">
                <h3>{spot.name}</h3>
                {spot.description && <p>{spot.description}</p>}
                <div className="spot-meta">
                  <span>Kształt: {spot.mapCoordinates.shape}</span>
                  <span className={`spot-status ${spot.isActive ? 'active' : 'inactive'}`}>
                    {spot.isActive ? 'Aktywne' : 'Nieaktywne'}
                  </span>
                </div>
                <div className="spot-actions">
                  <button
                    onClick={() => handleDeleteSpot(spot._id)}
                    className="btn-danger btn-small"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSpots;
