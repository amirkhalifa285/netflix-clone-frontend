import React from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import '../../styles/Profile.css';

const AddProfileButton = () => {
  const { profiles, createProfile } = useProfile();
  
  // Hide button if max profiles (5) reached
  if (profiles.length >= 5) {
    return null;
  }
  
  const handleAddProfile = async () => {
    try {
      await createProfile('Profile');
    } catch (err) {
      console.error('Failed to create profile:', err);
      // Error is handled in context and displayed via ErrorPopup
    }
  };
  
  return (
    <div className="profile-item" onClick={handleAddProfile}>
      <div className="add-profile-button">
        <span>+</span>
      </div>
      <div className="add-profile-name">Add Profile</div>
    </div>
  );
};

export default AddProfileButton;