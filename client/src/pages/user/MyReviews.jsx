import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import reviewService from '../../services/reviewService';

const MyReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await reviewService.getMyReviews();
      setReviews(data.reviews || []);
    } catch (err) {
      setError(err.message || 'Błąd podczas ładowania opinii');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review._id);
    setEditForm({
      rating: review.rating,
      comment: review.comment
    });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditForm({ rating: 0, comment: '' });
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      await reviewService.updateReview(reviewId, editForm);
      setEditingReview(null);
      setEditForm({ rating: 0, comment: '' });
      fetchMyReviews();
      alert('Opinia została zaktualizowana');
    } catch (err) {
      alert(err.message || 'Błąd podczas aktualizacji opinii');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę opinię?')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      fetchMyReviews();
      alert('Opinia została usunięta');
    } catch (err) {
      alert(err.message || 'Błąd podczas usuwania opinii');
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className="star-rating-input">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            onClick={() => interactive && onStarClick && onStarClick(star)}
            style={{ cursor: interactive ? 'pointer' : 'default', fontSize: interactive ? '2rem' : '1.5rem' }}
          >
            ★
          </span>
        ))}
        {interactive && <span className="rating-label">{rating}/5</span>}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
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
      <div className="my-reviews-header">
        <h1>Moje Opinie</h1>
        <button onClick={() => navigate('/lakes')} className="btn-primary">
          Dodaj nową opinię
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {reviews.length === 0 ? (
        <div className="empty-state">
          <h2>Brak opinii</h2>
          <p>Nie dodałeś jeszcze żadnych opinii. Odwiedź jezioro i podziel się swoimi wrażeniami!</p>
          <button onClick={() => navigate('/lakes')} className="btn-primary">
            Przeglądaj Jeziora
          </button>
        </div>
      ) : (
        <div className="my-reviews-list">
          {reviews.map((review) => (
            <div key={review._id} className="my-review-card">
              {/* Nagłówek z informacją o jeziorze */}
              <div className="review-lake-header">
                {review.lakeId?.imageUrl && (
                  <img
                    src={`http://localhost:5000${review.lakeId.imageUrl}`}
                    alt={review.lakeId.name}
                    className="review-lake-thumb"
                  />
                )}
                <div className="review-lake-info">
                  <h3>{review.lakeId?.name}</h3>
                  <p className="lake-location-small">{review.lakeId?.location}</p>
                  <button
                    onClick={() => navigate(`/lakes/${review.lakeId?._id}`)}
                    className="btn-link"
                  >
                    Zobacz jezioro →
                  </button>
                </div>
              </div>

              {editingReview === review._id ? (
                // Tryb edycji
                <div className="review-edit-form">
                  <div className="form-group">
                    <label>Twoja ocena:</label>
                    {renderStars(editForm.rating, true, (rating) =>
                      setEditForm({ ...editForm, rating })
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor={`comment-${review._id}`}>Komentarz:</label>
                    <textarea
                      id={`comment-${review._id}`}
                      value={editForm.comment}
                      onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                      rows="5"
                      minLength={10}
                      maxLength={1000}
                    />
                    <small className="form-hint">{editForm.comment.length}/1000 znaków</small>
                  </div>

                  <div className="review-edit-actions">
                    <button
                      onClick={() => handleUpdateReview(review._id)}
                      className="btn-primary"
                      disabled={editForm.rating === 0 || editForm.comment.trim().length < 10}
                    >
                      Zapisz zmiany
                    </button>
                    <button onClick={handleCancelEdit} className="btn-secondary">
                      Anuluj
                    </button>
                  </div>
                </div>
              ) : (
                // Tryb wyświetlania
                <>
                  <div className="review-rating-display">
                    {renderStars(review.rating)}
                  </div>

                  <div className="review-comment-display">
                    <p>{review.comment}</p>
                  </div>

                  <div className="review-meta">
                    <span className="review-date-small">
                      Dodano: {formatDate(review.createdAt)}
                      {review.updatedAt !== review.createdAt && (
                        <span className="edited-badge-small"> (edytowano)</span>
                      )}
                    </span>
                  </div>

                  <div className="review-actions-user">
                    <button
                      onClick={() => handleEditClick(review)}
                      className="btn-secondary btn-small"
                    >
                      Edytuj
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="btn-danger btn-small"
                    >
                      Usuń
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
