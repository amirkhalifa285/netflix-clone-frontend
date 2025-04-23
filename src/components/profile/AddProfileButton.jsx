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
      const generateUniqueName = () => {
        const baseNames = ["Profile", "User", "Viewer"];
        const baseName = baseNames[Math.floor(Math.random() * baseNames.length)];
        
        const baseNameExists = profiles.some(profile => 
          profile.name.toLowerCase() === baseName.toLowerCase());
        
        if (!baseNameExists) return baseName;
        
        for (let i = 1; i <= 10; i++) {
          const nameWithNumber = `${baseName} ${i}`;
          const exists = profiles.some(profile => 
            profile.name.toLowerCase() === nameWithNumber.toLowerCase());
          
          if (!exists) return nameWithNumber;
        }
        
        // Last resort - use timestamp
        return `${baseName} ${Date.now().toString().slice(-4)}`;
      };
      
      const uniqueName = generateUniqueName();
      await createProfile(uniqueName);
    } catch (err) {
      console.error('Failed to create profile:', err);
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