import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  User, 
  CheckCircle, 
  ExternalLink,
  Pi,
  Globe,
  Users
} from 'lucide-react';
import PiProfileImport from '@/components/PiProfileImport';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoToTop from '@/components/GoToTop';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

const PiProfileImportPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const [importedProfile, setImportedProfile] = useState<any>(null);

  const handleProfileImport = (profileData: any) => {
    setImportedProfile(profileData);
    toast({
      title: "Profile Imported Successfully",
      description: "Your Pi Network profile has been imported to Droplink",
    });
  };

  const handleContinueToDashboard = () => {
    navigate('/dashboard');
  };

  const handleCreateNewProfile = () => {
    navigate('/onboarding');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar />
        
        <main className="flex-grow py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Pi className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Droplink</h1>
                  <Badge variant="outline" className="text-xs">Pi Network Integration</Badge>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2">Import Your Pi Network Profile</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Connect your Pi Network profile to automatically import your bio, avatar, and social links to Droplink
              </p>
            </div>

            {/* Benefits Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Why Import from Pi Network?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold">Profile Data</h3>
                    <p className="text-sm text-gray-600">
                      Import your display name, bio, and profile picture
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Globe className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold">Social Links</h3>
                    <p className="text-sm text-gray-600">
                      Automatically add your social media links
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">Community</h3>
                    <p className="text-sm text-gray-600">
                      Connect with the Pi Network community
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Import Component */}
            <PiProfileImport 
              onProfileImport={handleProfileImport}
              onCancel={() => navigate('/onboarding')}
            />

            {/* Success State */}
            {importedProfile && (
              <Card className="mt-8 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Profile Imported Successfully!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    {importedProfile.avatar && (
                      <img 
                        src={importedProfile.avatar} 
                        alt={importedProfile.displayName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{importedProfile.displayName}</h3>
                      {importedProfile.bio && (
                        <p className="text-gray-600 mt-1">{importedProfile.bio}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        {importedProfile.links?.length || 0} links imported
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button onClick={handleContinueToDashboard} className="flex-1">
                      Continue to Dashboard
                    </Button>
                    <Button variant="outline" onClick={handleCreateNewProfile}>
                      Create New Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alternative Options */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Don't have a Pi Network profile or want to start fresh?
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate('/onboarding')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Onboarding
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Skip Import
                </Button>
              </div>
            </div>

            {/* Pi Network Info */}
            <Card className="mt-8">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Pi className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold">Powered by Pi Network</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    This integration connects to the official Pi Network profiles service at{' '}
                    <a 
                      href="https://profiles.pinet.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 justify-center"
                    >
                      profiles.pinet.com
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
        <GoToTop />
      </div>
    </>
  );
};

export default PiProfileImportPage;
