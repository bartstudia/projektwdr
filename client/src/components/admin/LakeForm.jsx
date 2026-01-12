import React, { useState, useEffect } from 'react';
import lakeService from '../../services/lakeService';

const LakeForm = ({ lake, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    gpsLink: '',
    latitude: '',
    longitude: '',
    rules: '',
    fees: '',
    contactInfo: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (lake) {
      setFormData({
        name: lake.name || '',
        description: lake.description || '',
        location: lake.location || '',
        gpsLink: lake.gpsLink || '',
        latitude: lake.latitude ?? '',
        longitude: lake.longitude ?? '',
        rules: lake.rules || '',
        fees: lake.fees || '',
        contactInfo: lake.contactInfo || '',
        isActive: lake.isActive !== undefined ? lake.isActive : true
      });
      if (lake.imageUrl) {
        setImagePreview(`http://localhost:5000${lake.imageUrl}`);
      }
    }
  }, [lake]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      // UtwÃ³rz podglÄ…d
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let savedLake;

      const payload = {
        ...formData,
        gpsLink: formData.gpsLink.trim() || null,
        latitude: formData.latitude !== '' ? Number(formData.latitude) : null,
        longitude: formData.longitude !== '' ? Number(formData.longitude) : null,
        rules: formData.rules.trim() || null,
        fees: formData.fees.trim() || null,
        contactInfo: formData.contactInfo.trim() || null,
        isActive: formData.isActive
      };

      if (lake) {
        // Aktualizuj istniejŽ£…ce jezioro
        const result = await lakeService.updateLake(lake._id, payload);
        savedLake = result.lake;
      } else {
        // UtwŽ£…rz nowe jezioro
        const result = await lakeService.createLake(payload);
        savedLake = result.lake;
      }

      // JeÅ›li wybrano nowy obraz, upload go
      if (imageFile) {
        await lakeService.uploadImage(savedLake._id, imageFile);
      }

            // Reset formularza
      setFormData({
        name: '',
        description: '',
        location: '',
        gpsLink: '',
        latitude: '',
        longitude: '',
        rules: '',
        fees: '',
        contactInfo: '',
        isActive: true
      });
      setImageFile(null);
      setImagePreview(null);

      onSuccess();
    } catch (err) {
      setError(err.message || 'BÅ‚Ä…d podczas zapisywania jeziora');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lake-form-container">
      <h2>{lake ? 'Edytuj Jezioro' : 'Dodaj Nowe Jezioro'}</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="lake-form">
        <div className="form-group">
          <label htmlFor="name">Nazwa jeziora*:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="np. Jezioro Åšniardwy"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Lokalizacja*:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="np. wojewÃ³dztwo warmiÅ„sko-mazurskie"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Opis*:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Opisz jezioro, jakie ryby moÅ¼na zÅ‚owiÄ‡, udogodnienia itp."
          />
        </div>

        <div className="form-group">
          <label htmlFor="gpsLink">Link do mapy (opcjonalnie):</label>
          <input
            type="url"
            id="gpsLink"
            name="gpsLink"
            value={formData.gpsLink}
            onChange={handleChange}
            placeholder="https://www.google.com/maps?q=..."
          />
        </div>

        <div className="form-group">
          <label>Wspó³rzêdne GPS (opcjonalnie):</label>
          <div className="gps-inputs">
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="Latitude"
              step="0.000001"
            />
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="Longitude"
              step="0.000001"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="rules">Regulamin (opcjonalnie):</label>
          <textarea
            id="rules"
            name="rules"
            value={formData.rules}
            onChange={handleChange}
            rows="4"
            placeholder="Zasady korzystania z jeziora..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="fees">Op³aty (opcjonalnie):</label>
          <textarea
            id="fees"
            name="fees"
            value={formData.fees}
            onChange={handleChange}
            rows="3"
            placeholder="Np. 20 z³/dzieñ, 100 z³/tydzieñ..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactInfo">Kontakt (opcjonalnie):</label>
          <textarea
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            rows="3"
            placeholder="Telefon, email, strona www..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="isActive">Status:</label>
          <select
            id="isActive"
            name="isActive"
            value={formData.isActive ? 'active' : 'inactive'}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
          >
            <option value="active">Aktywne</option>
            <option value="inactive">Nieaktywne</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image">Obraz jeziora (mapa):</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          <small>Dozwolone formaty: JPG, PNG, GIF, WebP. Maksymalny rozmiar: 10MB</small>
        </div>

        {imagePreview && (
          <div className="image-preview">
            <p>PodglÄ…d obrazu:</p>
            <img src={imagePreview} alt="PodglÄ…d" />
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Zapisywanie...' : (lake ? 'Zapisz Zmiany' : 'Dodaj Jezioro')}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
};

export default LakeForm;






