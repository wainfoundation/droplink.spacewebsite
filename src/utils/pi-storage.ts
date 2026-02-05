/**
 * Pi Network Storage Module
 * Provides secure storage capabilities for Pi Network applications
 */

// Storage types and interfaces
export interface PiStorageData {
  key: string;
  value: any;
  encrypted?: boolean;
  timestamp: number;
  expiresAt?: number;
}

export interface PiStorageOptions {
  encrypted?: boolean;
  ttl?: number; // Time to live in milliseconds
  sync?: boolean; // Whether to sync across devices
}

export interface PiStorageResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp?: number;
}

// Storage keys for different data types
export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  USER_PREFERENCES: 'user_preferences',
  AUTH_TOKEN: 'auth_token',
  PAYMENT_HISTORY: 'payment_history',
  APP_SETTINGS: 'app_settings',
  CACHE_DATA: 'cache_data',
  TEMP_DATA: 'temp_data',
} as const;

/**
 * Pi Storage Class - Main storage manager
 */
class PiStorage {
  private storage: Map<string, PiStorageData> = new Map();
  private isInitialized = false;
  private encryptionKey: string | null = null;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize Pi Storage
   */
  private async initialize(): Promise<void> {
    try {
      console.log('Initializing Pi Storage...');
      
      // Check if Pi SDK is available
      if (typeof window !== 'undefined' && window.Pi) {
        console.log('Pi SDK available, using Pi storage capabilities');
        this.isInitialized = true;
        
        // Load existing data from Pi storage
        await this.loadFromPiStorage();
      } else {
        console.log('Pi SDK not available, using local storage fallback');
        this.isInitialized = true;
        
        // Load from localStorage as fallback
        this.loadFromLocalStorage();
      }
      
      console.log('Pi Storage initialized successfully');
    } catch (error) {
      console.error('Pi Storage initialization error:', error);
      // Fallback to localStorage
      this.isInitialized = true;
      this.loadFromLocalStorage();
    }
  }

  /**
   * Load data from Pi storage
   */
  private async loadFromPiStorage(): Promise<void> {
    try {
      if (!window.Pi?.storage) {
        console.warn('Pi storage not available, using fallback');
        return;
      }

      // Get all stored data from Pi storage
      const storedData = await window.Pi.storage.getAll();
      
      if (storedData && typeof storedData === 'object') {
        Object.entries(storedData).forEach(([key, value]) => {
          try {
            const parsedData = JSON.parse(value as string);
            this.storage.set(key, parsedData);
          } catch {
            // If parsing fails, store as raw data
            this.storage.set(key, {
              key,
              value,
              timestamp: Date.now(),
            });
          }
        });
      }
      
      console.log('Data loaded from Pi storage:', this.storage.size, 'items');
    } catch (error) {
      console.error('Error loading from Pi storage:', error);
    }
  }

