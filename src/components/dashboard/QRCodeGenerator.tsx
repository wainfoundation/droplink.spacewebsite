import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  Download, 
  Share2, 
  Copy, 
  Check,
  Smartphone,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  profileUrl: string;
  username: string;
  userPlan: string;
}

const QRCodeGenerator = ({ profileUrl, username, userPlan }: QRCodeGeneratorProps) => {
  const { toast } = useToast();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [qrSize, setQrSize] = useState<number>(256);

  useEffect(() => {
    generateQRCode();
  }, [profileUrl, qrSize]);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      // In a real implementation, you would use a QR code library
      // For now, we'll create a simple placeholder
      const canvas = document.createElement('canvas');
      canvas.width = qrSize;
      canvas.height = qrSize;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create a simple QR-like pattern (this is just a placeholder)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, qrSize, qrSize);
        
        ctx.fillStyle = '#000000';
        const cellSize = qrSize / 25;
        
        // Create a simple pattern
        for (let i = 0; i < 25; i++) {
          for (let j = 0; j < 25; j++) {
            if ((i + j) % 2 === 0 || (i < 7 && j < 7) || (i > 17 && j < 7) || (i < 7 && j > 17)) {
              ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
          }
        }
        
        // Add text
        ctx.fillStyle = '#000000';
        ctx.font = `${qrSize / 20}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('QR Code', qrSize / 2, qrSize - 10);
      }
      
      const dataUrl = canvas.toDataURL('image/png');
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "QR Code Generation Failed",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `qr-code-${username}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code Downloaded",
      description: "QR code has been downloaded successfully",
    });
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username}'s Profile`,
          text: `Check out ${username}'s profile on Droplink`,
          url: profileUrl,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to copying URL
      copyToClipboard(profileUrl, "Profile URL");
    }
  };

  const getQRSizeOptions = () => [
    { value: 128, label: "Small (128px)" },
    { value: 256, label: "Medium (256px)" },
    { value: 512, label: "Large (512px)" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">QR Code & Sharing</h2>
          <p className="text-gray-600">Generate QR codes and share your profile</p>
        </div>
        <Badge variant="secondary">
          {userPlan === 'free' ? 'Free' : userPlan === 'starter' ? 'Starter' : 'Pro'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="w-5 h-5 mr-2" />
              QR Code Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QR Code Size Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Code Size
              </label>
              <div className="flex space-x-2">
                {getQRSizeOptions().map((option) => (
                  <Button
                    key={option.value}
                    variant={qrSize === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQrSize(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* QR Code Display */}
            <div className="flex justify-center">
              <div className="relative">
                {isGenerating ? (
                  <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Generating QR Code...</p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                    <img
                      src={qrCodeDataUrl}
                      alt="QR Code"
                      className="w-64 h-64"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Download Button */}
            <Button
              onClick={downloadQRCode}
              disabled={!qrCodeDataUrl || isGenerating}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
          </CardContent>
        </Card>

        {/* Sharing Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Share2 className="w-5 h-5 mr-2" />
              Share Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Profile URL
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  value={profileUrl}
                  readOnly
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(profileUrl, "Profile URL")}
                >
                  {copiedField === "Profile URL" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="space-y-3">
              <Button
                onClick={shareProfile}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(`Check out my profile: ${profileUrl}`, "Share Message")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Message
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(profileUrl, '_blank')}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </div>

            {/* Mobile Preview */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile Preview
              </h4>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{username}</p>
                      <p className="text-xs text-gray-500">@{username}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>QR Code Usage Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Business Cards</h4>
              <p className="text-gray-600">Add your QR code to business cards for easy profile sharing</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Social Media</h4>
              <p className="text-gray-600">Share your QR code on Instagram stories, Twitter, or LinkedIn</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Print Materials</h4>
              <p className="text-gray-600">Include QR codes on flyers, posters, or other marketing materials</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;
