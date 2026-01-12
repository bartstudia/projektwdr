import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setErrors('Wszystkie pola są wymagane');
      return false;
    }

    if (formData.password.length < 6) {
      setErrors('Hasło musi mieć minimum 6 znaków');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors('Hasła nie są identyczne');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        // Przekieruj do dashboardu użytkownika
        navigate('/dashboard');
      } else {
        setErrors(result.error || 'Błąd podczas rejestracji');
      }
    } catch (error) {
      setErrors('Wystąpił nieoczekiwany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <h2>Rejestracja</h2>

      {errors && (
        <div className="error-message">
          {errors}
        </div>
      )}

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="name">Imię:</label>
          <input
            type="text"
            id="name"
            name="name"
            data-testid="register-name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Wprowadź swoje imię"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            data-testid="register-email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Wprowadź swój email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Hasło:</label>
          <input
            type="password"
            id="password"
            name="password"
            data-testid="register-password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Wprowadź hasło (min. 6 znaków)"
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Potwierdź hasło:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            data-testid="register-confirm"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Wprowadź hasło ponownie"
            minLength="6"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading} data-testid="register-submit">
          {isLoading ? 'Rejestracja...' : 'Zarejestruj się'}
        </button>
      </form>

      <p className="form-footer">
        Masz już konto? <Link to="/login">Zaloguj się</Link>
      </p>
    </div>
  );
};

export default RegisterForm;
