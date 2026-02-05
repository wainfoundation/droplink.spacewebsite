import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Link as LinkIcon, 
  TrendingUp, 
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Ban,
  UserCheck,
  Activity,
  BarChart3,
  PieChart,
  Globe,
  Smartphone,
  Monitor
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  display_name: string;
  email: string;
  plan: string;
  created_at: string;
  last_active: string;
  status: 'active' | 'suspended' | 'banned';
  total_links: number;
  total_views: number;
  total_clicks: number;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalLinks: number;
  totalViews: number;
  totalClicks: number;
  revenue: number;
  newUsersToday: number;
  newUsersThisWeek: number;
}

// Mock data
const MOCK_USERS: User[] = [
  {
    id: "1",
    username: "john_doe",
    display_name: "John Doe",
    email: "john@example.com",
    plan: "PRO",
    created_at: "2024-01-15T10:00:00Z",
    last_active: "2024-01-21T15:30:00Z",
    status: "active",
    total_links: 8,
    total_views: 1247,
    total_clicks: 2840
  },
  {
    id: "2",
    username: "jane_smith",
    display_name: "Jane Smith",
    email: "jane@example.com",
    plan: "STARTER",
    created_at: "2024-01-18T14:20:00Z",
    last_active: "2024-01-21T12:15:00Z",
    status: "active",
    total_links: 5,
    total_views: 856,
    total_clicks: 1923
  },
  {
    id: "3",
    username: "spam_user",
    display_name: "Spam User",
    email: "spam@example.com",
    plan: "FREE",
    created_at: "2024-01-20T09:00:00Z",
    last_active: "2024-01-20T09:05:00Z",
    status: "banned",
    total_links: 1,
    total_views: 0,
    total_clicks: 0
  }
];

const MOCK_STATS: SystemStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalLinks: 5678,
  totalViews: 45678,
  totalClicks: 123456,
  revenue: 12345.67,
  newUsersToday: 23,
  newUsersThisWeek: 156
};

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [stats, setStats] = useState<SystemStats>(MOCK_STATS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUserAction = async (userId: string, action: 'suspend' | 'ban' | 'activate' | 'delete') => {
    try {
      setIsLoading(true);
      
      // Mock action
      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          switch (action) {
            case 'suspend':
              return { ...user, status: 'suspended' as const };
            case 'ban':
              return { ...user, status: 'banned' as const };
            case 'activate':
              return { ...user, status: 'active' as const };
            case 'delete':
              return user; // Will be filtered out below
            default:
              return user;
          }
        }
        return user;
      }));
      
      if (action === 'delete') {
        setUsers(prev => prev.filter(user => user.id !== userId));
      }
      
      toast({
        title: "Action completed",
        description: `User ${action}ed successfully`,
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform action",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = (type: 'users' | 'stats') => {
    try {
      let data, filename;
      
      if (type === 'users') {
        data = filteredUsers;
        filename = 'users_export.json';
      } else {
        data = stats;
        filename = 'stats_export.json';
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: `${filename} downloaded`,
      });
      
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, monitor system performance, and oversee platform operations</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-green-600">+{stats.newUsersToday} today</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Links</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalLinks.toLocaleString()}</p>
                </div>
                <LinkIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  {Math.round(stats.totalLinks / stats.totalUsers)} per user
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  {Math.round(stats.totalViews / stats.totalUsers)} per user
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* User Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="banned">Banned</option>
                    </select>
                    <Button onClick={() => exportData('users')} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">User</th>
                        <th className="text-left py-3 px-4">Plan</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Links</th>
                        <th className="text-left py-3 px-4">Views</th>
                        <th className="text-left py-3 px-4">Clicks</th>
                        <th className="text-left py-3 px-4">Last Active</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{user.display_name}</p>
                              <p className="text-sm text-gray-500">@{user.username}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="secondary">{user.plan}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={user.status === 'active' ? 'default' : 
                                      user.status === 'suspended' ? 'secondary' : 'destructive'}
                            >
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{user.total_links}</td>
                          <td className="py-3 px-4">{user.total_views.toLocaleString()}</td>
                          <td className="py-3 px-4">{user.total_clicks.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            {new Date(user.last_active).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserAction(user.id, 'activate')}
                                disabled={user.status === 'active'}
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserAction(user.id, 'suspend')}
                                disabled={user.status === 'suspended'}
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserAction(user.id, 'ban')}
                                disabled={user.status === 'banned'}
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserAction(user.id, 'delete')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>New Users Today</span>
                      <span className="font-bold text-green-600">+{stats.newUsersToday}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>New Users This Week</span>
                      <span className="font-bold text-green-600">+{stats.newUsersThisWeek}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total Revenue</span>
                      <span className="font-bold text-blue-600">${stats.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Total Clicks</span>
                      <span className="font-bold">{stats.totalClicks.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Click-through Rate</span>
                      <span className="font-bold">
                        {Math.round((stats.totalClicks / stats.totalViews) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Avg Links per User</span>
                      <span className="font-bold">
                        {Math.round(stats.totalLinks / stats.totalUsers)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            {/* System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">All systems operational</p>
                  <p className="text-xs text-green-600 mt-1">Response time: 45ms</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    API Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">All services running</p>
                  <p className="text-xs text-green-600 mt-1">Uptime: 99.9%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    Pi Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Minor delays detected</p>
                  <p className="text-xs text-yellow-600 mt-1">Response time: 2.3s</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="maintenance" className="rounded" />
                    <span className="text-sm text-gray-600">Enable maintenance mode</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registrations">New Registrations</Label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="registrations" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-600">Allow new user registrations</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-rate">API Rate Limit</Label>
                  <Input
                    id="api-rate"
                    type="number"
                    defaultValue="1000"
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600">requests per hour</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
