import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  QrCode, 
  Download, 
  Share2, 
  Copy, 
  Settings, 
  Eye, 
  Lock, 
  Check,
  X,
  Star,
  Zap,
  Crown,
  Shield,
  Palette,
  Image,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  MapPin,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { hasFeature, type PlanType } from "@/services/planFeaturesService";

interface QRCodeConfig {
  size: number;
  color: string;
  backgroundColor: string;
  logo?: string;
  style: 'square' | 'rounded' | 'dots';
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
}

interface QRCodeSystemProps {
  currentPlan: PlanType;
  profileUrl: string;
  onUpgrade?: (planId: string) => void;
}

const QRCodeSystem: React.FC<QRCodeSystemProps> = ({
  currentPlan,
  profileUrl,
  onUpgrade
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'generate' | 'analytics' | 'settings'>('generate');
  const [qrConfig, setQrConfig] = useState<QRCodeConfig>({
    size: 256,
    color: '#000000',
    backgroundColor: '#ffffff',
    style: 'square',
    errorCorrection: 'M'
  });

  const [generatedQRs, setGeneratedQRs] = useState([
    {
      id: '1',
      name: 'Profile QR Code',
      url: profileUrl,
      size: 256,
      downloads: 45,
      scans: 120,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Event QR Code',
      url: `${profileUrl}?ref=event`,
      size: 512,
      downloads: 23,
      scans: 67,
      createdAt: '2024-01-10'
    }
  ]);

  const canUseQRCode = hasFeature(currentPlan, 'qrCode');

  const generateQRCode = () => {
    if (!canUseQRCode) {
      toast({
        title: "QR Code Locked",
        description: "QR Code generation is available in Starter plan or higher",
        variant: "destructive"
      });
      if (onUpgrade) {
        onUpgrade('STARTER');
      }
      return;
    }

    // In a real implementation, this would generate an actual QR code
    toast({
      title: "QR Code Generated",
      description: "Your QR code has been generated successfully",
    });
  };

  const downloadQRCode = (qrId: string) => {
    toast({
      title: "Download Started",
      description: "QR code download has started",
    });
  };

  const shareQRCode = (qrId: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'My Profile QR Code',
        text: 'Check out my profile!',
        url: profileUrl
      });
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Link Copied",
        description: "Profile URL copied to clipboard",
      });
    }
  };

  const copyQRCode = (qrId: string) => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link Copied",
      description: "Profile URL copied to clipboard",
    });
  };

  if (!canUseQRCode) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">QR Code Not Available</h3>
          <p className="text-gray-600 mb-6">
            QR Code generation is available in Starter plan or higher. Upgrade to create QR codes for your profile.
          </p>
          <Button onClick={() => onUpgrade?.('STARTER')}>
            <Zap className="h-4 w-4 mr-2" />
            Upgrade to Starter
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">QR Code Generator</h2>
          <p className="text-gray-600">Create and manage QR codes for your profile</p>
        </div>
        <Button onClick={generateQRCode}>
          <QrCode className="w-4 h-4 mr-2" />
          Generate QR Code
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total QR Codes</p>
                <p className="text-2xl font-bold text-blue-900">{generatedQRs.length}</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +2 this month
                </div>
              </div>
              <QrCode className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Scans</p>
                <p className="text-2xl font-bold text-green-900">
                  {generatedQRs.reduce((sum, qr) => sum + qr.scans, 0)}
                </p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <Activity className="h-4 w-4" />
                  +15% this week
                </div>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Downloads</p>
                <p className="text-2xl font-bold text-purple-900">
                  {generatedQRs.reduce((sum, qr) => sum + qr.downloads, 0)}
                </p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <Download className="h-4 w-4" />
                  +8% this week
                </div>
              </div>
              <Download className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'generate' ? 'default' : 'outline'}
          onClick={() => setActiveTab('generate')}
        >
          <QrCode className="w-4 h-4 mr-2" />
          Generate
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'outline'}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'default' : 'outline'}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code Preview */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div 
                  className="w-64 h-64 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: qrConfig.backgroundColor }}
                >
                  <div className="text-center">
                    <QrCode className="w-32 h-32 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">QR Code Preview</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => downloadQRCode('preview')} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button onClick={() => shareQRCode('preview')} variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button onClick={() => copyQRCode('preview')} variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Settings */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="size">Size (px)</Label>
                <Input
                  id="size"
                  type="number"
                  value={qrConfig.size}
                  onChange={(e) => setQrConfig({ ...qrConfig, size: parseInt(e.target.value) })}
                  min="128"
                  max="1024"
                  step="64"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color">Foreground Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={qrConfig.color}
                      onChange={(e) => setQrConfig({ ...qrConfig, color: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={qrConfig.color}
                      onChange={(e) => setQrConfig({ ...qrConfig, color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={qrConfig.backgroundColor}
                      onChange={(e) => setQrConfig({ ...qrConfig, backgroundColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={qrConfig.backgroundColor}
                      onChange={(e) => setQrConfig({ ...qrConfig, backgroundColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="style">Style</Label>
                <select
                  id="style"
                  value={qrConfig.style}
                  onChange={(e) => setQrConfig({ ...qrConfig, style: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="square">Square</option>
                  <option value="rounded">Rounded</option>
                  <option value="dots">Dots</option>
                </select>
              </div>

              <div>
                <Label htmlFor="errorCorrection">Error Correction</Label>
                <select
                  id="errorCorrection"
                  value={qrConfig.errorCorrection}
                  onChange={(e) => setQrConfig({ ...qrConfig, errorCorrection: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedQRs.map((qr) => (
                  <div key={qr.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white border border-gray-200 rounded flex items-center justify-center">
                        <QrCode className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{qr.name}</h4>
                        <p className="text-sm text-gray-600">{qr.url}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {qr.scans} scans
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {qr.downloads} downloads
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(qr.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => downloadQRCode(qr.id)}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => shareQRCode(qr.id)}>
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scans by Device</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-500" />
                      <span>Mobile</span>
                    </div>
                    <span className="font-semibold">75%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-green-500" />
                      <span>Desktop</span>
                    </div>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tablet className="w-4 h-4 text-purple-500" />
                      <span>Tablet</span>
                    </div>
                    <span className="font-semibold">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scans by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>United States</span>
                    </div>
                    <span className="font-semibold">40%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span>Canada</span>
                    </div>
                    <span className="font-semibold">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      <span>United Kingdom</span>
                    </div>
                    <span className="font-semibold">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>Other</span>
                    </div>
                    <span className="font-semibold">20%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Card>
          <CardHeader>
            <CardTitle>QR Code Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="defaultSize">Default Size (px)</Label>
                <Input
                  id="defaultSize"
                  type="number"
                  defaultValue="256"
                  min="128"
                  max="1024"
                  step="64"
                />
              </div>
              <div>
                <Label htmlFor="defaultFormat">Default Format</Label>
                <select
                  id="defaultFormat"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="png">PNG</option>
                  <option value="svg">SVG</option>
                  <option value="jpg">JPG</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoGenerate"
                defaultChecked
                className="rounded"
              />
              <Label htmlFor="autoGenerate">Auto-generate QR code for new links</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="trackScans"
                defaultChecked
                className="rounded"
              />
              <Label htmlFor="trackScans">Track QR code scans</Label>
            </div>

            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRCodeSystem;
