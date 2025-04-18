import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        
        if (token) {
          const userData = await authService.getCurrentUser();
          setCurrentUser(userData);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        // Clear any invalid tokens
        sessionStorage.removeItem('token');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const register = async (userData) => {
    try {
      setLoading(true);
      setError('');
      const response = await authService.register(userData);
      navigate('/login');
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials, rememberMe) => {
    try {
      setLoading(true);
      setError('');
      const data = await authService.login(credentials);
      
      // Store token based on remember me preference
      if (rememberMe) {
        localStorage.setItem('token', data.token);
      } else {
        sessionStorage.setItem('token', data.token);
      }
      
      setCurrentUser(data.user);
      // Redirect to profiles page instead of browse
      navigate('/profiles');
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setCurrentUser(null);
      // Clear tokens
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
      // Clear profile selection
      sessionStorage.removeItem('currentProfileId');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;