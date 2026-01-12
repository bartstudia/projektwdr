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
  const [editingSpot, setEditingSpot] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [newSpot, setNewSpot] = useState({
    name: '',
    description: '',
    gpsLink: '',
    latitude: '',
    longitude: ''
  });
  const [editSpot, setEditSpot] = useState({
    name: '',
    description: '',
    gpsLink: '',
    latitude: '',
    longitude: '',
    isActive: true
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
        mapCoordinates,
        gpsLink: newSpot.gpsLink.trim() || null,
        latitude: newSpot.latitude !== '' ? Number(newSpot.latitude) : null,
        longitude: newSpot.longitude !== '' ? Number(newSpot.longitude) : null
      });

      setNewSpot({
        name: '',
        description: '',
        gpsLink: '',
        latitude: '',
        longitude: ''
      });
      setShowEditor(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Błąd podczas tworzenia stanowiska');
    }
  };

  const handleEditSpotStart = (spot) => {
    if (!lake.imageUrl) {
      alert('Jezioro musi mieć obraz przed edycją stanowisk');
      return;
    }
    setShowEditor(false);
    setEditingSpot(spot);
    setEditSpot({
      name: spot.name || '',
      description: spot.description || '',
      gpsLink: spot.gpsLink || '',
      latitude: spot.latitude ?? '',
      longitude: spot.longitude ?? '',
      isActive: spot.isActive
    });
  };

  const handleEditCancel = () => {
    setEditingSpot(null);
    setEditSpot({
      name: '',
      description: '',
      gpsLink: '',
      latitude: '',
      longitude: '',
      isActive: true
    });
  };

  const handleEditSave = async () => {
    if (!editingSpot) return;
    if (!editSpot.name) {
      alert('Proszę podać nazwę stanowiska');
      return;
    }

    try {
      setSavingEdit(true);
      await spotService.updateSpot(editingSpot._id, {
        name: editSpot.name,
        description: editSpot.description,
        gpsLink: editSpot.gpsLink.trim() || null,
        latitude: editSpot.latitude !== '' ? Number(editSpot.latitude) : null,
        longitude: editSpot.longitude !== '' ? Number(editSpot.longitude) : null,
        isActive: editSpot.isActive
      });
      handleEditCancel();
      fetchData();
    } catch (err) {
      alert(err.message || 'Błąd podczas zapisywania stanowiska');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleEditMapSave = async (mapCoordinates) => {
    if (!editingSpot) return;
    if (!editSpot.name) {
      alert('Proszę podać nazwę stanowiska');
      return;
    }

    try {
      setSavingEdit(true);
      await spotService.updateSpot(editingSpot._id, {
        name: editSpot.name,
        description: editSpot.description,
        mapCoordinates,
        gpsLink: editSpot.gpsLink.trim() || null,
        latitude: editSpot.latitude !== '' ? Number(editSpot.latitude) : null,
        longitude: editSpot.longitude !== '' ? Number(editSpot.longitude) : null,
        isActive: editSpot.isActive
      });
      handleEditCancel();
      fetchData();
    } catch (err) {
      alert(err.message || 'Błąd podczas aktualizacji mapy');
    } finally {
      setSavingEdit(false);
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
    setEditingSpot(null);
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
        {!showEditor && !editingSpot && (
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

          <div className="form-group">
            <label htmlFor="spotGpsLink">Link do mapy (opcjonalnie):</label>
            <input
              type="url"
              id="spotGpsLink"
              value={newSpot.gpsLink}
              onChange={(e) => setNewSpot({ ...newSpot, gpsLink: e.target.value })}
              placeholder="https://www.google.com/maps?q=..."
            />
          </div>

          <div className="form-group">
            <label>Współrzędne GPS (opcjonalnie):</label>
            <div className="gps-inputs">
              <input
                type="number"
                value={newSpot.latitude}
                onChange={(e) => setNewSpot({ ...newSpot, latitude: e.target.value })}
                placeholder="Latitude"
                step="0.000001"
              />
              <input
                type="number"
                value={newSpot.longitude}
                onChange={(e) => setNewSpot({ ...newSpot, longitude: e.target.value })}
                placeholder="Longitude"
                step="0.000001"
              />
            </div>
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
              setNewSpot({
                name: '',
                description: '',
                gpsLink: '',
                latitude: '',
                longitude: ''
              });
            }}
            className="btn-secondary"
          >
            Anuluj
          </button>
        </div>
      )}

      {editingSpot && (
        <div className="spot-editor-section">
          <h2>Edytuj stanowisko: {editingSpot.name}</h2>

          <div className="form-group">
            <label htmlFor="editSpotName">Nazwa stanowiska*:</label>
            <input
              type="text"
              id="editSpotName"
              value={editSpot.name}
              onChange={(e) => setEditSpot({ ...editSpot, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="editSpotDescription">Opis (opcjonalnie):</label>
            <textarea
              id="editSpotDescription"
              value={editSpot.description}
              onChange={(e) => setEditSpot({ ...editSpot, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="editSpotGpsLink">Link do mapy (opcjonalnie):</label>
            <input
              type="url"
              id="editSpotGpsLink"
              value={editSpot.gpsLink}
              onChange={(e) => setEditSpot({ ...editSpot, gpsLink: e.target.value })}
              placeholder="https://www.google.com/maps?q=..."
            />
          </div>

          <div className="form-group">
            <label>Współrzędne GPS (opcjonalnie):</label>
            <div className="gps-inputs">
              <input
                type="number"
                value={editSpot.latitude}
                onChange={(e) => setEditSpot({ ...editSpot, latitude: e.target.value })}
                placeholder="Latitude"
                step="0.000001"
              />
              <input
                type="number"
                value={editSpot.longitude}
                onChange={(e) => setEditSpot({ ...editSpot, longitude: e.target.value })}
                placeholder="Longitude"
                step="0.000001"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="editSpotActive">Status:</label>
            <select
              id="editSpotActive"
              value={editSpot.isActive ? 'active' : 'inactive'}
              onChange={(e) => setEditSpot({ ...editSpot, isActive: e.target.value === 'active' })}
            >
              <option value="active">Aktywne</option>
              <option value="inactive">Nieaktywne</option>
            </select>
          </div>

          <div className="spot-editor-actions">
            <button
              onClick={handleEditSave}
              className="btn-primary"
              disabled={savingEdit}
            >
              {savingEdit ? 'Zapisywanie...' : 'Zapisz dane'}
            </button>
            <button
              onClick={handleEditCancel}
              className="btn-secondary"
              disabled={savingEdit}
            >
              Anuluj
            </button>
          </div>

          <p className="editor-info">
            Kliknij na obrazie, aby zmienić kształt stanowiska:
          </p>

          <ImageMapEditor
            lakeImage={`http://localhost:5000${lake.imageUrl}`}
            onSave={handleEditMapSave}
            existingSpots={spots}
            lake={lake}
            highlightedSpotId={editingSpot._id}
            initialShape={editingSpot.mapCoordinates?.shape || 'circle'}
          />
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
                    onClick={() => handleEditSpotStart(spot)}
                    className="btn-secondary btn-small"
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSpots;
