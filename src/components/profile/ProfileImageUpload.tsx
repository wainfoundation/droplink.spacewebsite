import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Camera, 
  Download, 
  Trash2, 
  Loader2,
  Pi,
  User
} from 'lucide-react';
import { useProfileImage } from '@/hooks/useProfileImage';
import { useUser } from '@/context/UserContext';

interface ProfileImageUploadProps {
  className?: string;
  showPiImport?: boolean;
  showDelete?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onImageChange?: (imageUrl: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  className = '',
  showPiImport = true,
  showDelete = true,
  size = 'md',
  onImageChange
}) => {
  const { user, profile } = useUser();
  const { uploadImage, deleteImage, importFromPi, isUploading, isImporting } = useProfileImage();
  const [piUsername, setPiUsername] = useState('');
  const [showPiInput, setShowPiInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const displayName = profile?.display_name || profile?.username || user?.email?.split('@')[0] || 'User';

  console.log('ProfileImageUpload: User data', { user: user?.id, profile: profile?.id, avatarUrl });

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const handleFileUpload = async (file: File) => {
    console.log('ProfileImageUpload: Starting file upload', file.name, file.size);
    const success = await uploadImage(file);
    console.log('ProfileImageUpload: Upload result', success);
    if (success && onImageChange) {
      // The actual URL will be updated when user data is refreshed
      onImageChange(URL.createObjectURL(file));
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handlePiImport = async () => {
    if (!piUsername.trim()) return;
    
    const username = piUsername.startsWith('@') ? piUsername.slice(1) : piUsername;
    const success = await importFromPi(username);
    
    if (success) {
      setPiUsername('');
      setShowPiInput(false);
    }
  };

  const handleDelete = async () => {
    const success = await deleteImage();
    if (success && onImageChange) {
      onImageChange('');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Avatar Display */}
      <div className="flex items-center space-x-4">
        <Avatar className={`${sizeClasses[size]} border-2 border-gray-200`}>
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          {/* Upload Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={triggerFileUpload}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {isUploading ? "Uploading..." : "Upload Photo"}
          </Button>

          {/* Pi Import Button */}
          {showPiImport && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPiInput(!showPiInput)}
              className="w-full"
            >
              <Pi className="w-4 h-4 mr-2" />
              Import from Pi
            </Button>
          )}

          {/* Delete Button */}
          {showDelete && avatarUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="w-full text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Photo
            </Button>
          )}
        </div>
      </div>

      {/* Pi Import Input */}
      {showPiImport && showPiInput && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Pi className="w-4 h-4 mr-2" />
              Import from Pi Network
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Pi username (e.g., @username)"
                value={piUsername}
                onChange={(e) => setPiUsername(e.target.value)}
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={handlePiImport}
                disabled={isImporting || !piUsername.trim()}
              >
                {isImporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-blue-600">
              Import your profile image from Pi Network
            </p>
          </CardContent>
        </Card>
      )}

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        id="profile-image-upload"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(file);
          }
        }}
        className="hidden"
      />

      {/* Upload Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>Recommended: 400x400px, PNG or JPG</p>
        <p>Maximum file size: 5MB</p>
        {avatarUrl && (
          <p className="text-green-600">
            ✓ Profile image uploaded successfully
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUpload; 