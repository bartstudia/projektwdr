import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="Logo" className="navbar-logo-image" />
          Rezerwacje Wędkarskie
        </Link>

        <div className="navbar-menu">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="navbar-link">
                Logowanie
              </Link>
              <Link to="/register" className="navbar-link btn-primary-small">
                Rejestracja
              </Link>
            </>
          ) : (
            <>
              <span className="navbar-user">
                Witaj, {user?.name}
              </span>

              {user?.role === 'admin' ? (
                <Link to="/admin" className="navbar-link">
                  Panel Admina
                </Link>
              ) : (
                <Link to="/dashboard" className="navbar-link">
                  Mój Panel
                </Link>
              )}

              <button onClick={handleLogout} className="navbar-link btn-logout">
                Wyloguj
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
