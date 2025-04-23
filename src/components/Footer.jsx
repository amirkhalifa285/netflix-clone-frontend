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
          <a href="https://help.netflix.com/en/node/100612">Audio Description</a>
          <a href="https://ir.netflix.net">Investor Relations</a>
          <a href="https://help.netflix.com/legal/privacy">Privacy</a>
          <a href="https://help.netflix.com/contactus">Contact Us</a>
        </div>

        <div className="footer-column">
          <a href="https://help.netflix.com">Help Center</a>
          <a href="https://jobs.netflix.com">Jobs</a>
          <a href="https://help.netflix.com/legal/notices">Legal Notices</a>
          <a href="https://www.netflix.com/privacy">Do Not Sell or Share My Personal Information</a>
        </div>

        <div className="footer-column">
          <a href="https://www.netflix.com/gift-cards">Gift Cards</a>
          <a href="https://www.netflix.shop">Netflix Shop</a>
          <a href="https://www.netflix.com/account/CookiePreferences">Cookie Preferences</a>
          <a href="https://www.netflix.com/ad-choices">Ad Choices</a>
        </div>

        <div className="footer-column">
          <a href="https://media.netflix.com">Media Center</a>
          <a href="https://help.netflix.com/legal/termsofuse">Terms of Use</a>
          <a href="https://help.netflix.com/legal/corpinfo">Corporate Information</a>
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