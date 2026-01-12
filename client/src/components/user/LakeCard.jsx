import React from 'react';
import { Link } from 'react-router-dom';

const LakeCard = ({ lake, availability, availabilityDate }) => {
  const mapLink = lake.gpsLink || (
    lake.latitude !== null &&
    lake.latitude !== undefined &&
    lake.longitude !== null &&
    lake.longitude !== undefined
      ? `https://www.google.com/maps?q=${lake.latitude},${lake.longitude}`
      : null
  );

  return (
    <div className="lake-card">
      {lake.imageUrl && (
        <div className="lake-card-image">
          <img
            src={`http://localhost:5000${lake.imageUrl}`}
            alt={lake.name}
          />
        </div>
      )}
      <div className="lake-card-content">
        <h3>{lake.name}</h3>
        <p className="lake-card-location">
          <span className="location-icon">📍</span>
          {lake.location}
        </p>
        {mapLink && (
          <a
            href={mapLink}
            target="_blank"
            rel="noreferrer"
            className="lake-card-map-link"
          >
            Otwórz mapę
          </a>
        )}
        <p className="lake-card-description">
          {lake.description.length > 150
            ? `${lake.description.substring(0, 150)}...`
            : lake.description}
        </p>
        {availabilityDate && availability && (
          <div className="lake-availability">
            <span className="availability-label">Dostępność:</span>
            <span className={`availability-count ${availability.availableCount > 0 ? 'available' : 'unavailable'}`}>
              {availability.availableCount} / {availability.totalSpots}
            </span>
          </div>
        )}
        <Link to={`/lakes/${lake._id}`} className="btn-primary btn-card">
          Zobacz szczegóły
        </Link>
      </div>
    </div>
  );
};

export default LakeCard;
