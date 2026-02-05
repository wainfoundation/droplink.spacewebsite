/**
 * Pi Network Profile Service
 * Handles integration with Pi Network profiles and data
 */

export interface PiProfileData {
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate?: string;
  isVerified?: boolean;
  friendsCount?: number;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isFriend?: boolean;
  isFollowing?: boolean;
  piBalance?: number;
  miningRate?: number;
  referrals?: number;
  achievements?: string[];
}

export interface PiProfileSettings {
  privacy: 'public' | 'friends' | 'private';
  showBalance: boolean;
  showMiningRate: boolean;
  allowFriendRequests: boolean;
  allowMessages: boolean;
}

export interface PiNetworkProfile {
  uid: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  verified?: boolean;
  followers?: number;
  following?: number;
  posts?: number;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export interface PiProfileImportResult {
  success: boolean;
  profile?: PiNetworkProfile;
  error?: string;
}

export class PiProfileService {
  private static instance: PiProfileService;
  private baseUrl = 'https://profiles.pinet.com';

  public static getInstance(): PiProfileService {
    if (!PiProfileService.instance) {
      PiProfileService.instance = new PiProfileService();
    }
    return PiProfileService.instance;
  }

  /**
   * Fetch Pi Network profile data
   */
  async getProfile(username: string): Promise<PiProfileData | null> {
    try {
      // In production, this would make a real API call to Pi Network
      // For now, we'll return mock data
      return this.getMockProfile(username);
    } catch (error) {
      console.error('Error fetching Pi profile:', error);
      return null;
    }
  }

  /**
   * Fetch Pi Network profile settings
   */
  async getProfileSettings(username: string): Promise<PiProfileSettings | null> {
    try {
      // In production, this would fetch from Pi Network API
      return {
        privacy: 'public',
        showBalance: false,
        showMiningRate: true,
        allowFriendRequests: true,
        allowMessages: true
      };
    } catch (error) {
      console.error('Error fetching Pi profile settings:', error);
      return null;
    }
  }

  /**
   * Update Pi Network profile settings
   */
  async updateProfileSettings(username: string, settings: Partial<PiProfileSettings>): Promise<boolean> {
    try {
      // In production, this would update via Pi Network API
      console.log('Updating Pi profile settings:', username, settings);
      return true;
    } catch (error) {
      console.error('Error updating Pi profile settings:', error);
      return false;
    }
  }

  /**
   * Get Pi Network profile URL
   */
  getProfileUrl(username: string): string {
    return `${this.baseUrl}/profiles/${username}`;
  }

  /**
   * Get Pi Network profile settings URL
   */
  getProfileSettingsUrl(username: string): string {
    return `${this.baseUrl}/profiles/${username}/settings`;
  }

  /**
   * Get Pi Network profile friends URL
   */
  getProfileFriendsUrl(username: string): string {
    return `${this.baseUrl}/profiles/${username}/friends`;
  }

  /**
   * Get Pi Network profile posts URL
   */
  getProfilePostsUrl(username: string): string {
    return `${this.baseUrl}/profiles/${username}/posts`;
  }

