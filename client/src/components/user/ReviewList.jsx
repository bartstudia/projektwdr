import React, { useState, useEffect } from 'react';
import reviewService from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';

const ReviewList = ({ lakeId, onReviewAdded }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [lakeId, onReviewAdded]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await reviewService.getReviewsByLake(lakeId);
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);
    } catch (err) {
      setError(err.message || 'Błąd podczas ładowania opinii');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę opinię?')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      fetchReviews();
      if (onReviewAdded) onReviewAdded();
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
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="reviews-loading">
        <div className="loading-spinner">Ładowanie opinii...</div>
      </div>
    );
  }

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2>Opinie użytkowników</h2>
        {totalReviews > 0 && (
          <div className="reviews-summary">
            <div className="average-rating">
              {renderStars(Math.round(averageRating))}
              <span className="rating-number">
                {averageRating.toFixed(1)} / 5
              </span>
            </div>
            <p className="reviews-count">
              Na podstawie {totalReviews} {totalReviews === 1 ? 'opinii' : 'opinii'}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {reviews.length === 0 ? (
        <div className="empty-reviews">
          <p>Brak opinii. Bądź pierwszy i dodaj swoją opinię!</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="review-author-info">
                  <div className="author-avatar">
                    {review.userId?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="author-name">{review.userId?.name}</h4>
                    <p className="review-date">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>

              <div className="review-content">
                <p>{review.comment}</p>
              </div>

              {user && user.userId === review.userId?._id && (
                <div className="review-actions">
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="btn-danger btn-small"
                  >
                    Usuń
                  </button>
                </div>
              )}

              {review.updatedAt !== review.createdAt && (
                <p className="review-edited">
                  (edytowano {formatDate(review.updatedAt)})
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
