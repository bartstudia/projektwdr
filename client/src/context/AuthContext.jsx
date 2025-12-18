import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth musi być użyty wewnątrz AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sprawdź czy użytkownik jest zalogowany przy montowaniu komponentu
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const response = await authService.getMe();
          setUser(response.user);
        } catch (error) {
          console.error('Błąd weryfikacji użytkownika:', error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Funkcja logowania
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login({ email, password });
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.message || 'Błąd podczas logowania';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Funkcja rejestracji
  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.message || 'Błąd podczas rejestracji';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Funkcja wylogowania
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Sprawdź czy użytkownik jest adminem
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
