import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Copy, 
  Save, 
  Edit3,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';

interface UserWalletSettingsProps {
  onWalletChange?: (walletAddress: string) => void;
}

const UserWalletSettings: React.FC<UserWalletSettingsProps> = ({ onWalletChange }) => {
  const [userWalletAddress, setUserWalletAddress] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, profile, updateProfile } = useUser();

  // Load user wallet address from profile data
  useEffect(() => {
    if (profile?.wallet_address) {
      setUserWalletAddress(profile.wallet_address);
      setIsValid(validateWalletAddress(profile.wallet_address));
    }
  }, [profile]);

  const validateWalletAddress = (address: string): boolean => {
    // Pi Network wallet address validation (starts with G and is 56 characters)
    return address.startsWith('G') && address.length === 56;
  };

  const handleWalletChange = (value: string) => {
    setUserWalletAddress(value);
    setIsValid(validateWalletAddress(value));
  };

  const handleSave = async () => {
    if (!isValid) {
      toast({
        title: "Invalid Wallet Address",
        description: "Please enter a valid Pi Network wallet address (starts with G, 56 characters)",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Save to database via updateProfile
      await updateProfile({
        wallet_address: userWalletAddress
      });
      
      // Also save to localStorage for backward compatibility
      localStorage.setItem('userWalletAddress', userWalletAddress);
      
      // Notify parent component
      if (onWalletChange) {
        onWalletChange(userWalletAddress);
      }

      setIsEditing(false);
      toast({
        title: "Wallet Address Saved",
        description: "Your receiving wallet address has been updated successfully",
      });
    } catch (error) {
      console.error('Failed to save wallet address:', error);
      toast({
        title: "Error",
        description: "Failed to save wallet address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(userWalletAddress);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  const formatWalletAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="w-5 h-5 text-[#0ea5e9]" />
          Your Receiving Wallet
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Info className="w-3 h-3 mr-1" />
            For Payments
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Box */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Payment Setup</p>
              <p>This is your wallet address where you'll receive Pi payments from your profile. The platform uses a separate wallet for processing transactions.</p>
            </div>
          </div>
        </div>

        {/* Wallet Address Input/Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Your Wallet Address</p>
            {userWalletAddress && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 px-2"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={userWalletAddress}
                onChange={(e) => handleWalletChange(e.target.value)}
                placeholder="Enter your Pi Network wallet address (starts with G)"
                className={`font-mono text-sm ${
                  userWalletAddress && !isValid 
                    ? 'border-red-300 focus:border-red-500' 
                    : userWalletAddress && isValid 
                    ? 'border-green-300 focus:border-green-500' 
                    : ''
                }`}
              />
              <div className="flex items-center gap-2">
                {userWalletAddress && (
                  <>
                    {isValid ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Valid Pi Network address</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">Invalid wallet address</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={!isValid || isLoading}
                  size="sm"
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Address'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset to saved value
                    const savedWallet = localStorage.getItem('userWalletAddress');
                    if (savedWallet) {
                      setUserWalletAddress(savedWallet);
                      setIsValid(validateWalletAddress(savedWallet));
                    }
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              {userWalletAddress ? (
                <>
                  <code className="flex-1 text-sm font-mono text-gray-800">
                    {formatWalletAddress(userWalletAddress)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Configured</span>
                  </div>
                </>
              ) : (
                <div className="flex-1 text-center py-2">
                  <p className="text-sm text-gray-500 mb-2">No wallet address set</p>
                  <Button
                    onClick={() => setIsEditing(true)}
                    size="sm"
                    variant="outline"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Set Wallet Address
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Platform Wallet Info */}
        <div className="p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Platform Processing Wallet</span>
            <Badge variant="outline" className="text-gray-600 border-gray-600">
              System
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Used for processing payments and platform operations
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserWalletSettings;
