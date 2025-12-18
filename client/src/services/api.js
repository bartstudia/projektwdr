import axios from 'axios';

// Utwórz instancję axios z bazową konfiguracją
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - dodaj token do każdego zapytania
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - obsługa błędów
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Serwer odpowiedział z kodem błędu
      if (error.response.status === 401) {
        // Token wygasł lub jest nieprawidłowy
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      // Zwróć bardziej czytelny błąd
      return Promise.reject({
        message: error.response.data.message || 'Wystąpił błąd',
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      // Zapytanie zostało wysłane, ale nie otrzymano odpowiedzi
      return Promise.reject({
        message: 'Brak połączenia z serwerem',
        status: 0
      });
    } else {
      // Coś poszło nie tak podczas konfiguracji zapytania
      return Promise.reject({
        message: error.message || 'Nieznany błąd',
        status: 0
      });
    }
  }
);

export default api;
