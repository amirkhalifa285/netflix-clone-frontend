import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import ProfileItem from '../components/profile/ProfileItem';
import AddProfileButton from '../components/profile/AddProfileButton';
import ErrorPopup from '../components/common/ErrorPopup';
import '../styles/Profile.css';

const ProfileSelection = () => {
  const { currentUser } = useAuth();
  const { profiles, loading, error, clearError } = useProfile();
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Show loading state
  if (loading && profiles.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="profile-selection-container">
      <h1 className="profile-selection-title">Who's watching?</h1>
      
      <div className="profiles-container">
        {profiles.map(profile => (
          <ProfileItem key={profile._id} profile={profile} />
        ))}
        
        <AddProfileButton />
      </div>
      
      {error && (
        <ErrorPopup message={error} onClose={clearError} />
      )}
    </div>
  );
};

export default ProfileSelection;