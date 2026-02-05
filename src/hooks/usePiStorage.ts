/**
 * React Hook for Pi Storage
 * Provides easy access to Pi storage functionality with state management
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import piStorage, { PiStorageUtils, PiStorageResult, PiStorageOptions } from '@/utils/pi-storage';

export interface UsePiStorageOptions {
  autoLoad?: boolean;
  autoSave?: boolean;
  debounceMs?: number;
  onError?: (error: string) => void;
}

export interface UsePiStorageReturn<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  setData: (value: T, options?: PiStorageOptions) => Promise<PiStorageResult>;
  getData: () => Promise<PiStorageResult>;
  removeData: () => Promise<PiStorageResult>;
  clearAll: () => Promise<PiStorageResult>;
  refresh: () => Promise<void>;
}

/**
 * Hook for managing a single storage key
 */
export function usePiStorageKey<T = any>(
  key: string,
  options: UsePiStorageOptions = {}
): UsePiStorageReturn<T> {
  const [data, setDataState] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { autoLoad = true, autoSave = true, debounceMs = 300, onError } = options;

  // Load data on mount
  useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, [key, autoLoad]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await piStorage.get(key);
      if (result.success && result.data !== undefined) {
        setDataState(result.data as T);
      } else if (!result.success && result.error !== 'Data not found') {
        setError(result.error || 'Failed to load data');
        onError?.(result.error || 'Failed to load data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [key, onError]);

  const setData = useCallback(async (value: T, storageOptions?: PiStorageOptions): Promise<PiStorageResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await piStorage.set(key, value, storageOptions);
      
      if (result.success) {
        setDataState(value);
      } else {
        setError(result.error || 'Failed to save data');
        onError?.(result.error || 'Failed to save data');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [key, onError]);

  const setDataDebounced = useCallback((value: T, storageOptions?: PiStorageOptions) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      setData(value, storageOptions);
    }, debounceMs);
  }, [setData, debounceMs]);

  const getData = useCallback(async (): Promise<PiStorageResult> => {
    return await piStorage.get(key);
  }, [key]);

  const removeData = useCallback(async (): Promise<PiStorageResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await piStorage.remove(key);
      
      if (result.success) {
        setDataState(null);
      } else {
        setError(result.error || 'Failed to remove data');
        onError?.(result.error || 'Failed to remove data');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [key, onError]);

  const clearAll = useCallback(async (): Promise<PiStorageResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await piStorage.clear();
      
      if (result.success) {
        setDataState(null);
      } else {
        setError(result.error || 'Failed to clear storage');
        onError?.(result.error || 'Failed to clear storage');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [onError]);

  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    setData: autoSave ? setDataDebounced : setData,
    getData,
    removeData,
    clearAll,
    refresh,
  };
}

/**
 * Hook for user profile storage
 */
export function useUserProfile() {
  return usePiStorageKey('user_profile', {
    autoLoad: true,
    autoSave: true,
    debounceMs: 500,
  });
}

/**
 * Hook for user preferences storage
 */
export function useUserPreferences() {
  return usePiStorageKey('user_preferences', {
    autoLoad: true,
    autoSave: true,
    debounceMs: 300,
  });
}

/**
 * Hook for auth token storage
 */
export function useAuthToken() {
  return usePiStorageKey<string>('auth_token', {
    autoLoad: true,
    autoSave: true,
    debounceMs: 0, // No debounce for auth tokens
  });
}

/**
 * Hook for payment history storage
 */
export function usePaymentHistory() {
  return usePiStorageKey<any[]>('payment_history', {
    autoLoad: true,
    autoSave: true,
    debounceMs: 1000,
  });
}

/**
 * Hook for app settings storage
 */
export function useAppSettings() {
  return usePiStorageKey('app_settings', {
    autoLoad: true,
    autoSave: true,
    debounceMs: 500,
  });
}

/**
 * Hook for cache data storage
 */
export function useCacheData<T = any>(cacheKey: string, ttl: number = 5 * 60 * 1000) {
  const fullKey = `cache_data_${cacheKey}`;
  
  return usePiStorageKey<T>(fullKey, {
    autoLoad: true,
    autoSave: true,
    debounceMs: 0,
  });
}

/**
 * Hook for temporary data storage
 */
export function useTempData<T = any>(tempKey: string) {
  const fullKey = `temp_data_${tempKey}`;
  
  return usePiStorageKey<T>(fullKey, {
    autoLoad: true,
    autoSave: true,
    debounceMs: 200,
  });
}

/**
 * Hook for Pi storage utilities
 */
export function usePiStorageUtils() {
  return {
    ...PiStorageUtils,
    storage: piStorage,
  };
}

/**
 * Hook for storage management (keys, size, cleanup)
 */
export function useStorageManagement() {
  const [keys, setKeys] = useState<string[]>([]);
  const [size, setSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStorageInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [keysResult, sizeResult] = await Promise.all([
        piStorage.keys(),
        piStorage.size(),
      ]);
      
      setKeys(keysResult);
      setSize(sizeResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const cleanup = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await piStorage.cleanup();
      if (result.success) {
        await refreshStorageInfo();
      } else {
        setError(result.error || 'Cleanup failed');
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [refreshStorageInfo]);

  // Load storage info on mount
  useEffect(() => {
    refreshStorageInfo();
  }, [refreshStorageInfo]);

  return {
    keys,
    size,
    loading,
    error,
    refreshStorageInfo,
    cleanup,
  };
}
