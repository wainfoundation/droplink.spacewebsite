import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Share2, 
  Copy,
  QrCode,
  Eye,
  Link as LinkIcon,
  ArrowLeft,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getProfileUrl } from '@/utils/url-helper';

const PublicProfileTest: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (value) {
      const url = getProfileUrl(value);
      setProfileUrl(url);
    } else {
      setProfileUrl('');
    }
  };

  const copyToClipboard = async () => {
    if (!profileUrl) return;
    
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Profile URL copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const openProfile = () => {
    if (profileUrl) {
      window.open(profileUrl, '_blank');
    }
  };

  const generateQRCode = () => {
    if (profileUrl) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`;
      window.open(qrUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Badge className="bg-white/20 text-white">
            <LinkIcon className="w-3 h-3 mr-1" />
            Public Profile Test
          </Badge>
        </div>

        <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">
              Test Public Profile Sharing
            </h1>

            {/* Username Input */}
            <div className="space-y-4 mb-6">
              <label className="block text-sm font-medium">
                Enter Username
              </label>
              <Input
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="Enter username (e.g., john_doe)"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>

            {/* Generated URL */}
            {profileUrl && (
              <div className="space-y-4 mb-6">
                <label className="block text-sm font-medium">
                  Generated Profile URL
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={profileUrl}
                    readOnly
                    className="flex-1 bg-white/10 border-white/20 text-white"
                  />
                  <Button
                    onClick={copyToClipboard}
                    variant={copied ? "default" : "outline"}
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {profileUrl && (
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={openProfile}
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button
                  onClick={generateQRCode}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 p-4 bg-white/10 rounded-lg">
              <h3 className="font-semibold mb-2">How to Test:</h3>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Enter a username in the input field above</li>
                <li>Click "View Profile" to see the public profile</li>
                <li>Use "Copy Link" to copy the profile URL</li>
                <li>Use "QR Code" to generate a QR code for sharing</li>
                <li>Share the link with others to test public access</li>
              </ol>
            </div>

            {/* Example URLs */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <h3 className="font-semibold mb-2">Example URLs:</h3>
              <div className="text-sm space-y-1">
                <p>• <code className="bg-white/10 px-2 py-1 rounded">localhost:5173/john_doe</code></p>
                <p>• <code className="bg-white/10 px-2 py-1 rounded">localhost:5173/username</code></p>
                <p>• <code className="bg-white/10 px-2 py-1 rounded">localhost:5173/your_username</code></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicProfileTest;
