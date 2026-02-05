/**
 * URL Helper for Dashboard Components
 * Provides consistent URL generation for localhost testing and production
 */

export const getBaseUrl = (): string => {
  // Check if we're running on localhost
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '0.0.0.0';
  
  if (isLocalhost) {
    return 'http://localhost:5173';
  }
  
  return window.location.origin;
};

export const getProfileUrl = (username: string): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/@${username}`;
};

export const getLinkUrl = (username: string): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/link/${username}`;
};

export const getPiUrl = (username: string): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/pi/${username}`;
};

export const getLiveUrl = (username: string): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/live/${username}`;
};

export const isLocalhost = (): boolean => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '0.0.0.0';
};
