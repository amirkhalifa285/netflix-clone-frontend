import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateRegistration, isEmailOrPhone } from '../utils/validation';
import Footer from '../components/Footer'; // Import the Footer component
import '../styles/Auth.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, error } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateRegistration(formData);
    setErrors(validationErrors);
    
    // If no errors, proceed with registration
    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsSubmitting(true);
        
        // Determine if input is email or phone
        const inputType = isEmailOrPhone(formData.emailOrPhone);
        
        // Prepare user data based on input type
        const userData = {
          password: formData.password
        };
        
        if (inputType === 'email') {
          userData.email = formData.emailOrPhone;
        } else {
          userData.phone = formData.emailOrPhone;
        }
        
        await register(userData);
      } catch (err) {
        console.error('Registration error:', err);
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
            <h1>Sign Up</h1>
            
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
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
            
            <div className="auth-footer">
              <p>
                Already have an account? <Link to="/login">Sign in now</Link>
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

export default SignUp;