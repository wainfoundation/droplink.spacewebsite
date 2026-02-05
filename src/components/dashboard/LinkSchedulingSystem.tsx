import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Lock, 
  Check,
  X,
  Star,
  Zap,
  Crown,
  Shield,
  BarChart3,
  TrendingUp,
  Users,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Activity,
  Settings,
  AlertCircle,
  CheckCircle,
  Pause,
  Play,
  Repeat,
  Timer,
  Target,
  Zap as ZapIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { hasFeature, type PlanType } from "@/services/planFeaturesService";

interface ScheduledLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  scheduledDate: string;
  scheduledTime: string;
  timezone: string;
  status: 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  endDate?: string;
  views: number;
  clicks: number;
  createdAt: string;
}

interface LinkSchedulingSystemProps {
  currentPlan: PlanType;
  onUpgrade?: (planId: string) => void;
}

const LinkSchedulingSystem: React.FC<LinkSchedulingSystemProps> = ({
  currentPlan,
  onUpgrade
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'analytics'>('overview');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingLink, setEditingLink] = useState<ScheduledLink | null>(null);

  const [scheduleForm, setScheduleForm] = useState({
    title: '',
    url: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    timezone: 'UTC',
    repeat: 'none' as const,
    endDate: ''
  });

  // Mock scheduled links data
  const [scheduledLinks, setScheduledLinks] = useState<ScheduledLink[]>([
    {
      id: '1',
      title: 'Product Launch Announcement',
      url: 'https://example.com/product-launch',
      description: 'Announcing our new product launch',
      scheduledDate: '2024-01-25',
      scheduledTime: '10:00',
      timezone: 'UTC',
      status: 'scheduled',
      repeat: 'none',
      views: 0,
      clicks: 0,
      createdAt: '2024-01-20T10:30:00Z'
    },
    {
      id: '2',
      title: 'Weekly Newsletter',
      url: 'https://example.com/newsletter',
      description: 'Weekly newsletter with updates',
      scheduledDate: '2024-01-22',
      scheduledTime: '09:00',
      timezone: 'UTC',
      status: 'active',
      repeat: 'weekly',
      endDate: '2024-12-31',
      views: 45,
      clicks: 12,
      createdAt: '2024-01-15T14:20:00Z'
    },
    {
      id: '3',
      title: 'Event Registration',
      url: 'https://example.com/event-registration',
      description: 'Register for our upcoming event',
      scheduledDate: '2024-01-30',
      scheduledTime: '14:00',
      timezone: 'UTC',
      status: 'paused',
      repeat: 'none',
      views: 23,
      clicks: 8,
      createdAt: '2024-01-18T16:45:00Z'
    }
  ]);

  const canUseScheduling = hasFeature(currentPlan, 'scheduling');

  const handleScheduleLink = () => {
    if (!canUseScheduling) {
      toast({
        title: "Link Scheduling Locked",
        description: "Link scheduling is available in Pro plan or higher",
        variant: "destructive"
      });
      if (onUpgrade) {
        onUpgrade('PRO');
      }
      return;
    }

    if (editingLink) {
      // Update existing link
      setScheduledLinks(prev => prev.map(link => 
        link.id === editingLink.id 
          ? { ...link, ...scheduleForm, status: 'scheduled' as const }
          : link
      ));
      toast({
        title: "Link Updated",
        description: "Scheduled link has been updated successfully",
      });
    } else {
      // Create new link
      const newLink: ScheduledLink = {
        id: Date.now().toString(),
        ...scheduleForm,
        status: 'scheduled',
        views: 0,
        clicks: 0,
        createdAt: new Date().toISOString()
      };
      setScheduledLinks(prev => [...prev, newLink]);
      toast({
        title: "Link Scheduled",
        description: "Link has been scheduled successfully",
      });
    }

    setShowScheduleForm(false);
    setEditingLink(null);
    setScheduleForm({
      title: '',
      url: '',
      description: '',
      scheduledDate: '',
      scheduledTime: '',
      timezone: 'UTC',
      repeat: 'none',
      endDate: ''
    });
  };

  const handleEditLink = (link: ScheduledLink) => {
    setEditingLink(link);
    setScheduleForm({
      title: link.title,
      url: link.url,
      description: link.description || '',
      scheduledDate: link.scheduledDate,
      scheduledTime: link.scheduledTime,
      timezone: link.timezone,
      repeat: link.repeat || 'none',
      endDate: link.endDate || ''
    });
    setShowScheduleForm(true);
  };

  const handleDeleteLink = (linkId: string) => {
    setScheduledLinks(prev => prev.filter(link => link.id !== linkId));
    toast({
      title: "Link Deleted",
      description: "Scheduled link has been deleted",
    });
  };

  const handleToggleStatus = (linkId: string, newStatus: ScheduledLink['status']) => {
    setScheduledLinks(prev => prev.map(link => 
      link.id === linkId ? { ...link, status: newStatus } : link
    ));
    toast({
      title: "Status Updated",
      description: `Link status changed to ${newStatus}`,
    });
  };

  const getStatusColor = (status: ScheduledLink['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
    }
  };

  const getStatusIcon = (status: ScheduledLink['status']) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'active': return <Play className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
    }
  };

  const totalScheduled = scheduledLinks.length;
  const activeLinks = scheduledLinks.filter(link => link.status === 'active').length;
  const totalViews = scheduledLinks.reduce((sum, link) => sum + link.views, 0);
  const totalClicks = scheduledLinks.reduce((sum, link) => sum + link.clicks, 0);

  if (!canUseScheduling) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Link Scheduling Not Available</h3>
          <p className="text-gray-600 mb-6">
            Link scheduling is available in Pro plan or higher. Upgrade to schedule your links for optimal engagement.
          </p>
          <Button onClick={() => onUpgrade?.('PRO')}>
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Pro
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
          <h2 className="text-2xl font-bold text-gray-900">Link Scheduling</h2>
          <p className="text-gray-600">Schedule your links for optimal engagement</p>
        </div>
        <Button onClick={() => setShowScheduleForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Link
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Scheduled</p>
                <p className="text-2xl font-bold text-blue-900">{totalScheduled}</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +3 this week
                </div>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Links</p>
                <p className="text-2xl font-bold text-green-900">{activeLinks}</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <Play className="h-4 w-4" />
                  {activeLinks} running
                </div>
              </div>
              <ZapIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Views</p>
                <p className="text-2xl font-bold text-purple-900">{totalViews}</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <Eye className="h-4 w-4" />
                  +25% this week
                </div>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Clicks</p>
                <p className="text-2xl font-bold text-orange-900">{totalClicks}</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <Target className="h-4 w-4" />
                  +18% this week
                </div>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveTab('overview')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={activeTab === 'schedule' ? 'default' : 'outline'}
          onClick={() => setActiveTab('schedule')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'outline'}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </Button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-gray-200 rounded flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{link.title}</h4>
                        <Badge className={getStatusColor(link.status)}>
                          {getStatusIcon(link.status)}
                          <span className="ml-1 capitalize">{link.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{link.url}</p>
                      {link.description && (
                        <p className="text-sm text-gray-500 mb-2">{link.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(`${link.scheduledDate}T${link.scheduledTime}`).toLocaleString()}
                        </span>
                        {link.repeat !== 'none' && (
                          <span className="flex items-center gap-1">
                            <Repeat className="w-3 h-3" />
                            {link.repeat}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {link.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {link.clicks} clicks
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEditLink(link)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {link.status === 'active' ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleToggleStatus(link.id, 'paused')}
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                    ) : link.status === 'paused' ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleToggleStatus(link.id, 'active')}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleToggleStatus(link.id, 'active')}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <Card>
          <CardHeader>
            <CardTitle>{editingLink ? 'Edit Scheduled Link' : 'Schedule New Link'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Link Title</Label>
                <Input
                  id="title"
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  placeholder="Enter link title"
                />
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={scheduleForm.url}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={scheduleForm.description}
                onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                placeholder="Enter link description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={scheduleForm.scheduledDate}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="scheduledTime">Scheduled Time</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={scheduleForm.scheduledTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  value={scheduleForm.timezone}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                  <option value="GMT">GMT</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="repeat">Repeat</Label>
                <select
                  id="repeat"
                  value={scheduleForm.repeat}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, repeat: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">No Repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              {scheduleForm.repeat !== 'none' && (
                <div>
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={scheduleForm.endDate}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, endDate: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleScheduleLink}>
                {editingLink ? 'Update Link' : 'Schedule Link'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowScheduleForm(false);
                  setEditingLink(null);
                  setScheduleForm({
                    title: '',
                    url: '',
                    description: '',
                    scheduledDate: '',
                    scheduledTime: '',
                    timezone: 'UTC',
                    repeat: 'none',
                    endDate: ''
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Active</span>
                    </div>
                    <span className="font-semibold">{activeLinks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Scheduled</span>
                    </div>
                    <span className="font-semibold">{scheduledLinks.filter(l => l.status === 'scheduled').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Paused</span>
                    </div>
                    <span className="font-semibold">{scheduledLinks.filter(l => l.status === 'paused').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Views</span>
                    <span className="font-semibold">{totalViews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Clicks</span>
                    <span className="font-semibold">{totalClicks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Click Rate</span>
                    <span className="font-semibold">
                      {totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkSchedulingSystem;
