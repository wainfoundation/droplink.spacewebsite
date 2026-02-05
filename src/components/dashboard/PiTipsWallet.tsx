import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Wallet, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink,
  Heart,
  Send,
  Download,
  Eye,
  EyeOff,
  Settings,
  Plus,
  Minus,
  RefreshCw,
  CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import { piNetworkService } from '@/services/piNetworkService';

interface PiTip {
  id: string;
  amount: number;
  message: string;
  from: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
}

interface PiTipsWalletProps {
  onSetup?: () => void;
}

const PiTipsWallet: React.FC<PiTipsWalletProps> = ({ onSetup }) => {
  const { user, profile } = useUser();
  const { toast } = useToast();
  
  const [walletAddress, setWalletAddress] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isWalletConfigured, setIsWalletConfigured] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [copied, setCopied] = useState(false);
  const [piTips, setPiTips] = useState<PiTip[]>([]);
  const [totalTips, setTotalTips] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize Pi Network and get wallet address
  useEffect(() => {
    const initializePiNetwork = async () => {
      try {
        // Initialize Pi Network service
        await piNetworkService.initialize();
        
        // Check if user is authenticated with Pi Network
        const isAuthenticated = await piNetworkService.isAuthenticated();
        
        if (isAuthenticated) {
          // Get real wallet address from Pi Network
          const address = await piNetworkService.getWalletAddress();
          setWalletAddress(address);
          setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(address)}`);
          setIsWalletConfigured(true);
        } else {
          // Generate mock wallet address for testing
          const mockAddress = `G${user?.id?.substring(0, 8).toUpperCase() || 'TEST'}${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
          setWalletAddress(mockAddress);
          setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mockAddress)}`);
          setIsWalletConfigured(true);
        }
      } catch (error) {
        console.error('Failed to initialize Pi Network:', error);
        
        // Fallback to mock address
        const mockAddress = `G${user?.id?.substring(0, 8).toUpperCase() || 'TEST'}${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
        setWalletAddress(mockAddress);
        setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mockAddress)}`);
        setIsWalletConfigured(true);
      }
    };

    if (user?.id) {
      initializePiNetwork();
    }
  }, [user?.id]);

  // Generate mock Pi tips
  useEffect(() => {
    const mockTips: PiTip[] = [
      {
        id: '1',
        amount: 5.2,
        message: 'Great content!',
        from: 'PiUser123',
        timestamp: Date.now() - 3600000,
        status: 'completed'
      },
      {
        id: '2',
        amount: 2.8,
        message: 'Thanks for sharing!',
        from: 'CryptoFan',
        timestamp: Date.now() - 7200000,
        status: 'completed'
      },
      {
        id: '3',
        amount: 1.5,
        message: 'Keep it up!',
        from: 'BlockchainDev',
        timestamp: Date.now() - 10800000,
        status: 'completed'
      }
    ];
    
    setPiTips(mockTips);
    setTotalTips(mockTips.reduce((sum, tip) => sum + tip.amount, 0));
  }, []);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast({
        title: "Address copied!",
        description: "Pi wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying address:', error);
      toast({
        title: "Error",
        description: "Failed to copy address",
        variant: "destructive",
      });
    }
  };

  const handleDownloadQR = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = `pi-wallet-qr-${user?.id}.png`;
      link.click();
    }
  };

  const handleGenerateNewAddress = async () => {
    setIsGenerating(true);
    try {
      // Try to get a new address from Pi Network
      if (await piNetworkService.isAuthenticated()) {
        const newAddress = await piNetworkService.getWalletAddress();
        setWalletAddress(newAddress);
        setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(newAddress)}`);
        
        toast({
          title: "New address generated!",
          description: "Your Pi wallet address has been updated from Pi Network",
        });
      } else {
        // Fallback to mock address
        const newAddress = `G${Math.random().toString(36).substr(2, 16).toUpperCase()}`;
        setWalletAddress(newAddress);
        setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(newAddress)}`);
        
        toast({
          title: "New address generated!",
          description: "Your Pi wallet address has been updated (mock mode)",
        });
      }
    } catch (error) {
      console.error('Failed to generate new address:', error);
      
      // Fallback to mock address
      const newAddress = `G${Math.random().toString(36).substr(2, 16).toUpperCase()}`;
      setWalletAddress(newAddress);
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(newAddress)}`);
      
      toast({
        title: "New address generated!",
        description: "Your Pi wallet address has been updated (fallback mode)",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Call Pi Network API directly
  const callPiAPI = async () => {
    try {
      console.log('Calling Pi Network API...');
      
      // Initialize Pi Network service
      await piNetworkService.initialize();
      
      // Get Pi Network status
      const status = await piNetworkService.getStatus();
      console.log('Pi Network status:', status);
      
      toast({
        title: "Pi Network API Called!",
        description: `Status: ${status.available ? 'Available' : 'Not Available'}`,
      });
      
      return status;
    } catch (error) {
      console.error('Failed to call Pi Network API:', error);
      toast({
        title: "Pi Network API Error",
        description: error.message || "Failed to call Pi Network API",
        variant: "destructive",
      });
      throw error;
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Wallet Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            <span>Pi Network Wallet</span>
            {isWalletConfigured && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isWalletConfigured ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Wallet Not Configured</h3>
              <p className="text-gray-600 mb-6">Set up your Pi Network wallet to receive tips</p>
              <Button
                onClick={onSetup}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Setup Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Wallet Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Pi Wallet Address
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={showAddress ? walletAddress : '•'.repeat(walletAddress.length)}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddress(!showAddress)}
                  >
                    {showAddress ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex items-center space-x-6">
                {qrCode && (
                  <div className="flex-shrink-0">
                    <img
                      src={qrCode}
                      alt="Pi Wallet QR Code"
                      className="w-32 h-32 border rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <h4 className="font-medium text-gray-900">QR Code</h4>
                  <p className="text-sm text-gray-600">
                    Share this QR code to receive Pi tips directly to your wallet
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadQR}
                      className="flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateNewAddress}
                      disabled={isGenerating}
                      className="flex items-center space-x-1"
                    >
                      <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                      <span>{isGenerating ? 'Generating...' : 'New Address'}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pi Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <span>Pi Tips Received</span>
            <Badge className="bg-pink-100 text-pink-800 border-pink-200">
              {piTips.length} tips
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Total Tips */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tips Received</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTips.toFixed(2)} π</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Tips List */}
            <div className="space-y-3">
              {piTips.map((tip) => (
                <div
                  key={tip.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        +{tip.amount} π from {tip.from}
                      </div>
                      <div className="text-sm text-gray-600">{tip.message}</div>
                      <div className="text-xs text-gray-500">
                        {formatDate(tip.timestamp)} at {formatTime(tip.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={
                        tip.status === 'completed'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : tip.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }
                    >
                      {tip.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://minepi.com/blockexplorer/address/${walletAddress}`, '_blank')}
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Tips Message */}
            {piTips.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tips Yet</h3>
                <p className="text-gray-600 mb-6">Share your profile to start receiving Pi tips</p>
                <Button
                  variant="outline"
                  onClick={() => window.open(`/${profile?.username || user?.user_metadata?.username || 'username'}`, '_blank')}
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Profile</span>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          onClick={() => window.open(`/${profile?.username || user?.user_metadata?.username || 'username'}`, '_blank')}
          className="flex items-center space-x-2"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Profile</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowAddress(!showAddress)}
          className="flex items-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>{showAddress ? 'Hide' : 'Show'} Address</span>
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadQR}
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download QR</span>
        </Button>
        <Button
          onClick={callPiAPI}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
        >
          <Settings className="w-4 h-4" />
          <span>Call Pi API</span>
        </Button>
        <Button
          onClick={() => window.open('/dashboard?tab=payment-test', '_blank')}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
        >
          <CreditCard className="w-4 h-4" />
          <span>Test Payments</span>
        </Button>
      </div>
    </div>
  );
};

export default PiTipsWallet;
