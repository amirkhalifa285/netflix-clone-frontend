import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="netflix-footer">
      <div className="social-links">
        <a href="https://www.facebook.com/netflix" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.instagram.com/netflix" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://twitter.com/netflix" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="https://www.youtube.com/netflix" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <i className="fab fa-youtube"></i>
        </a>
      </div>
      
      <div className="footer-links">
        <div className="footer-column">
          <a href="#">Audio Description</a>
          <a href="#">Investor Relations</a>
          <a href="#">Privacy</a>
          <a href="#">Contact Us</a>
        </div>
        
        <div className="footer-column">
          <a href="#">Help Center</a>
          <a href="#">Jobs</a>
          <a href="#">Legal Notices</a>
          <a href="#">Do Not Sell or Share My Personal Information</a>
        </div>
        
        <div className="footer-column">
          <a href="#">Gift Cards</a>
          <a href="#">Netflix Shop</a>
          <a href="#">Cookie Preferences</a>
          <a href="#">Ad Choices</a>
        </div>
        
        <div className="footer-column">
          <a href="#">Media Center</a>
          <a href="#">Terms of Use</a>
          <a href="#">Corporate Information</a>
        </div>
      </div>
      
      <div className="service-code-container">
        <button className="service-code-btn">Service Code</button>
      </div>
      
      <div className="copyright">
        &copy; 1997-{new Date().getFullYear()} Netflix, Inc.
      </div>
    </footer>
  );
};

export default Footer;