  /**
   * Validate Pi Network username
   */
  validateUsername(username: string): boolean {
    // Pi Network username validation rules
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  /**
   * Get mock profile data for development
   */
  private getMockProfile(username: string): PiProfileData {
    return {
      username: username,
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
      avatar: `https://placehold.co/100x100/8B5CF6/FFFFFF?text=${username.charAt(0).toUpperCase()}`,
      bio: `Pi Network Pioneer | Building the future with ${username}`,
      location: 'Global',
      joinDate: '2020-03-14',
      isVerified: true,
      friendsCount: Math.floor(Math.random() * 2000) + 500,
      followersCount: Math.floor(Math.random() * 5000) + 1000,
      followingCount: Math.floor(Math.random() * 1000) + 200,
      postsCount: Math.floor(Math.random() * 500) + 50,
      isFriend: false,
      isFollowing: false,
      piBalance: Math.floor(Math.random() * 1000) + 100,
      miningRate: Math.floor(Math.random() * 10) + 1,
      referrals: Math.floor(Math.random() * 50) + 5,
      achievements: ['Early Pioneer', 'Mining Master', 'Community Builder']
    };
  }

  /**
   * Track profile view
   */
  async trackProfileView(username: string): Promise<void> {
    try {
      // In production, this would send analytics data to Pi Network
      console.log('Tracking profile view:', username);
    } catch (error) {
      console.error('Error tracking profile view:', error);
    }
  }

  /**
   * Track link click
   */
  async trackLinkClick(username: string, linkId: string): Promise<void> {
    try {
      // In production, this would send analytics data to Pi Network
      console.log('Tracking link click:', username, linkId);
    } catch (error) {
      console.error('Error tracking link click:', error);
    }
  }
}

// Export singleton instance
export const piProfileService = PiProfileService.getInstance();

/**
 * Fetch Pi Network profile data (standalone function)
 */
export async function fetchPiNetworkProfile(username: string): Promise<PiProfileImportResult> {
  try {
    const service = PiProfileService.getInstance();
    const profile = await service.getProfile(username);
    
    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    // Convert PiProfileData to PiNetworkProfile format
    const networkProfile: PiNetworkProfile = {
      uid: profile.username,
      username: profile.username,
      displayName: profile.displayName,
      avatar: profile.avatar,
      bio: profile.bio,
      location: profile.location,
      verified: profile.isVerified,
      followers: profile.followersCount,
      following: profile.followingCount,
      posts: profile.postsCount,
      socialLinks: {
        twitter: undefined,
        instagram: undefined,
        youtube: undefined,
        linkedin: undefined
      }
    };

    return { success: true, profile: networkProfile };
  } catch (error) {
    console.error('Error fetching Pi Network profile:', error);
    return { success: false, error: 'Failed to fetch profile' };
  }
}

/**
 * Search Pi Network profiles
 */
export async function searchPiNetworkProfiles(query: string): Promise<PiNetworkProfile[]> {
  try {
    // Mock search results for development
    const mockResults: PiNetworkProfile[] = [
      {
        uid: `${query}_1`,
        username: `${query}_user1`,
        displayName: `${query.charAt(0).toUpperCase() + query.slice(1)} User 1`,
        avatar: `https://placehold.co/100x100/8B5CF6/FFFFFF?text=${query.charAt(0).toUpperCase()}`,
        bio: `Pi Network user with username similar to ${query}`,
        location: 'Global',
        verified: false,
        followers: Math.floor(Math.random() * 1000),
        following: Math.floor(Math.random() * 500),
        posts: Math.floor(Math.random() * 100)
      },
      {
        uid: `${query}_2`,
        username: `${query}_user2`,
        displayName: `${query.charAt(0).toUpperCase() + query.slice(1)} User 2`,
        avatar: `https://placehold.co/100x100/EC4899/FFFFFF?text=${query.charAt(0).toUpperCase()}`,
        bio: `Another Pi Network user with username similar to ${query}`,
        location: 'Global',
        verified: true,
        followers: Math.floor(Math.random() * 2000),
        following: Math.floor(Math.random() * 800),
        posts: Math.floor(Math.random() * 200)
      }
    ];

    return mockResults;
  } catch (error) {
    console.error('Error searching Pi Network profiles:', error);
    return [];
  }
}

/**
 * Import Pi profile to Droplink format
 */
export function importPiProfileToDroplink(profile: PiNetworkProfile): any {
  return {
    username: profile.username,
    displayName: profile.displayName || profile.username,
    bio: profile.bio || `Welcome to ${profile.username}'s Droplink!`,
    avatar: profile.avatar,
    isVerified: profile.verified,
    location: profile.location,
    socialLinks: profile.socialLinks,
    website: profile.website,
    followers: profile.followers,
    following: profile.following,
    posts: profile.posts
  };
}

/**
 * Validate Pi username
 */
export function validatePiUsername(username: string): boolean {
  const service = PiProfileService.getInstance();
  return service.validateUsername(username);
}