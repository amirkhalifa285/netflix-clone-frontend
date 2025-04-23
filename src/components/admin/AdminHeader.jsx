// src/components/admin/AdminHeader.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Header.css';

const AdminHeader = () => {
  const { logout, currentUser } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Add background when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-left">
        <div className="logo">
          <Link to="/admin">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="30" viewBox="0 0 111 30" fill="#e50914" className="netflix-logo">
              <path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.563 26.937c-4.187-.281-8.375-.53-12.656-.625V0h4.687v21.875c2.688.062 5.375.28 7.969.405v4.657zM64.25 10.657v4.687h-6.406V26H53.22V0h13.125v4.687h-8.5v5.97h6.406zm-18.906-5.97V26.25c-1.563 0-3.156 0-4.688.062V4.687h-4.844V0h14.406v4.687h-4.874zM30.75 15.593c-2.062 0-4.5 0-6.25.095v6.968c2.75-.188 5.5-.406 8.281-.5v4.5l-12.968 1.032V0H32.78v4.687H24.5V11c1.813 0 4.594-.094 6.25-.094v4.688zM4.78 12.968v16.375C3.094 29.531 1.593 29.75 0 30V0h4.469l6.093 17.032V0h4.688v28.062c-1.656.282-3.344.376-5.125.625L4.78 12.968z"/>
            </svg>
          </Link>
        </div>
        
        <div className="admin-title">Admin Dashboard</div>
      </div>
      
      <div className="header-right">
        <div className="profile-menu">
          <button 
            className="profile-button" 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="admin-avatar">
              <span>A</span>
            </div>
            <span className="caret-down">▼</span>
          </button>
          
          {showProfileMenu && (
            <div className="dropdown-menu">
              <ul>
                <li className="profile-name">Admin: {currentUser?.email}</li>
                <li><Link to="/browse">Browse Netflix</Link></li>
                <li>
                  <button onClick={logout}>Sign Out of Netflix</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;