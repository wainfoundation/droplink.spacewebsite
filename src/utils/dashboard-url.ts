/**
 * Dashboard URL Helper
 * Ensures dashboard URLs always use the correct domain
 */

export const DASHBOARD_BASE_URL = import.meta.env.VITE_APP_BASE_URL || 'https://droplink.space';

/**
 * Get dashboard URL with proper domain
 */
export const getDashboardUrl = (path: string = ''): string => {
  // Always use the configured base URL (root URL)
  const baseUrl = DASHBOARD_BASE_URL;
  
  // Return root URL with optional path
  return path ? `${baseUrl}${path}` : baseUrl;
};

/**
 * Get profile URL with proper domain
 */
export const getProfileUrl = (username: string): string => {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : DASHBOARD_BASE_URL;
  
  return `${baseUrl}/@${username}`;
};

/**
 * Get full URL with proper domain
 */
export const getFullUrl = (path: string = ''): string => {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : DASHBOARD_BASE_URL;
  
  return `${baseUrl}${path}`;
};

/**
 * Redirect to dashboard with proper domain
 */
export const redirectToDashboard = (path: string = ''): void => {
  if (typeof window !== 'undefined') {
    // Always redirect to the configured base URL
    const dashboardUrl = getDashboardUrl(path);
    window.location.href = dashboardUrl;
  }
};

/**
 * Check if current domain is the correct domain
 */
export const isCorrectDomain = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const currentDomain = window.location.hostname;
  const correctDomain = 'droplink.space';
  
  return currentDomain === correctDomain || currentDomain.includes('lovable.app');
};
