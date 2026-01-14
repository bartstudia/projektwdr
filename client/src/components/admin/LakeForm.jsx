import React, { useState, useEffect } from 'react';
import lakeService from '../../services/lakeService';

const LakeForm = ({ lake, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    mapIframe: '',
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
        mapIframe: lake.mapIframe || '',
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

      // Utwórz podgląd
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
        mapIframe: formData.mapIframe.trim() || null,
        rules: formData.rules.trim() || null,
        fees: formData.fees.trim() || null,
        contactInfo: formData.contactInfo.trim() || null,
        isActive: formData.isActive
      };

      if (lake) {
        // Aktualizuj istniej���ce jezioro
        const result = await lakeService.updateLake(lake._id, payload);
        savedLake = result.lake;
      } else {
        // Utw���rz nowe jezioro
        const result = await lakeService.createLake(payload);
        savedLake = result.lake;
      }

      // Jeśli wybrano nowy obraz, upload go
      if (imageFile) {
        await lakeService.uploadImage(savedLake._id, imageFile);
      }

            // Reset formularza
      setFormData({
        name: '',
        description: '',
        location: '',
        mapIframe: '',
        rules: '',
        fees: '',
        contactInfo: '',
        isActive: true
      });
      setImageFile(null);
      setImagePreview(null);

      onSuccess();
    } catch (err) {
      setError(err.message || 'Błąd podczas zapisywania jeziora');
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
            placeholder="np. Jezioro Śniardwy"
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
            placeholder="np. województwo warmińsko-mazurskie"
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
            placeholder="Opisz jezioro, jakie ryby można złowić, udogodnienia itp."
          />
        </div>

        <div className="form-group">
          <label htmlFor="mapIframe">Mapa dojazdowa - iframe z Google Maps (opcjonalnie):</label>
          <textarea
            id="mapIframe"
            name="mapIframe"
            value={formData.mapIframe}
            onChange={handleChange}
            rows="4"
            placeholder='Wklej kod iframe z Google Maps, np: <iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>'
          />
          <small>Aby uzyskać kod iframe: Google Maps → Udostępnij → Umieść mapę → Skopiuj kod HTML</small>
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
          <label htmlFor="fees">Op�aty (opcjonalnie):</label>
          <textarea
            id="fees"
            name="fees"
            value={formData.fees}
            onChange={handleChange}
            rows="3"
            placeholder="Np. 20 z�/dzie�, 100 z�/tydzie�..."
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
            <p>Podgląd obrazu:</p>
            <img src={imagePreview} alt="Podgląd" />
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






