// localStorage utility functions for managing user data

export const localStorageKeys = {
  MOCK_SESSION: 'mockSession',
  MOCK_PROFILE: 'mockProfile',
  MOCK_LINKS: 'mockLinks',
  ONBOARDING_PROGRESS: 'onboardingProgress',
  USER_PREFERENCES: 'userPreferences',
} as const;

export const saveToLocalStorage = (key: string, data: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
};

export const clearAllMockData = (): void => {
  Object.values(localStorageKeys).forEach(key => {
    if (key.includes('mock')) {
      removeFromLocalStorage(key);
    }
  });
};

export const getMockSession = () => {
  try {
    const mockSession = localStorage.getItem(localStorageKeys.MOCK_SESSION);
    const mockProfile = localStorage.getItem(localStorageKeys.MOCK_PROFILE);
    
    if (mockSession) {
      const session = JSON.parse(mockSession);
      return {
        user: session.user,
        profile: mockProfile ? JSON.parse(mockProfile) : null
      };
    }
    return null;
  } catch (error) {
    console.error('Error parsing mock session:', error);
    return null;
  }
};

export const updateMockProfile = (updates: any): boolean => {
  try {
    const existingProfile = localStorage.getItem(localStorageKeys.MOCK_PROFILE);
    const currentProfile = existingProfile ? JSON.parse(existingProfile) : {};
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return saveToLocalStorage(localStorageKeys.MOCK_PROFILE, updatedProfile);
  } catch (error) {
    console.error('Error updating mock profile:', error);
    return false;
  }
};

export const getMockProfile = () => {
  return loadFromLocalStorage(localStorageKeys.MOCK_PROFILE, null);
};

export const getMockLinks = () => {
  return loadFromLocalStorage(localStorageKeys.MOCK_LINKS, []);
};

export const saveMockLinks = (links: any[]): boolean => {
  return saveToLocalStorage(localStorageKeys.MOCK_LINKS, links);
};

export const isMockMode = (): boolean => {
  return localStorage.getItem(localStorageKeys.MOCK_SESSION) !== null;
}; 