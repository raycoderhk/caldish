'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/lib/types/user';

const STORAGE_KEY = 'caldish_user_profile';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedProfile = JSON.parse(stored);
        setProfile(parsedProfile);
      }
    } catch (error) {
      console.warn('Failed to load user profile from storage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save profile to localStorage
  const saveProfile = useCallback((newProfile: UserProfile) => {
    try {
      setProfile(newProfile);
      
      // Only save to localStorage if there's actual data
      if (Object.keys(newProfile).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to save user profile to storage:', error);
    }
  }, []);

  // Clear profile
  const clearProfile = useCallback(() => {
    setProfile({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear user profile from storage:', error);
    }
  }, []);

  // Check if profile has meaningful data
  const hasProfile = Object.keys(profile).length > 0 && (
    profile.weight !== undefined ||
    profile.age !== undefined ||
    profile.gender !== undefined ||
    profile.activityLevel !== undefined
  );

  return {
    profile,
    isLoaded,
    hasProfile,
    saveProfile,
    clearProfile,
  };
};
