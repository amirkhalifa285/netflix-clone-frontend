import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profileService from '../services/profileService';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
    const [profiles, setProfiles] = useState([]);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch all profiles
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                setLoading(true);
                const response = await profileService.getProfiles();
                setProfiles(response.data);

                // Check if there's a selected profile in session storage
                const savedProfileId = sessionStorage.getItem('currentProfileId');
                if (savedProfileId) {
                    const savedProfile = response.data.find(profile => profile._id === savedProfileId);
                    if (savedProfile) {
                        setCurrentProfile(savedProfile);
                    }
                }
            } catch (err) {
                console.error('Error fetching profiles:', err);
                setError('Failed to load profiles');
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    // Select a profile and save to session storage
    const selectProfile = (profile) => {
        setCurrentProfile(profile);
        sessionStorage.setItem('currentProfileId', profile._id);
        navigate('/browse'); // Redirect to homepage after profile selection
    };

    // Create a new profile
    const createProfile = async (name = 'Profile') => {
        try {
            setLoading(true);
            setError('');

            const response = await profileService.createProfile({ name });
            setProfiles([...profiles, response.data]);
            return response.data;
        } catch (err) {
            console.error('Error creating profile:', err);
            setError(err.response?.data?.message || 'Failed to create profile');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update a profile
    const updateProfile = async (profileId, name) => {
        try {
            setLoading(true);
            setError('');

            // Validate name length
            if (name.length < 2 || name.length > 12) {
                setError('Profile name must be between 2 and 12 characters');
                setLoading(false);
                throw new Error('Profile name must be between 2 and 12 characters');
            }

            const response = await profileService.updateProfile(profileId, { name });

            // Update profiles state
            setProfiles(profiles.map(profile =>
                profile._id === profileId ? response.data : profile
            ));

            // Update current profile if it's the one being updated
            if (currentProfile && currentProfile._id === profileId) {
                setCurrentProfile(response.data);
            }

            return response.data;
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || err.message || 'Failed to update profile');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete a profile
    const deleteProfile = async (profileId) => {
        try {
            setLoading(true);
            setError('');

            await profileService.deleteProfile(profileId);

            // Remove from profiles state
            setProfiles(profiles.filter(profile => profile._id !== profileId));

            // Clear current profile if it's the one being deleted
            if (currentProfile && currentProfile._id === profileId) {
                setCurrentProfile(null);
                sessionStorage.removeItem('currentProfileId');
            }
        } catch (err) {
            console.error('Error deleting profile:', err);
            setError(err.response?.data?.message || 'Failed to delete profile');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Clear error
    const clearError = () => {
        setError('');
    };

    // Add to My List
    const addToMyList = async (contentId) => {
        if (!currentProfile) return;

        try {
            setLoading(true);
            const response = await profileService.addToMyList(currentProfile._id, contentId);

            // Update current profile with new myList (if returned by API)
            if (response.data && response.data.myList) {
                setCurrentProfile({
                    ...currentProfile,
                    myList: response.data.myList
                });
            }

            return response;
        } catch (err) {
            console.error('Error adding to My List:', err);
            setError('Failed to add to My List');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Remove from My List
    const removeFromMyList = async (contentId) => {
        if (!currentProfile) return;

        try {
            setLoading(true);
            const response = await profileService.removeFromMyList(currentProfile._id, contentId);

            // Update current profile with new myList (if returned by API)
            if (response.data && response.data.myList) {
                setCurrentProfile({
                    ...currentProfile,
                    myList: response.data.myList
                });
            }

            return response;
        } catch (err) {
            console.error('Error removing from My List:', err);
            setError('Failed to remove from My List');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        profiles,
        currentProfile,
        loading,
        error,
        selectProfile,
        createProfile,
        updateProfile,
        deleteProfile,
        clearError,
        addToMyList,
        removeFromMyList
    };

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export default ProfileContext;