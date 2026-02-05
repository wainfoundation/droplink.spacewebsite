
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchPiNetworkProfile, 
  searchPiNetworkProfiles,
  importPiProfileToDroplink,
  validatePiUsername,
  type PiNetworkProfile,
  type PiProfileImportResult 
} from '@/services/piProfileService';

export interface UsePiProfileImportReturn {
  isLoading: boolean;
  isSearching: boolean;
  profile: PiNetworkProfile | null;
  searchResults: PiNetworkProfile[];
  error: string | null;
  searchProfile: (username: string) => Promise<void>;
  searchProfiles: (query: string) => Promise<void>;
  importProfile: (profile: PiNetworkProfile) => any;
  clearError: () => void;
  reset: () => void;
}

export const usePiProfileImport = (): UsePiProfileImportReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [profile, setProfile] = useState<PiNetworkProfile | null>(null);
  const [searchResults, setSearchResults] = useState<PiNetworkProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const searchProfile = useCallback(async (username: string) => {
    if (!username.trim()) return;
    
    if (!validatePiUsername(username.trim())) {
      setError('Invalid Pi Network username format');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProfile(null);
    setSearchResults([]);

    try {
      const result: PiProfileImportResult = await fetchPiNetworkProfile(username.trim());
      
      if (result.success && result.profile) {
        setProfile(result.profile);
        toast({
          title: "Profile Found",
          description: `Successfully found profile for @${result.profile.username}`,
        });
      } else {
        setError(result.error || 'Profile not found');
        toast({
          title: "Profile Not Found",
          description: result.error || 'No profile found with that username',
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const searchProfiles = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setSearchResults([]);

    try {
      const results = await searchPiNetworkProfiles(query.trim());
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('No profiles found matching your search');
        toast({
          title: "No Results",
          description: "No profiles found matching your search",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Search Results",
          description: `Found ${results.length} profiles`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search profiles';
      setError(errorMessage);
      toast({
        title: "Search Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  const importProfile = useCallback((profile: PiNetworkProfile) => {
    try {
      const droplinkProfile = importPiProfileToDroplink(profile);
      
      toast({
        title: "Profile Imported",
        description: `Successfully imported profile from @${profile.username}`,
      });
      
      return droplinkProfile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import profile';
      setError(errorMessage);
      toast({
        title: "Import Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSearching(false);
    setProfile(null);
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    isLoading,
    isSearching,
    profile,
    searchResults,
    error,
    searchProfile,
    searchProfiles,
    importProfile,
    clearError,
    reset,
  };
};
