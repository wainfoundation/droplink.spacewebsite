import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { piPaymentService } from '@/services/piPaymentService';
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WalletInfo: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const walletAddr = piPaymentService.getPlatformWalletAddress();
    setWalletAddress(walletAddr);
    loadBalance();
  }, []);

  const loadBalance = async () => {
    setLoading(true);
    try {
      const walletBalance = await piPaymentService.getPlatformWalletBalance();
      setBalance(walletBalance);
    } catch (error) {
      console.error('Failed to load platform wallet balance:', error);
      toast({
        title: "Error",
        description: "Failed to load platform wallet balance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  const openInExplorer = () => {
    const explorerUrl = `https://api.mainnet.minepi.com/accounts/${walletAddress}`;
    window.open(explorerUrl, '_blank');
  };

  const formatBalance = (balance: number) => {
    return balance.toFixed(7);
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
              {loading ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                `${formatBalance(balance)}`
              )}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadBalance}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Wallet Address */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Platform Wallet Address</p>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <code className="flex-1 text-sm font-mono text-gray-800">
              {formatWalletAddress(walletAddress)}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyWalletAddress}
              className="h-8 w-8 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={openInExplorer}
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
  );
};

export default WalletInfo;
