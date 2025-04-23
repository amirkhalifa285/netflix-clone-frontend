import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import '../styles/Header.css';

const Header = () => {
  const { logout, currentUser } = useAuth(); 
  
  let currentProfile = null;
  let profileContextAvailable = true;
  
  try {
    const profileContext = useProfile();
    currentProfile = profileContext?.currentProfile;
  } catch (error) {
    profileContextAvailable = false;
  }
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
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

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const isAdminPage = location.pathname.startsWith('/admin');

  const getAvatarSrc = () => {
    if (currentProfile && currentProfile.avatar) {
      try {
        return require(`../assets/images/Avatar${currentProfile.avatar}.png`);
      } catch (error) {
        console.error('Error loading avatar image', error);
      }
    }
    
    try {
      return require('../assets/images/Avatar1.png');
    } catch (error) {
      return 'https://via.placeholder.com/32';
    }
  };
  
  return (
    <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-left">
        <div className="logo">
          <Link to={isAdminPage || !profileContextAvailable ? "/admin" : "/browse"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="30" viewBox="0 0 111 30" fill="#e50914" className="netflix-logo">
              <path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.563 26.937c-4.187-.281-8.375-.53-12.656-.625V0h4.687v21.875c2.688.062 5.375.28 7.969.405v4.657zM64.25 10.657v4.687h-6.406V26H53.22V0h13.125v4.687h-8.5v5.97h6.406zm-18.906-5.97V26.25c-1.563 0-3.156 0-4.688.062V4.687h-4.844V0h14.406v4.687h-4.874zM30.75 15.593c-2.062 0-4.5 0-6.25.095v6.968c2.75-.188 5.5-.406 8.281-.5v4.5l-12.968 1.032V0H32.78v4.687H24.5V11c1.813 0 4.594-.094 6.25-.094v4.688zM4.78 12.968v16.375C3.094 29.531 1.593 29.75 0 30V0h4.469l6.093 17.032V0h4.688v28.062c-1.656.282-3.344.376-5.125.625L4.78 12.968z"/>
            </svg>
          </Link>
        </div>
        
        {!isAdminPage && profileContextAvailable ? (
          <nav className="main-nav">
            <ul>
              <li className={isActive('/browse')}><Link to="/browse">Home</Link></li>
              <li className={isActive('/tv-shows')}><Link to="/tv-shows">TV Shows</Link></li>
              <li className={isActive('/movies')}><Link to="/movies">Movies</Link></li>
              <li className={isActive('/new-popular')}><Link to="/new-popular">New & Popular</Link></li>
              <li className={isActive('/my-list')}><Link to="/my-list">My List</Link></li>
              <li className={isActive('/search')}><Link to="/search">Browse</Link></li>
            </ul>
          </nav>
        ) : (
          // Admin navigation
          <nav className="main-nav">
            <ul>
              <li className={isActive('/admin')}><Link to="/admin">Admin Dashboard</Link></li>
            </ul>
          </nav>
        )}
      </div>
      
      <div className="header-right">
        {!isAdminPage && profileContextAvailable && (
          <>
            <div className="search-container">
              <button className="icon-button search-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M14 11C14 14.3137 11.3137 17 8 17C4.68629 17 2 14.3137 2 11C2 7.68629 4.68629 5 8 5C11.3137 5 14 7.68629 14 11ZM14.3623 15.8506C12.9006 17.7649 10.5945 19 8 19C3.58172 19 0 15.4183 0 11C0 6.58172 3.58172 3 8 3C12.4183 3 16 6.58172 16 11C16 12.1076 15.7749 13.1626 15.368 14.1218L24.0022 19.1352L22.9979 20.8648L14.3623 15.8506Z" fill="white"/>
                </svg>
              </button>
            </div>
            
            <div className="notification-container">
              <button className="icon-button notification-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M13 4.07092C16.3922 4.55624 19 7.47353 19 11V15.2538C20.0486 15.3307 21.0848 15.4245 22 15.5347V17.5347C20.8146 17.405 19.5976 17.3009 18.3767 17.2211C18.1313 18.8569 16.7024 20.1137 15 20.2533V21C15 22.6569 13.6569 24 12 24C10.3431 24 9 22.6569 9 21V20.2533C7.29763 20.1137 5.86868 18.8569 5.62333 17.2211C4.40235 17.3009 3.18536 17.405 2 17.5347V15.5347C2.91519 15.4245 3.95143 15.3307 5 15.2538V11C5 7.47353 7.60784 4.55624 11 4.07092V2H13V4.07092ZM7 15.1287C7.6687 15.0664 8.33486 15.0156 9 14.9766C9.66514 15.0156 10.3313 15.0664 11 15.1287V17H7V15.1287ZM13 15.1287C13.6687 15.0664 14.3349 15.0156 15 14.9766C15.6651 15.0156 16.3313 15.0664 17 15.1287V17H13V15.1287ZM12 22C11.4477 22 11 21.5523 11 21V20.2533H13V21C13 21.5523 12.5523 22 12 22Z" fill="white"/>
                </svg>
              </button>
            </div>
          </>
        )}
        
        <div className="profile-menu">
          <button 
            className="profile-button" 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {isAdminPage || !profileContextAvailable ? (
              <div className="admin-avatar">
                <span>A</span>
              </div>
            ) : (
              <img 
                src={getAvatarSrc()} 
                alt={currentProfile ? currentProfile.name : "Profile"} 
                className="profile-avatar"
              />
            )}
            <span className="caret-down">▼</span>
          </button>
          
          {showProfileMenu && (
            <div className="dropdown-menu">
              <ul>
                {currentProfile && profileContextAvailable && (
                  <li className="profile-name">{currentProfile.name}</li>
                )}
                
                {currentUser?.role === 'admin' && !isAdminPage && (
                  <li><Link to="/admin">Admin Dashboard</Link></li>
                )}
                
                {!isAdminPage && profileContextAvailable && (
                  <li><Link to="/profiles">Switch Profiles</Link></li>
                )}
                
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

export default Header;