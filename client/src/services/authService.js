import api from './api';

const authService = {
  // Rejestracja użytkownika
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logowanie
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Wylogowanie
  logout: () => {
    localStorage.removeItem('token');
  },

  // Pobranie aktualnie zalogowanego użytkownika
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Sprawdź czy użytkownik jest zalogowany
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Pobierz token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;
