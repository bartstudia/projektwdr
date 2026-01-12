import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import lakeService from '../../services/lakeService';
import LakeForm from '../../components/admin/LakeForm';

const ManageLakes = () => {
  const [lakes, setLakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLake, setEditingLake] = useState(null);
  const [selectedLakeIds, setSelectedLakeIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    fetchLakes();
  }, []);

  useEffect(() => {
    setSelectedLakeIds((prev) => prev.filter((id) => lakes.some((lake) => lake._id === id)));
  }, [lakes]);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to jezioro? Spowoduje to usunięcie wszystkich powiązanych stanowisk.')) {
      return;
    }

    try {
      await lakeService.deleteLake(id);
      fetchLakes();
    } catch (err) {
      alert(err.message || 'Błąd podczas usuwania jeziora');
    }
  };

  const toggleLakeSelection = (lakeId) => {
    setSelectedLakeIds((prev) => (
      prev.includes(lakeId) ? prev.filter((id) => id !== lakeId) : [...prev, lakeId]
    ));
  };

  const toggleSelectAll = () => {
    if (selectedLakeIds.length === lakes.length) {
      setSelectedLakeIds([]);
      return;
    }
    setSelectedLakeIds(lakes.map((lake) => lake._id));
  };

  const handleBulkUpdate = async (isActive) => {
    if (selectedLakeIds.length === 0) return;

    try {
      setBulkLoading(true);
      await Promise.all(
        lakes
          .filter((lake) => selectedLakeIds.includes(lake._id))
          .filter((lake) => lake.isActive !== isActive)
          .map((lake) => lakeService.updateLake(lake._id, { isActive }))
      );
      await fetchLakes();
      setSelectedLakeIds([]);
    } catch (err) {
      alert(err.message || 'Błąd podczas masowej aktualizacji');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLakeIds.length === 0) return;
    if (!window.confirm('Czy na pewno chcesz usunąć wybrane jeziora?')) {
      return;
    }

    try {
      setBulkLoading(true);
      await Promise.all(selectedLakeIds.map((lakeId) => lakeService.deleteLake(lakeId)));
      await fetchLakes();
      setSelectedLakeIds([]);
    } catch (err) {
      alert(err.message || 'Błąd podczas masowego usuwania jezior');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleEdit = (lake) => {
    setEditingLake(lake);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingLake(null);
    fetchLakes();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingLake(null);
  };

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
      <div className="manage-lakes-header">
        <h1>Zarządzanie Jeziorami</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Anuluj' : '+ Dodaj Jezioro'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <div className="form-section">
          <LakeForm
            lake={editingLake}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {lakes.length > 0 && (
        <div className="bulk-actions-bar">
          <div className="bulk-info">Zaznaczono: {selectedLakeIds.length}</div>
          <label className="bulk-select-all">
            <input
              type="checkbox"
              checked={selectedLakeIds.length === lakes.length}
              onChange={toggleSelectAll}
            />
            Zaznacz wszystkie
          </label>
          <div className="bulk-actions">
            <button
              onClick={() => handleBulkUpdate(true)}
              className="btn-primary btn-small"
              disabled={bulkLoading || selectedLakeIds.length === 0}
            >
              Aktywuj
            </button>
            <button
              onClick={() => handleBulkUpdate(false)}
              className="btn-secondary btn-small"
              disabled={bulkLoading || selectedLakeIds.length === 0}
            >
              Dezaktywuj
            </button>
            <button
              onClick={handleBulkDelete}
              className="btn-danger btn-small"
              disabled={bulkLoading || selectedLakeIds.length === 0}
            >
              Usuń
            </button>
          </div>
        </div>
      )}

      <div className="lakes-list">
        {lakes.length === 0 ? (
          <div className="empty-state">
            <p>Brak jezior w systemie. Dodaj pierwsze jezioro!</p>
          </div>
        ) : (
          <div className="lakes-grid">
            {lakes.map((lake) => (
              <div key={lake._id} className="lake-admin-card">
                <div className="lake-admin-select">
                  <input
                    type="checkbox"
                    checked={selectedLakeIds.includes(lake._id)}
                    onChange={() => toggleLakeSelection(lake._id)}
                    aria-label={`Zaznacz ${lake.name}`}
                  />
                </div>
                {lake.imageUrl && (
                  <img
                    src={`http://localhost:5000${lake.imageUrl}`}
                    alt={lake.name}
                    className="lake-image"
                  />
                )}
                <div className="lake-info">
                  <h3>{lake.name}</h3>
                  <p className="lake-location">{lake.location}</p>
                  <p className="lake-description">{lake.description}</p>
                  <span className={`status-badge ${lake.isActive ? 'status-confirmed' : 'status-cancelled'}`}>
                    {lake.isActive ? 'Aktywne' : 'Nieaktywne'}
                  </span>
                </div>
                <div className="lake-actions">
                  <button
                    onClick={() => handleEdit(lake)}
                    className="btn-secondary btn-small"
                  >
                    Edytuj
                  </button>
                  <Link
                    to={`/admin/lakes/${lake._id}/spots`}
                    className="btn-primary btn-small"
                  >
                    Stanowiska
                  </Link>
                  <button
                    onClick={() => handleDelete(lake._id)}
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

export default ManageLakes;
