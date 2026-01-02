import React, { useState, useRef, useEffect } from 'react';

const ImageMap = ({ lake, spots, onSpotClick, selectedSpot, reservedSpotIds = [] }) => {
  const [hoveredSpot, setHoveredSpot] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  // Funkcja do skalowania współrzędnych z oryginalnych wymiarów obrazu do aktualnych
  const scaleCoordinates = (coords) => {
    if (!imageRef.current || !lake.imageWidth || !lake.imageHeight) {
      return coords.join(',');
    }

    const currentWidth = imageRef.current.offsetWidth;
    const currentHeight = imageRef.current.offsetHeight;
    const scaleX = currentWidth / lake.imageWidth;
    const scaleY = currentHeight / lake.imageHeight;

    const scaledCoords = coords.map((coord, index) => {
      if (index % 2 === 0) {
        // X coordinate
        return Math.round(coord * scaleX);
      } else {
        // Y coordinate
        return Math.round(coord * scaleY);
      }
    });

    return scaledCoords.join(',');
  };

  const handleAreaMouseEnter = (spot, event) => {
    setHoveredSpot(spot);
    const rect = imageRef.current.getBoundingClientRect();
    setTooltipPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  const handleAreaMouseLeave = () => {
    setHoveredSpot(null);
  };

  const handleAreaClick = (spot, event) => {
    event.preventDefault();

    // Sprawdź czy stanowisko jest zarezerwowane
    if (reservedSpotIds.includes(spot._id)) {
      alert('To stanowisko jest już zarezerwowane w wybranym terminie. Wybierz inne stanowisko lub zmień datę.');
      return;
    }

    onSpotClick(spot);
  };

  const isSpotReserved = (spotId) => {
    return reservedSpotIds.includes(spotId);
  };

  // Dodaj nasłuchiwanie resize dla responsywności
  useEffect(() => {
    const handleResize = () => {
      // Force re-render when window is resized
      if (imageRef.current) {
        imageRef.current.useMap = `#lake-map-${lake._id}`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [lake._id]);

  return (
    <div className="image-map-container">
      <div className="image-map-wrapper">
        <img
          ref={imageRef}
          src={`http://localhost:5000${lake.imageUrl}`}
          alt={lake.name}
          useMap={`#lake-map-${lake._id}`}
          className="lake-map-image"
        />

        <map name={`lake-map-${lake._id}`}>
          {spots.map((spot) => (
            <area
              key={spot._id}
              shape={spot.mapCoordinates.shape}
              coords={scaleCoordinates(spot.mapCoordinates.coords)}
              alt={spot.name}
              title={spot.name}
              onClick={(e) => handleAreaClick(spot, e)}
              onMouseEnter={(e) => handleAreaMouseEnter(spot, e)}
              onMouseLeave={handleAreaMouseLeave}
              className={`map-area ${selectedSpot?._id === spot._id ? 'selected' : ''}`}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </map>

        {/* Tooltip przy najechaniu */}
        {hoveredSpot && (
          <div
            className="map-tooltip"
            style={{
              left: `${tooltipPosition.x + 10}px`,
              top: `${tooltipPosition.y - 30}px`
            }}
          >
            {hoveredSpot.name}
          </div>
        )}

        {/* Wizualne oznaczenia stanowisk (opcjonalne overlay) */}
        <svg className="map-overlay" viewBox={`0 0 ${lake.imageWidth} ${lake.imageHeight}`}>
          {spots.map((spot) => {
            const coords = spot.mapCoordinates.coords;
            const isSelected = selectedSpot?._id === spot._id;
            const isReserved = isSpotReserved(spot._id);

            // Kolory: Czerwony = zarezerwowane, Niebieski = wybrane, Zielony = dostępne
            let fillColor, strokeColor;

            if (isReserved) {
              fillColor = 'rgba(211, 47, 47, 0.3)'; // Czerwony
              strokeColor = '#d32f2f';
            } else if (isSelected) {
              fillColor = 'rgba(33, 150, 243, 0.4)'; // Niebieski
              strokeColor = '#1976d2';
            } else {
              fillColor = 'rgba(76, 175, 80, 0.3)'; // Zielony
              strokeColor = '#4caf50';
            }

            if (spot.mapCoordinates.shape === 'circle') {
              return (
                <circle
                  key={spot._id}
                  cx={coords[0]}
                  cy={coords[1]}
                  r={coords[2]}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="3"
                  className={`spot-marker ${isReserved ? 'reserved' : ''}`}
                />
              );
            } else if (spot.mapCoordinates.shape === 'rect') {
              const x = Math.min(coords[0], coords[2]);
              const y = Math.min(coords[1], coords[3]);
              const width = Math.abs(coords[2] - coords[0]);
              const height = Math.abs(coords[3] - coords[1]);

              return (
                <rect
                  key={spot._id}
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="3"
                  className={`spot-marker ${isReserved ? 'reserved' : ''}`}
                />
              );
            }
            return null;
          })}
        </svg>
      </div>

      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-color available-green"></span>
          <span>Dostępne stanowisko</span>
        </div>
        <div className="legend-item">
          <span className="legend-color selected"></span>
          <span>Wybrane stanowisko</span>
        </div>
        <div className="legend-item">
          <span className="legend-color reserved-red"></span>
          <span>Zarezerwowane</span>
        </div>
      </div>
    </div>
  );
};

export default ImageMap;
