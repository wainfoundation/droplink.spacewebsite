/**
 * Profile Storage Utility
 * Handles saving and loading profile data to/from localStorage
 */

export interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  location?: string;
  isVerified: boolean;
  theme: string;
  customColors?: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export interface LinkData {
  id: string;
  title: string;
  url: string;
  icon: string;
  description?: string;
  is_active: boolean;
  clicks: number;
  type?: string;
}

export class ProfileStorage {
  /**
   * Save profile data to localStorage
   */
  static saveProfile(username: string, profileData: ProfileData): void {
    try {
      const profileKey = `profile_${username}`;
      localStorage.setItem(profileKey, JSON.stringify(profileData));
      console.log('Profile saved to localStorage:', profileData);
    } catch (error) {
      console.error('Error saving profile to localStorage:', error);
    }
  }

  /**
   * Load profile data from localStorage
   */
  static loadProfile(username: string): ProfileData | null {
    try {
      const profileKey = `profile_${username}`;
      const savedProfile = localStorage.getItem(profileKey);
      
      if (savedProfile) {
        return JSON.parse(savedProfile);
      }
      
      return null;
    } catch (error) {
      console.error('Error loading profile from localStorage:', error);
      return null;
    }
  }

  /**
   * Save links data to localStorage
   */
  static saveLinks(username: string, links: LinkData[]): void {
    try {
      const linksKey = `links_${username}`;
      localStorage.setItem(linksKey, JSON.stringify(links));
      console.log('Links saved to localStorage:', links);
    } catch (error) {
      console.error('Error saving links to localStorage:', error);
    }
  }

  /**
   * Load links data from localStorage
   */
  static loadLinks(username: string): LinkData[] {
    try {
      const linksKey = `links_${username}`;
      const savedLinks = localStorage.getItem(linksKey);
      
      if (savedLinks) {
        return JSON.parse(savedLinks);
      }
      
      return [];
    } catch (error) {
      console.error('Error loading links from localStorage:', error);
      return [];
    }
  }

  /**
   * Save view count to localStorage
   */
  static saveViewCount(username: string, count: number): void {
    try {
      const viewCountKey = `views_${username}`;
      localStorage.setItem(viewCountKey, count.toString());
    } catch (error) {
      console.error('Error saving view count to localStorage:', error);
    }
  }

  /**
   * Load view count from localStorage
   */
  static loadViewCount(username: string): number {
    try {
      const viewCountKey = `views_${username}`;
      const savedViews = localStorage.getItem(viewCountKey);
      
      if (savedViews) {
        return parseInt(savedViews);
      }
      
      return 0;
    } catch (error) {
      console.error('Error loading view count from localStorage:', error);
      return 0;
    }
  }

  /**
   * Save like count to localStorage
   */
  static saveLikeCount(username: string, count: number): void {
    try {
      const likeCountKey = `likes_${username}`;
      localStorage.setItem(likeCountKey, count.toString());
    } catch (error) {
      console.error('Error saving like count to localStorage:', error);
    }
  }

  /**
   * Load like count from localStorage
   */
  static loadLikeCount(username: string): number {
    try {
      const likeCountKey = `likes_${username}`;
      const savedLikes = localStorage.getItem(likeCountKey);
      
      if (savedLikes) {
        return parseInt(savedLikes);
      }
      
      return 0;
    } catch (error) {
      console.error('Error loading like count from localStorage:', error);
      return 0;
    }
  }

  /**
   * Increment view count
   */
  static incrementViewCount(username: string): number {
    const currentCount = this.loadViewCount(username);
    const newCount = currentCount + 1;
    this.saveViewCount(username, newCount);
    return newCount;
  }

  /**
   * Increment like count
   */
  static incrementLikeCount(username: string): number {
    const currentCount = this.loadLikeCount(username);
    const newCount = currentCount + 1;
    this.saveLikeCount(username, newCount);
    return newCount;
  }

  /**
   * Increment link click count
   */
  static incrementLinkClick(username: string, linkId: string): void {
    const links = this.loadLinks(username);
    const updatedLinks = links.map(link => 
      link.id === linkId ? { ...link, clicks: link.clicks + 1 } : link
    );
    this.saveLinks(username, updatedLinks);
  }

  /**
   * Clear all data for a username
   */
  static clearUserData(username: string): void {
    try {
      const keys = [
        `profile_${username}`,
        `links_${username}`,
        `views_${username}`,
        `likes_${username}`
      ];
      
      keys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('User data cleared from localStorage:', username);
    } catch (error) {
      console.error('Error clearing user data from localStorage:', error);
    }
  }

  /**
   * Get all stored usernames
   */
  static getAllUsernames(): string[] {
    try {
      const usernames: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('profile_')) {
          const username = key.replace('profile_', '');
          usernames.push(username);
        }
      }
      
      return usernames;
    } catch (error) {
      console.error('Error getting usernames from localStorage:', error);
      return [];
    }
  }
}
