import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import reviewService from '../../services/reviewService';
import lakeService from '../../services/lakeService';

const AdminReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [lakes, setLakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLake, setSelectedLake] = useState('');

  useEffect(() => {
    fetchLakes();
    fetchReviews();
  }, []);

  const fetchLakes = async () => {
    try {
      const data = await lakeService.getAllLakes();
      setLakes(data.lakes || []);
    } catch (err) {
      console.error('Błąd podczas ładowania jezior:', err);
    }
  };

  const fetchReviews = async (lakeId = null) => {
    try {
      setLoading(true);
      setError('');
      const data = await reviewService.getAllReviews(lakeId);
      setReviews(data.reviews || []);
    } catch (err) {
      setError(err.message || 'Błąd podczas ładowania opinii');
    } finally {
      setLoading(false);
    }
  };

  const handleLakeFilterChange = (lakeId) => {
    setSelectedLake(lakeId);
    fetchReviews(lakeId || null);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę opinię?')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      fetchReviews(selectedLake || null);
    } catch (err) {
      alert(err.message || 'Błąd podczas usuwania opinii');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner">Ładowanie opinii...</div>
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
        <h1>Opinie Użytkowników</h1>
        <p className="subtitle">Zarządzaj recenzjami i opiniami</p>
      </div>

      {/* Filtr i statystyki */}
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
          <div className="stat-number">{reviews.length}</div>
          <div className="stat-label">Wszystkich opinii</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{calculateAverageRating()}</div>
          <div className="stat-label">Średnia ocena</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {reviews.filter(r => r.rating >= 4).length}
          </div>
          <div className="stat-label">Pozytywnych (≥4★)</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {reviews.filter(r => r.rating <= 2).length}
          </div>
          <div className="stat-label">Negatywnych (≤2★)</div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Lista opinii */}
      {reviews.length === 0 ? (
        <div className="empty-state">
          <p>Brak opinii dla wybranych kryteriów</p>
        </div>
      ) : (
        <div className="reviews-admin-list">
          {reviews.map((review) => (
            <div key={review._id} className="review-admin-card">
              <div className="review-admin-header">
                <div className="review-admin-user">
                  <div className="author-avatar">
                    {review.userId?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4>{review.userId?.name}</h4>
                    <p className="user-email">{review.userId?.email}</p>
                  </div>
                </div>
                <div className="review-admin-rating">
                  {renderStars(review.rating)}
                  <span className="rating-number">{review.rating}/5</span>
                </div>
              </div>

              <div className="review-admin-lake">
                <strong>Jezioro:</strong> {review.lakeId?.name} ({review.lakeId?.location})
              </div>

              <div className="review-admin-content">
                <p>{review.comment}</p>
              </div>

              <div className="review-admin-footer">
                <div className="review-date">
                  Dodano: {formatDate(review.createdAt)}
                  {review.updatedAt !== review.createdAt && (
                    <span className="edited-badge"> (edytowano)</span>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="btn-danger btn-small"
                >
                  Usuń opinię
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