  /**
   * Load data from localStorage fallback
   */
  private loadFromLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith('pi_storage_')) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              const parsedData = JSON.parse(value);
              const storageKey = key.replace('pi_storage_', '');
              this.storage.set(storageKey, parsedData);
            }
          } catch (error) {
            console.warn('Error parsing localStorage item:', key, error);
          }
        }
      });
      
      console.log('Data loaded from localStorage:', this.storage.size, 'items');
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  /**
   * Save data to Pi storage
   */
  private async saveToPiStorage(key: string, data: PiStorageData): Promise<boolean> {
    try {
      if (!window.Pi?.storage) {
        console.warn('Pi storage not available, using fallback');
        return false;
      }

      const serializedData = JSON.stringify(data);
      await window.Pi.storage.set(key, serializedData);
      
      console.log('Data saved to Pi storage:', key);
      return true;
    } catch (error) {
      console.error('Error saving to Pi storage:', error);
      return false;
    }
  }

  /**
   * Save data to localStorage fallback
   */
  private saveToLocalStorage(key: string, data: PiStorageData): boolean {
    try {
      const storageKey = `pi_storage_${key}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
      
      console.log('Data saved to localStorage:', key);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  /**
   * Set data in storage
   */
  async set(key: string, value: any, options: PiStorageOptions = {}): Promise<PiStorageResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const now = Date.now();
      const expiresAt = options.ttl ? now + options.ttl : undefined;

      const storageData: PiStorageData = {
        key,
        value,
        encrypted: options.encrypted || false,
        timestamp: now,
        expiresAt,
      };

      // Store in memory
      this.storage.set(key, storageData);

      // Try to save to Pi storage first, fallback to localStorage
      let saved = false;
      if (typeof window !== 'undefined' && window.Pi?.storage) {
        saved = await this.saveToPiStorage(key, storageData);
      }
      
      if (!saved) {
        saved = this.saveToLocalStorage(key, storageData);
      }

      return {
        success: saved,
        data: value,
        timestamp: now,
      };
    } catch (error) {
      console.error('Error setting storage data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get data from storage
   */
  async get(key: string): Promise<PiStorageResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const data = this.storage.get(key);
      
      if (!data) {
        return {
          success: false,
          error: 'Data not found',
        };
      }

      // Check if data has expired
      if (data.expiresAt && Date.now() > data.expiresAt) {
        console.log('Data expired, removing:', key);
        await this.remove(key);
        return {
          success: false,
          error: 'Data expired',
        };
      }

      return {
        success: true,
        data: data.value,
        timestamp: data.timestamp,
      };
    } catch (error) {
      console.error('Error getting storage data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Remove data from storage
   */
  async remove(key: string): Promise<PiStorageResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Remove from memory
      this.storage.delete(key);

      // Remove from Pi storage
      if (typeof window !== 'undefined' && window.Pi?.storage) {
        try {
          await window.Pi.storage.remove(key);
        } catch (error) {
          console.warn('Error removing from Pi storage:', error);
        }
      }

      // Remove from localStorage
      try {
        const storageKey = `pi_storage_${key}`;
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.warn('Error removing from localStorage:', error);
      }

      return {
        success: true,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error removing storage data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Clear all storage data
   */
  async clear(): Promise<PiStorageResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Clear memory
      this.storage.clear();

      // Clear Pi storage
      if (typeof window !== 'undefined' && window.Pi?.storage) {
        try {
          await window.Pi.storage.clear();
        } catch (error) {
          console.warn('Error clearing Pi storage:', error);
        }
      }

      // Clear localStorage items with pi_storage_ prefix
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('pi_storage_')) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn('Error clearing localStorage:', error);
      }

      return {
        success: true,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error clearing storage:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get all storage keys
   */
  async keys(): Promise<string[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      return Array.from(this.storage.keys());
    } catch (error) {
      console.error('Error getting storage keys:', error);
      return [];
    }
  }

  /**
   * Check if key exists
   */
  async has(key: string): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      return this.storage.has(key);
    } catch (error) {
      console.error('Error checking storage key:', error);
      return false;
    }
  }

  /**
   * Get storage size
   */
  async size(): Promise<number> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      return this.storage.size;
    } catch (error) {
      console.error('Error getting storage size:', error);
      return 0;
    }
  }

  /**
   * Clean expired data
   */
  async cleanup(): Promise<PiStorageResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const now = Date.now();
      const expiredKeys: string[] = [];

      // Find expired keys
      this.storage.forEach((data, key) => {
        if (data.expiresAt && now > data.expiresAt) {
          expiredKeys.push(key);
        }
      });

      // Remove expired data
      for (const key of expiredKeys) {
        await this.remove(key);
      }

      console.log('Storage cleanup completed, removed', expiredKeys.length, 'expired items');

      return {
        success: true,
        data: { removedCount: expiredKeys.length },
        timestamp: now,
      };
    } catch (error) {
      console.error('Error during storage cleanup:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Create singleton instance
const piStorage = new PiStorage();

// Export the singleton instance and utility functions
export default piStorage;

// Utility functions for common storage operations
export const PiStorageUtils = {
  /**
   * Store user profile data
   */
  async storeUserProfile(profile: any): Promise<PiStorageResult> {
    return piStorage.set(STORAGE_KEYS.USER_PROFILE, profile, {
      encrypted: true,
      sync: true,
    });
  },

  /**
   * Get user profile data
   */
  async getUserProfile(): Promise<PiStorageResult> {
    return piStorage.get(STORAGE_KEYS.USER_PROFILE);
  },

  /**
   * Store user preferences
   */
  async storeUserPreferences(preferences: any): Promise<PiStorageResult> {
    return piStorage.set(STORAGE_KEYS.USER_PREFERENCES, preferences, {
      encrypted: false,
      sync: true,
    });
  },

  /**
   * Get user preferences
   */
  async getUserPreferences(): Promise<PiStorageResult> {
    return piStorage.get(STORAGE_KEYS.USER_PREFERENCES);
  },

  /**
   * Store auth token
   */
  async storeAuthToken(token: string): Promise<PiStorageResult> {
    return piStorage.set(STORAGE_KEYS.AUTH_TOKEN, token, {
      encrypted: true,
      ttl: 24 * 60 * 60 * 1000, // 24 hours
    });
  },

  /**
   * Get auth token
   */
  async getAuthToken(): Promise<PiStorageResult> {
    return piStorage.get(STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Store payment history
   */
  async storePaymentHistory(history: any[]): Promise<PiStorageResult> {
    return piStorage.set(STORAGE_KEYS.PAYMENT_HISTORY, history, {
      encrypted: true,
      sync: true,
    });
  },

  /**
   * Get payment history
   */
  async getPaymentHistory(): Promise<PiStorageResult> {
    return piStorage.get(STORAGE_KEYS.PAYMENT_HISTORY);
  },

  /**
   * Store app settings
   */
  async storeAppSettings(settings: any): Promise<PiStorageResult> {
    return piStorage.set(STORAGE_KEYS.APP_SETTINGS, settings, {
      encrypted: false,
      sync: true,
    });
  },

  /**
   * Get app settings
   */
  async getAppSettings(): Promise<PiStorageResult> {
    return piStorage.get(STORAGE_KEYS.APP_SETTINGS);
  },

  /**
   * Store cache data with TTL
   */
  async storeCacheData(key: string, data: any, ttl: number = 5 * 60 * 1000): Promise<PiStorageResult> {
    return piStorage.set(`${STORAGE_KEYS.CACHE_DATA}_${key}`, data, {
      encrypted: false,
      ttl,
    });
  },

  /**
   * Get cache data
   */
  async getCacheData(key: string): Promise<PiStorageResult> {
    return piStorage.get(`${STORAGE_KEYS.CACHE_DATA}_${key}`);
  },

  /**
   * Store temporary data
   */
  async storeTempData(key: string, data: any): Promise<PiStorageResult> {
    return piStorage.set(`${STORAGE_KEYS.TEMP_DATA}_${key}`, data, {
      encrypted: false,
      ttl: 60 * 60 * 1000, // 1 hour
    });
  },

  /**
   * Get temporary data
   */
  async getTempData(key: string): Promise<PiStorageResult> {
    return piStorage.get(`${STORAGE_KEYS.TEMP_DATA}_${key}`);
  },

  /**
   * Clear all user data
   */
  async clearUserData(): Promise<PiStorageResult> {
    const keys = await piStorage.keys();
    const userKeys = keys.filter(key => 
      key.startsWith(STORAGE_KEYS.USER_PROFILE) ||
      key.startsWith(STORAGE_KEYS.USER_PREFERENCES) ||
      key.startsWith(STORAGE_KEYS.AUTH_TOKEN) ||
      key.startsWith(STORAGE_KEYS.PAYMENT_HISTORY)
    );

    for (const key of userKeys) {
      await piStorage.remove(key);
    }

    return {
      success: true,
      data: { removedCount: userKeys.length },
      timestamp: Date.now(),
    };
  },
};

// React hook for Pi storage
export const usePiStorage = () => {
  return {
    storage: piStorage,
    utils: PiStorageUtils,
  };
};
