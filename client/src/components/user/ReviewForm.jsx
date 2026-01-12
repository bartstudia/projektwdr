import React, { useState, useEffect } from 'react';
import reservationService from '../../services/reservationService';
import reviewService from '../../services/reviewService';

const ReviewForm = ({ lakeId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [canReview, setCanReview] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);

  useEffect(() => {
    checkReviewEligibility();
  }, [lakeId]);

  const checkReviewEligibility = async () => {
    try {
      setCheckingEligibility(true);
      // Sprawdź czy użytkownik ma rezerwację na tym jeziorze
      const response = await reservationService.getMyReservations({ upcoming: false });
      const hasReservation = response.reservations.some(
        (r) => r.lakeId?._id === lakeId && r.status === 'confirmed'
      );
      setCanReview(hasReservation);

      if (!hasReservation) {
        setError('Aby dodać opinię, musisz najpierw odwiedzić to jezioro (mieć potwierdzoną rezerwację).');
      }
    } catch (err) {
      console.error('Błąd podczas sprawdzania uprawnień:', err);
      setCanReview(false);
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Proszę wybrać ocenę');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Komentarz musi mieć minimum 10 znaków');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      await reviewService.createReview({
        lakeId,
        rating,
        comment: comment.trim()
      });

      // Reset formularza
      setRating(0);
      setComment('');
      setCanReview(false);

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      alert('Dziękujemy za dodanie opinii!');
    } catch (err) {
      setError(err.message || 'Błąd podczas dodawania opinii');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="star-rating-input">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            data-testid={`review-star-${star}`}
            className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''} ${
              hoveredRating === star ? 'hovered' : ''
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            style={{ cursor: 'pointer', fontSize: '2rem' }}
          >
            ★
          </span>
        ))}
        <span className="rating-label">
          {rating > 0 ? `${rating} / 5` : 'Wybierz ocenę'}
        </span>
      </div>
    );
  };

  if (checkingEligibility) {
    return (
      <div className="review-form-loading">
        <div className="loading-spinner">Sprawdzanie uprawnień...</div>
      </div>
    );
  }

  if (!canReview) {
    return (
      <div className="review-form-info">
        <p className="info-message">
          {error || 'Aby dodać opinię, musisz najpierw odwiedzić to jezioro.'}
        </p>
      </div>
    );
  }

  return (
    <div className="review-form-section">
      <h3>Dodaj swoją opinię</h3>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Twoja ocena*:</label>
          {renderStars()}
        </div>

        <div className="form-group">
          <label htmlFor="comment">Twój komentarz*:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Podziel się swoimi wrażeniami z tego miejsca..."
            rows="5"
            minLength={10}
            maxLength={1000}
            required
            data-testid="review-comment"
          />
          <small className="form-hint">
            {comment.length}/1000 znaków (minimum 10)
          </small>
        </div>

        {error && !error.includes('musisz najpierw') && (
          <div className="error-message" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => {
              setRating(0);
              setComment('');
              setError('');
            }}
            className="btn-secondary"
            disabled={submitting}
          >
            Wyczyść
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting || rating === 0 || comment.trim().length < 10}
            data-testid="review-submit"
          >
            {submitting ? 'Dodawanie...' : 'Dodaj opinię'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
