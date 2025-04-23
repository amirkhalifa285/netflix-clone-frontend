import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateLogin } from '../utils/validation';
import Footer from '../components/Footer'; // Import the Footer component
import '../styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateLogin(formData);
    setErrors(validationErrors);
    
    // If no errors, proceed with login
    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsSubmitting(true);
        
        // Prepare credentials
        const credentials = {
          // Server expects either email or phone
          ...(formData.emailOrPhone.includes('@') 
            ? { email: formData.emailOrPhone } 
            : { phone: formData.emailOrPhone }),
          password: formData.password
        };
        
        const userData = await login(credentials, formData.rememberMe);
        
        // Add explicit navigation based on role
        if (userData && userData.user && userData.user.role === 'admin') {
          window.location.href = '/admin'; // Force navigation to admin dashboard
        }
      } catch (err) {
        console.error('Login error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-overlay">
        <div className="auth-header">
          <Link to="/" className="netflix-logo">
            <img src={require('../assets/images/netflix-logo.png')} alt="Netflix" />
          </Link>
        </div>
        
        <div className="auth-form-container">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            
            {error && <div className="auth-error">{error}</div>}
            
            <div className="form-group">
              <input
                type="text"
                name="emailOrPhone"
                placeholder="Email or phone number"
                value={formData.emailOrPhone}
                onChange={handleChange}
                className={errors.emailOrPhone ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.emailOrPhone && <span className="error-message">{errors.emailOrPhone}</span>}
            </div>
            
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <button
              type="submit"
              className="auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
            
            <div className="remember-forgot">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
              <a href="/#" className="help-link">Need help?</a>
            </div>
            
            <div className="auth-footer">
              <p>
                New to Netflix? <Link to="/signup">Sign up now</Link>
              </p>
            </div>
            
            <div className="auth-disclaimer">
              <p>
                This page is protected by Google reCAPTCHA to ensure you're not a bot. 
                <a href="/#"> Learn more</a>
              </p>
            </div>
          </form>
        </div>
        
        <Footer /> {/* Add the Footer component here */}
      </div>
    </div>
  );
};

export default Login;