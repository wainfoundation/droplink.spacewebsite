import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  User, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ExternalLink,
  Users,
  MapPin,
  Globe,
  Twitter,
  Instagram,
  Youtube,
  Linkedin
} from 'lucide-react';
import { 
  fetchPiNetworkProfile, 
  searchPiNetworkProfiles,
  importPiProfileToDroplink,
  validatePiUsername,
  type PiNetworkProfile 
} from '@/services/piProfileService';

interface PiProfileImportProps {
  onProfileImport?: (profileData: any) => void;
  onCancel?: () => void;
}

const PiProfileImport: React.FC<PiProfileImportProps> = ({ 
  onProfileImport, 
  onCancel 
}) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<PiNetworkProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<PiNetworkProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!username.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setProfile(null);
    setSearchResults([]);

    try {
      // First try to fetch the specific profile
      const result = await fetchPiNetworkProfile(username.trim());
      
      if (result.success && result.profile) {
        setProfile(result.profile);
      } else {
        // If specific profile not found, search for similar profiles
        setIsSearching(true);
        const searchResults = await searchPiNetworkProfiles(username.trim());
        setSearchResults(searchResults);
        setIsSearching(false);
        
        if (searchResults.length === 0) {
          setError('Profile not found. Please check the username and try again.');
        }
      }
    } catch (err) {
      setError('Failed to fetch profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (!profile) return;
    
    const droplinkProfile = importPiProfileToDroplink(profile);
    onProfileImport?.(droplinkProfile);
  };

  const handleSelectFromSearch = (selectedProfile: PiNetworkProfile) => {
    setProfile(selectedProfile);
    setSearchResults([]);
    setError(null);
  };

  const isValidUsername = username.trim() && validatePiUsername(username.trim());

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Import from Pi Network Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Pi Network Username
            </label>
            <div className="flex gap-2">
              <Input
                id="username"
                type="text"
                placeholder="Enter Pi Network username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch}
                disabled={!isValidUsername || isLoading}
                className="px-4"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Enter your Pi Network username to import your profile data
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isSearching && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching for profiles...
            </div>
          )}

          {searchResults.length > 0 && !profile && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Similar profiles found:</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.uid}
                    className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectFromSearch(result)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {result.avatar ? (
                        <img 
                          src={result.avatar} 
                          alt={result.displayName || result.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {result.displayName || result.username}
                      </p>
                      <p className="text-xs text-gray-500">@{result.username}</p>
                    </div>
                    {result.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {profile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Profile Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.displayName || profile.username}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-gray-500" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">
                    {profile.displayName || profile.username}
                  </h3>
                  {profile.verified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600">@{profile.username}</p>
                {profile.bio && (
                  <p className="text-sm text-gray-700">{profile.bio}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {profile.location}
                    </div>
                  )}
                  {profile.followers !== undefined && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {profile.followers} followers
                    </div>
                  )}
                </div>

                {profile.socialLinks && Object.values(profile.socialLinks).some(link => link) && (
                  <div className="flex items-center gap-2">
                    {profile.socialLinks.twitter && (
                      <a 
                        href={`https://twitter.com/${profile.socialLinks.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-600"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {profile.socialLinks.instagram && (
                      <a 
                        href={`https://instagram.com/${profile.socialLinks.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:text-pink-600"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                    {profile.socialLinks.youtube && (
                      <a 
                        href={profile.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-600"
                      >
                        <Youtube className="h-4 w-4" />
                      </a>
                    )}
                    {profile.socialLinks.linkedin && (
                      <a 
                        href={profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {profile.website && (
                      <a 
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <a 
                    href={`https://profiles.pinet.com/${profile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    View on Pi Network
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleImport} className="flex-1">
                Import Profile
              </Button>
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PiProfileImport;
