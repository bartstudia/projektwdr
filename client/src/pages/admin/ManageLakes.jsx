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

      <div className="lakes-list">
        {lakes.length === 0 ? (
          <div className="empty-state">
            <p>Brak jezior w systemie. Dodaj pierwsze jezioro!</p>
          </div>
        ) : (
          <div className="lakes-grid">
            {lakes.map((lake) => (
              <div key={lake._id} className="lake-admin-card">
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
