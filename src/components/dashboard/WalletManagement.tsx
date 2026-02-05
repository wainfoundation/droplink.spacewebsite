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
  Info,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { piPaymentService } from '@/services/piPaymentService';

const WalletManagement: React.FC = () => {
  const [userWalletAddress, setUserWalletAddress] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [platformBalance, setPlatformBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const { toast } = useToast();

  // Load user wallet address from localStorage on component mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('userWalletAddress');
    if (savedWallet) {
      setUserWalletAddress(savedWallet);
      setIsValid(validateWalletAddress(savedWallet));
    }
    loadPlatformBalance();
  }, []);

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

    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('userWalletAddress', userWalletAddress);
      
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

  const loadPlatformBalance = async () => {
    setBalanceLoading(true);
    try {
      const balance = await piPaymentService.getPlatformWalletBalance();
      setPlatformBalance(balance);
    } catch (error) {
      console.error('Failed to load platform wallet balance:', error);
      toast({
        title: "Error",
        description: "Failed to load platform wallet balance",
        variant: "destructive",
      });
    } finally {
      setBalanceLoading(false);
    }
  };

  const copyWalletAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  const openInExplorer = (address: string) => {
    const explorerUrl = `https://api.sandbox.minepi.com/accounts/${address}`;
    window.open(explorerUrl, '_blank');
  };

  const formatBalance = (balance: number) => {
    return balance.toFixed(7);
  };

  const formatWalletAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const platformWalletAddress = piPaymentService.getPlatformWalletAddress();

  return (
    <div className="space-y-6">
      {/* Platform Wallet */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="w-5 h-5 text-[#0ea5e9]" />
            Platform Wallet
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Balance */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Balance</p>
              <p className="text-2xl font-bold text-[#0ea5e9]">
                {balanceLoading ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  formatBalance(platformBalance)
                )}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadPlatformBalance}
              disabled={balanceLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${balanceLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Platform Wallet Address</p>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <code className="flex-1 text-sm font-mono text-gray-800">
                {formatWalletAddress(platformWalletAddress)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyWalletAddress(platformWalletAddress)}
                className="h-8 w-8 p-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openInExplorer(platformWalletAddress)}
                className="h-8 w-8 p-0"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Network Info */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Network</span>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              Sandbox
            </Badge>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Status</span>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Receiving Wallet */}
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
                      onClick={() => copyWalletAddress(userWalletAddress)}
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
    </div>
  );
};

export default WalletManagement;
