import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdAccessGate from '@/components/ads/AdAccessGate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Star, 
  Clock, 
  Users, 
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdProtectedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Premium Content - Droplink</title>
        <meta name="description" content="Access premium content with Pi Network ads or Elite plan" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Premium Content</h1>
              <p className="text-gray-600">Access exclusive content with Pi Network</p>
            </div>
          </div>

          {/* Ad Access Gate */}
          <AdAccessGate
            title="Watch Ad to Access Premium Content"
            description="Watch a Pi Network ad to access this premium content."
            contentName="premium content"
          >
            {/* Premium Content */}
            <div className="grid gap-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12,345</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,234π</div>
                    <p className="text-xs text-muted-foreground">
                      +15.3% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,345</div>
                    <p className="text-xs text-muted-foreground">
                      +5.2% from last hour
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Premium Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      Advanced Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Get detailed insights into your link performance with advanced analytics.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Real-time tracking</Badge>
                        <Badge variant="secondary">Click heatmaps</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Conversion funnels</Badge>
                        <Badge variant="secondary">A/B testing</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-purple-600" />
                      Premium Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Access exclusive templates designed by professional designers.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Custom themes</Badge>
                        <Badge variant="secondary">Brand colors</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Premium fonts</Badge>
                        <Badge variant="secondary">Custom CSS</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Success Message */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-900">Access Granted!</h3>
                      <p className="text-green-700">
                        You now have access to this premium content. Thank you for supporting the Pi Network ecosystem!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AdAccessGate>
        </div>
      </div>
    </>
  );
};

export default AdProtectedPage;
