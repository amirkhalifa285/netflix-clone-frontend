import React from 'react';
import '../styles/Auth.css';

const Footer = () => {
  return (
    <div className="netflix-footer">
      <div className="footer-call">
        Questions? Call <a href="tel:1-844-505-2993">1-844-505-2993</a>
      </div>
      <div className="footer-links-grid">
        <a href="/#" className="footer-link">FAQ</a>
        <a href="/#" className="footer-link">Help Center</a>
        <a href="/#" className="footer-link">Netflix Shop</a>
        <a href="/#" className="footer-link">Terms of Use</a>
        <a href="/#" className="footer-link">Privacy</a>
        <a href="/#" className="footer-link">Cookie Preferences</a>
        <a href="/#" className="footer-link">Corporate Information</a>
        <a href="/#" className="footer-link">Do Not Sell or Share My Personal Information</a>
        <a href="/#" className="footer-link">Ad Choices</a>
      </div>
      <div className="language-dropdown">
        <select defaultValue="en">
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
        <span className="language-globe">🌐</span>
        <span className="dropdown-arrow">▼</span>
      </div>
    </div>
  );
};

export default Footer;