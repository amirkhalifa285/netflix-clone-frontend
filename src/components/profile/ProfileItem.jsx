import React, { useState, useRef, useEffect } from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import '../../styles/Profile.css';

import Avatar1 from '../../assets/images/Avatar1.png';
import Avatar2 from '../../assets/images/Avatar2.png';
import Avatar3 from '../../assets/images/Avatar3.png';
import Avatar4 from '../../assets/images/Avatar4.png';

const ProfileItem = ({ profile }) => {
  const { selectProfile, updateProfile, deleteProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const inputRef = useRef(null);
  
  const avatarNumber = profile.avatar || Math.floor(Math.random() * 4) + 1;
  
  const avatarImages = {
    1: Avatar1,
    2: Avatar2,
    3: Avatar3,
    4: Avatar4
  };
  
  const avatarSrc = avatarImages[avatarNumber];
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleNameClick = (e) => {
    e.stopPropagation();
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
        if (name !== profile.name && name.length >= 2 && name.length <= 12) {
          await updateProfile(profile._id, name);
        } else if (name.length < 2 || name.length > 12) {
          setName(profile.name);
        }
        setIsEditing(false);
      } catch (err) {
        console.error('Failed to update profile name:', err);
      }
    } else if (e.key === 'Escape') {
      setName(profile.name);
      setIsEditing(false);
    }
  };
  
  const handleBlur = async () => {
    try {
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
      <div 
        className="profile-avatar-container"
        style={{
          backgroundImage: `url(${avatarSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
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