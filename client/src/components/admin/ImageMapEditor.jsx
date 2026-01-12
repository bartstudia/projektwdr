import React, { useState, useRef, useEffect } from 'react';

const ImageMapEditor = ({
  lakeImage,
  onSave,
  existingSpots = [],
  lake,
  highlightedSpotId = null,
  initialShape = 'circle'
}) => {
  const [clickedPoints, setClickedPoints] = useState([]);
  const [shape, setShape] = useState(initialShape);
  const [previewCoords, setPreviewCoords] = useState(null);
  const [hoverPoint, setHoverPoint] = useState(null);
  const imageRef = useRef(null);

  const handleReset = () => {
    setClickedPoints([]);
    setPreviewCoords(null);
    setHoverPoint(null);
  };

  useEffect(() => {
    if (initialShape) {
      setShape(initialShape);
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialShape]);

  const handleImageClick = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    const newPoint = { x, y };
    const updatedPoints = [...clickedPoints, newPoint];
    setClickedPoints(updatedPoints);
    setHoverPoint(null);

    // Auto-complete based on shape
    if (shape === 'circle' && updatedPoints.length === 2) {
      // Second click defines radius
      const radius = Math.sqrt(
        Math.pow(x - updatedPoints[0].x, 2) +
        Math.pow(y - updatedPoints[0].y, 2)
      );
      const coords = [updatedPoints[0].x, updatedPoints[0].y, Math.round(radius)];
      handleComplete({ shape, coords });
    } else if (shape === 'rect' && updatedPoints.length === 2) {
      // Second click defines opposite corner
      const coords = [updatedPoints[0].x, updatedPoints[0].y, x, y];
      handleComplete({ shape, coords });
    }
  };

  const handleImageMouseMove = (e) => {
    if (!imageRef.current || clickedPoints.length === 0) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    if (shape === 'circle' && clickedPoints.length === 1) {
      const radius = Math.sqrt(
        Math.pow(x - clickedPoints[0].x, 2) +
        Math.pow(y - clickedPoints[0].y, 2)
      );
      setPreviewCoords({ shape: 'circle', x: clickedPoints[0].x, y: clickedPoints[0].y, radius });
    } else if (shape === 'rect' && clickedPoints.length === 1) {
      setPreviewCoords({ shape: 'rect', x1: clickedPoints[0].x, y1: clickedPoints[0].y, x2: x, y2: y });
    } else if (shape === 'poly') {
      setHoverPoint({ x, y });
    }
  };

  const handleComplete = (mapCoordinates) => {
    onSave(mapCoordinates);
    handleReset();
  };

  const handleUndoLastPoint = () => {
    if (clickedPoints.length === 0) return;
    setClickedPoints((prev) => prev.slice(0, -1));
  };

  const handlePolygonComplete = () => {
    if (clickedPoints.length < 3) {
      alert('Wielokąt musi mieć minimum 3 punkty');
      return;
    }

    const coords = [];
    clickedPoints.forEach(point => {
      coords.push(point.x, point.y);
    });

    handleComplete({ shape: 'poly', coords });
  };

  return (
    <div className="image-map-editor">
      <div className="editor-controls">
        <div className="control-group">
          <label>Kształt obszaru:</label>
          <select value={shape} onChange={(e) => { setShape(e.target.value); handleReset(); }}>
            <option value="circle">Okrąg (2 kliknięcia)</option>
            <option value="rect">Prostokąt (2 kliknięcia)</option>
            <option value="poly">Wielokąt (min. 3 kliknięcia)</option>
          </select>
        </div>

        {clickedPoints.length > 0 && (
          <div className="control-group">
            <p>Kliknięto punktów: {clickedPoints.length}</p>
            {shape === 'poly' && clickedPoints.length >= 3 && (
              <button type="button" onClick={handlePolygonComplete} className="btn-primary btn-small">
                Zakończ wielokąt
              </button>
            )}
            {shape === 'poly' && (
              <button type="button" onClick={handleUndoLastPoint} className="btn-secondary btn-small">
                Cofnij punkt
              </button>
            )}
            <button type="button" onClick={handleReset} className="btn-secondary btn-small">
              Reset
            </button>
          </div>
        )}
      </div>

      <div className="editor-instructions">
        <h4>Instrukcje:</h4>
        {shape === 'circle' && (
          <p>
            1. Kliknij w centrum okręgu<br />
            2. Kliknij na krawędzi okręgu (określi promień)
          </p>
        )}
        {shape === 'rect' && (
          <p>
            1. Kliknij w pierwszym rogu prostokąta<br />
            2. Kliknij w przeciwległym rogu
          </p>
        )}
        {shape === 'poly' && (
          <p>
            1. Kliknij kolejne punkty wielokąta (minimum 3)<br />
            2. Kliknij "Zakończ wielokąt" gdy skończysz
          </p>
        )}
      </div>

      {existingSpots.length > 0 && (
        <div className="editor-legend">
          <h4>Legenda:</h4>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-color existing-spot-color"></span>
              <span>Istniejące stanowiska ({existingSpots.length})</span>
            </div>
            {highlightedSpotId && (
              <div className="legend-item">
                <span className="legend-color editing-spot-color"></span>
                <span>Edytowane stanowisko</span>
              </div>
            )}
            <div className="legend-item">
              <span className="legend-color new-spot-color"></span>
              <span>Nowe stanowisko (w trakcie tworzenia)</span>
            </div>
          </div>
        </div>
      )}

      <div
        className="editor-canvas"
        onMouseMove={handleImageMouseMove}
      >
        <img
          ref={imageRef}
          src={lakeImage}
          alt="Edytor mapy"
          onClick={handleImageClick}
          className="editor-image"
        />

        {/* Render clicked points */}
        {clickedPoints.map((point, idx) => (
          <div
            key={idx}
            className="editor-point"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`
            }}
          >
            {idx + 1}
          </div>
        ))}

        {/* Render preview */}
        {previewCoords && previewCoords.shape === 'circle' && (
          <div
            className="editor-preview-circle"
            style={{
              left: `${previewCoords.x - previewCoords.radius}px`,
              top: `${previewCoords.y - previewCoords.radius}px`,
              width: `${previewCoords.radius * 2}px`,
              height: `${previewCoords.radius * 2}px`
            }}
          />
        )}

        {previewCoords && previewCoords.shape === 'rect' && (
          <div
            className="editor-preview-rect"
            style={{
              left: `${Math.min(previewCoords.x1, previewCoords.x2)}px`,
              top: `${Math.min(previewCoords.y1, previewCoords.y2)}px`,
              width: `${Math.abs(previewCoords.x2 - previewCoords.x1)}px`,
              height: `${Math.abs(previewCoords.y2 - previewCoords.y1)}px`
            }}
          />
        )}

        {/* Render polygon lines */}
        {shape === 'poly' && clickedPoints.length > 1 && (
          <svg className="editor-svg-overlay" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
            {clickedPoints.map((point, idx) => {
              if (idx === 0) return null;
              const prevPoint = clickedPoints[idx - 1];
              return (
                <line
                  key={idx}
                  x1={prevPoint.x}
                  y1={prevPoint.y}
                  x2={point.x}
                  y2={point.y}
                  stroke="#2196f3"
                  strokeWidth="2"
                />
              );
            })}
            {hoverPoint && clickedPoints.length > 0 && (
              <line
                x1={clickedPoints[clickedPoints.length - 1].x}
                y1={clickedPoints[clickedPoints.length - 1].y}
                x2={hoverPoint.x}
                y2={hoverPoint.y}
                stroke="#90caf9"
                strokeWidth="2"
                strokeDasharray="4 6"
              />
            )}
          </svg>
        )}

        {/* Render existing spots overlay */}
        {existingSpots.length > 0 && imageRef.current && lake && (
          <svg
            className="existing-spots-overlay"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
            viewBox={`0 0 ${lake.imageWidth || imageRef.current.offsetWidth} ${lake.imageHeight || imageRef.current.offsetHeight}`}
          >
            {existingSpots.map((spot) => {
              const coords = spot.mapCoordinates.coords;
              const isHighlighted = highlightedSpotId === spot._id;
              const fillColor = isHighlighted ? 'rgba(255, 152, 0, 0.25)' : 'rgba(158, 158, 158, 0.3)';
              const strokeColor = isHighlighted ? '#fb8c00' : '#757575';

              if (spot.mapCoordinates.shape === 'circle') {
                return (
                  <g key={spot._id}>
                    <circle
                      cx={coords[0]}
                      cy={coords[1]}
                      r={coords[2]}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                    <text
                      x={coords[0]}
                      y={coords[1]}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#424242"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {spot.name}
                    </text>
                  </g>
                );
              } else if (spot.mapCoordinates.shape === 'rect') {
                const x = Math.min(coords[0], coords[2]);
                const y = Math.min(coords[1], coords[3]);
                const width = Math.abs(coords[2] - coords[0]);
                const height = Math.abs(coords[3] - coords[1]);

                return (
                  <g key={spot._id}>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                    <text
                      x={x + width / 2}
                      y={y + height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#424242"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {spot.name}
                    </text>
                  </g>
                );
              } else if (spot.mapCoordinates.shape === 'poly') {
                const points = [];
                for (let i = 0; i < coords.length; i += 2) {
                  points.push(`${coords[i]},${coords[i + 1]}`);
                }
                const pointsStr = points.join(' ');

                // Calculate center for text
                let centerX = 0, centerY = 0;
                for (let i = 0; i < coords.length; i += 2) {
                  centerX += coords[i];
                  centerY += coords[i + 1];
                }
                centerX /= (coords.length / 2);
                centerY /= (coords.length / 2);

                return (
                  <g key={spot._id}>
                    <polygon
                      points={pointsStr}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                    <text
                      x={centerX}
                      y={centerY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#424242"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {spot.name}
                    </text>
                  </g>
                );
              }
              return null;
            })}
          </svg>
        )}
      </div>
    </div>
  );
};

export default ImageMapEditor;
