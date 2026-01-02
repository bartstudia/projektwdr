import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>O nas</h3>
          <p>
            System rezerwacji stanowisk wędkarskich. Twój ulubiony sposób na
            zaplanowanie perfekcyjnej sesji wędkarskiej.
          </p>
        </div>

        <div className="footer-section">
          <h3>Szybkie linki</h3>
          <ul className="footer-links">
            <li><Link to="/lakes">Jeziora</Link></li>
            <li><Link to="/my-reservations">Moje rezerwacje</Link></li>
            <li><Link to="/my-reviews">Moje opinie</Link></li>
            <li><Link to="/dashboard">Panel użytkownika</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Informacje prawne</h3>
          <ul className="footer-links">
            <li><Link to="/privacy-policy">Polityka prywatności</Link></li>
            <li><Link to="/terms-of-service">Regulamin serwisu</Link></li>
            <li><Link to="/cookie-policy">Polityka cookies</Link></li>
            <li><Link to="/contact">Kontakt</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Kontakt</h3>
          <ul className="footer-contact">
            <li>📧 kontakt@rezerwacje-wedkarskie.pl</li>
            <li>📞 +48 123 456 789</li>
            <li>📍 Warszawa, Polska</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {currentYear} System Rezerwacji Stanowisk Wędkarskich.
          Wszelkie prawa zastrzeżone.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
