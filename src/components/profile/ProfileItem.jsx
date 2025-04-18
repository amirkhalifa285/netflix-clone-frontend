import React, { useState, useRef, useEffect } from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import '../../styles/Profile.css';

const ProfileItem = ({ profile }) => {
  const { selectProfile, updateProfile, deleteProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const inputRef = useRef(null);
  
  // Get avatar image based on avatar number
  const avatarSrc = require(`../../assets/images/Avatar${profile.avatar}.png`);
  
  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleNameClick = (e) => {
    e.stopPropagation(); // Prevent profile selection when clicking name
    setIsEditing(true);
  };
  
  const handleProfileClick = () => {
    if (!isEditing) {
      selectProfile(profile);
    }
  };
  
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  
  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      try {
        // Only update if name has changed and meets length requirements
        if (name !== profile.name && name.length >= 2 && name.length <= 12) {
          await updateProfile(profile._id, name);
        } else if (name.length < 2 || name.length > 12) {
          // Reset to original name if invalid
          setName(profile.name);
        }
        setIsEditing(false);
      } catch (err) {
        console.error('Failed to update profile name:', err);
      }
    } else if (e.key === 'Escape') {
      // Reset to original name and cancel editing
      setName(profile.name);
      setIsEditing(false);
    }
  };
  
  const handleBlur = async () => {
    try {
      // Only update if name has changed and meets length requirements
      if (name !== profile.name && name.length >= 2 && name.length <= 12) {
        await updateProfile(profile._id, name);
      } else {
        // Reset to original name if invalid
        setName(profile.name);
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile name:', err);
    }
  };
  
  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent profile selection when deleting
    try {
      await deleteProfile(profile._id);
    } catch (err) {
      console.error('Failed to delete profile:', err);
    }
  };
  
  return (
    <div className="profile-item" onClick={handleProfileClick}>
      <div className="profile-avatar-container">
        <img 
          src={avatarSrc} 
          alt={`${profile.name}'s avatar`} 
          className="profile-avatar" 
        />
        <button 
          className="profile-delete-button" 
          onClick={handleDelete}
          title="Delete profile"
        >
          ✕
        </button>
      </div>
      
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="profile-name-edit"
          value={name}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          maxLength={12}
        />
      ) : (
        <div className="profile-name" onClick={handleNameClick}>
          {profile.name}
        </div>
      )}
    </div>
  );
};

export default ProfileItem;