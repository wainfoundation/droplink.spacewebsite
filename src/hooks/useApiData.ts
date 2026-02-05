import { useState, useEffect, useCallback } from 'react';
import { apiService, Link, Analytics, UserProfile, User, Project, Payment, Log, Team, TeamMember, Domain, Data, QRCode } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

interface LinkStatistics {
  pageviews: number;
  visitors: number;
  formatted_date: string;
}

interface UseApiDataReturn {
  // Data
  links: Link[];
  analytics: Analytics | null;
  profile: UserProfile | null;
  user: User | null;
  projects: Project[];
  payments: Payment[];
  logs: Log[];
  teams: Team[];
  teamMembers: TeamMember[];
  domains: Domain[];
  data: Data[];
  qrCodes: QRCode[];
  linkStatistics: LinkStatistics[];
  dashboardStats: {
    totalLinks: number;
    totalClicks: number;
    totalViews: number;
    clickRate: number;
    topLink: Link | null;
    recentActivity: Link[];
  } | null;
  
  // Loading states
  loading: {
    links: boolean;
    analytics: boolean;
    profile: boolean;
    user: boolean;
    projects: boolean;
    payments: boolean;
    logs: boolean;
    teams: boolean;
    teamMembers: boolean;
    domains: boolean;
    data: boolean;
    qrCodes: boolean;
    statistics: boolean;
    dashboard: boolean;
  };
  
  // Error states
  errors: {
    links: string | null;
    analytics: string | null;
    profile: string | null;
    user: string | null;
    projects: string | null;
    payments: string | null;
    logs: string | null;
    teams: string | null;
    teamMembers: string | null;
    domains: string | null;
    data: string | null;
    qrCodes: string | null;
    statistics: string | null;
    dashboard: string | null;
  };
  
  // Actions
  createLink: (linkData: {
    title?: string;
    url?: string;
    location_url: string;
    type?: string;
    description?: string;
    [key: string]: any;
  }) => Promise<boolean>;
  updateLink: (id: string, updates: {
    title?: string;
    url?: string;
    location_url?: string;
    type?: string;
    description?: string;
    [key: string]: any;
  }) => Promise<boolean>;
  deleteLink: (id: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
  searchLinks: (query: string) => Promise<Link[]>;
  getLinksByType: (type: string) => Promise<Link[]>;
  exportLinks: (format: 'json' | 'csv' | 'xlsx') => Promise<boolean>;
  getLinkStatistics: (linkId: number, params: {
    start_date: string;
    end_date: string;
    type?: string;
    country_code?: string;
    utm_source?: string;
    utm_medium?: string;
    referrer_host?: string;
  }) => Promise<LinkStatistics[]>;
  createProject: (projectData: {
    name: string;
    color?: string;
  }) => Promise<boolean>;
  updateProject: (id: number, updates: {
    name?: string;
    color?: string;
  }) => Promise<boolean>;
  deleteProject: (id: number) => Promise<boolean>;
  createTeam: (name: string) => Promise<boolean>;
  updateTeam: (id: number, updates: {
    name?: string;
  }) => Promise<boolean>;
  deleteTeam: (id: number) => Promise<boolean>;
  createTeamMember: (teamId: number, userEmail: string, access?: string[]) => Promise<boolean>;
  updateTeamMember: (id: number, updates: {
    access?: string[];
  }) => Promise<boolean>;
  deleteTeamMember: (id: number) => Promise<boolean>;
  createDomain: (host: string, customIndexUrl?: string, customNotFoundUrl?: string) => Promise<boolean>;
  updateDomain: (id: number, updates: { host?: string; custom_index_url?: string; custom_not_found_url?: string }) => Promise<boolean>;
  deleteDomain: (id: number) => Promise<boolean>;
  deleteDatum: (id: number) => Promise<boolean>;
  createQRCode: (data: any) => Promise<boolean>;
  updateQRCode: (id: number, data: any) => Promise<boolean>;
  deleteQRCode: (id: number) => Promise<boolean>;
}

export const useApiData = (): UseApiDataReturn => {
  const { toast } = useToast();
  
  // Data state
  const [links, setLinks] = useState<Link[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [data, setData] = useState<Data[]>([]);
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [linkStatistics, setLinkStatistics] = useState<LinkStatistics[]>([]);
  const [dashboardStats, setDashboardStats] = useState<{
    totalLinks: number;
    totalClicks: number;
    totalViews: number;
    clickRate: number;
    topLink: Link | null;
    recentActivity: Link[];
  } | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState({
    links: false,
    analytics: false,
    profile: false,
    user: false,
    projects: false,
    payments: false,
    logs: false,
    teams: false,
    teamMembers: false,
    domains: false,
    data: false,
    qrCodes: false,
    statistics: false,
    dashboard: false,
  });
  
  // Error states
  const [errors, setErrors] = useState({
    links: null as string | null,
    analytics: null as string | null,
    profile: null as string | null,
    user: null as string | null,
    projects: null as string | null,
    payments: null as string | null,
    logs: null as string | null,
    teams: null as string | null,
    teamMembers: null as string | null,
    domains: null as string | null,
    data: null as string | null,
    qrCodes: null as string | null,
    statistics: null as string | null,
    dashboard: null as string | null,
  });

  // Load links
  const loadLinks = useCallback(async () => {
    setLoading(prev => ({ ...prev, links: true }));
    setErrors(prev => ({ ...prev, links: null }));
    
    try {
      const response = await apiService.getLinks();
      if (response.success) {
        setLinks(response.data.data || []);
      } else {
        setErrors(prev => ({ ...prev, links: response.message || 'Failed to load links' }));
        toast({
          title: "Error",
          description: response.message || "Failed to load links",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load links';
      setErrors(prev => ({ ...prev, links: errorMessage }));
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, links: false }));
    }
  }, [toast]);

  // Load analytics
  const loadAnalytics = useCallback(async () => {
    setLoading(prev => ({ ...prev, analytics: true }));
    setErrors(prev => ({ ...prev, analytics: null }));
    
    try {
      const response = await apiService.getAnalytics();
      if (response.success) {
        setAnalytics(response.data);
      } else {
        setErrors(prev => ({ ...prev, analytics: response.message || 'Failed to load analytics' }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load analytics';
      setErrors(prev => ({ ...prev, analytics: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, analytics: false }));
    }
  }, []);

  // Load profile
  const loadProfile = useCallback(async () => {
    setLoading(prev => ({ ...prev, profile: true }));
    setErrors(prev => ({ ...prev, profile: null }));
    
    try {
      const response = await apiService.getProfile();
      if (response.success) {
        setProfile(response.data);
      } else {
        setErrors(prev => ({ ...prev, profile: response.message || 'Failed to load profile' }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load profile';
      setErrors(prev => ({ ...prev, profile: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  }, []);

  // Load user
  const loadUser = useCallback(async () => {
    setLoading(prev => ({ ...prev, user: true }));
    setErrors(prev => ({ ...prev, user: null }));
    
    try {
      const response = await apiService.getUser();
      if (response.success) {
        setUser(response.data);
      } else {
        setErrors(prev => ({ ...prev, user: response.message || 'Failed to load user data' }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load user data';
      setErrors(prev => ({ ...prev, user: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, user: false }));
    }
  }, []);

  // Load projects
  const loadProjects = useCallback(async () => {
    setLoading(prev => ({ ...prev, projects: true }));
    setErrors(prev => ({ ...prev, projects: null }));
    
    try {
      const response = await apiService.getProjects();
      if (response.success) {
        setProjects(response.data.data || []);
      } else {
        setErrors(prev => ({ ...prev, projects: response.message || 'Failed to load projects' }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load projects';
      setErrors(prev => ({ ...prev, projects: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, projects: false }));
    }
  }, []);

  // Load payments
  const loadPayments = useCallback(async () => {
    setLoading(prev => ({ ...prev, payments: true }));
    setErrors(prev => ({ ...prev, payments: null }));
    
    try {
      const response = await apiService.getPayments();
      if (response.success) {
        setPayments(response.data.data || []);
      } else {
        setErrors(prev => ({ ...prev, payments: response.message || 'Failed to load payments' }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load payments';
      setErrors(prev => ({ ...prev, payments: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, payments: false }));
    }
  }, []);

  // Load logs
  const loadLogs = useCallback(async () => {
    setLoading(prev => ({ ...prev, logs: true }));
    setErrors(prev => ({ ...prev, logs: null }));
    
    try {
      const response = await apiService.getLogs();
      if (response.success) {
        setLogs(response.data.data || []);
      } else {
        setErrors(prev => ({ ...prev, logs: response.message || 'Failed to load logs' }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load logs';
      setErrors(prev => ({ ...prev, logs: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, logs: false }));
    }
  }, []);

  // Load teams
  const loadTeams = useCallback(async () => {
    setLoading(prev => ({ ...prev, teams: true }));
    setErrors(prev => ({ ...prev, teams: null }));
    
    try {
      const response = await apiService.getTeams();
      if (response.success) {
        setTeams(response.data.data || []);
      } else {
        setErrors(prev => ({ ...prev, teams: response.message || 'Failed to load teams' }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load teams';
      setErrors(prev => ({ ...prev, teams: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, teams: false }));
    }
  }, []);

  const loadDomains = useCallback(async () => {
    setLoading(prev => ({ ...prev, domains: true }));
    setErrors(prev => ({ ...prev, domains: null }));
    
    try {
      const response = await apiService.getDomains();
      if (response.success) {
        setDomains(response.data.data || []);
      } else {
        setErrors(prev => ({ ...prev, domains: response.message || 'Failed to load domains' }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load domains';
      setErrors(prev => ({ ...prev, domains: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, domains: false }));
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(prev => ({ ...prev, data: true }));
    setErrors(prev => ({ ...prev, data: null }));
    
    try {
      const response = await apiService.getData();
      if (response.success) {
        setData(response.data.data || []);
      } else {
        setErrors(prev => ({ ...prev, data: response.message || 'Failed to load data' }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
      setErrors(prev => ({ ...prev, data: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, data: false }));
    }
  }, []);

  const loadQRCodes = useCallback(async () => {
    setLoading(prev => ({ ...prev, qrCodes: true }));
    setErrors(prev => ({ ...prev, qrCodes: null }));
    
    try {
      const response = await apiService.getQRCodes();
      if (response.success) {
        setQrCodes(response.data.data || []);
      } else {
        setErrors(prev => ({ ...prev, qrCodes: response.message || 'Failed to load QR codes' }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load QR codes';
      setErrors(prev => ({ ...prev, qrCodes: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, qrCodes: false }));
    }
  }, []);

  // Load team members
  const loadTeamMembers = useCallback(async (teamId: number = 1) => {
    setLoading(prev => ({ ...prev, teamMembers: true }));
    setErrors(prev => ({ ...prev, teamMembers: null }));
    
    try {
      const response = await apiService.getTeamMembers(teamId);
      if (response.success) {
        setTeamMembers(response.data.data || []);
      } else {
        setErrors(prev => ({ ...prev, teamMembers: response.message || 'Failed to load team members' }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load team members';
      setErrors(prev => ({ ...prev, teamMembers: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, teamMembers: false }));
    }
  }, []);

  // Load dashboard stats
  const loadDashboardStats = useCallback(async () => {
    setLoading(prev => ({ ...prev, dashboard: true }));
    setErrors(prev => ({ ...prev, dashboard: null }));
    
    try {
      const response = await apiService.getDashboardStats();
      if (response.success) {
        setDashboardStats(response.data);
      } else {
        setErrors(prev => ({ ...prev, dashboard: response.message || 'Failed to load dashboard stats' }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard stats';
      setErrors(prev => ({ ...prev, dashboard: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
  }, []);

  // Create link
  const createLink = useCallback(async (linkData: {
    title?: string;
    url?: string;
    location_url: string;
    type?: string;
    description?: string;
    [key: string]: any;
  }): Promise<boolean> => {
    try {
      const response = await apiService.createLink({
        url: linkData.url,
        location_url: linkData.location_url,
        type: linkData.type || 'link',
        ...linkData
      });
      if (response.success) {
        // Refresh links to get the updated list
        await loadLinks();
        toast({
          title: "Success",
          description: "Link created successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create link",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create link';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadLinks]);

  // Update link
  const updateLink = useCallback(async (id: string, updates: {
    title?: string;
    url?: string;
    location_url?: string;
    type?: string;
    description?: string;
    [key: string]: any;
  }): Promise<boolean> => {
    try {
      const response = await apiService.updateLink(parseInt(id), updates);
      if (response.success) {
        // Refresh links to get the updated list
        await loadLinks();
        toast({
          title: "Success",
          description: "Link updated successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update link",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update link';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadLinks]);

  // Delete link
  const deleteLink = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await apiService.deleteLink(parseInt(id));
      if (response.success) {
        // Refresh links to get the updated list
        await loadLinks();
        toast({
          title: "Success",
          description: "Link deleted successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete link",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete link';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadLinks]);

  // Search links
  const searchLinks = useCallback(async (query: string): Promise<Link[]> => {
    try {
      const response = await apiService.searchLinks(query);
      if (response.success) {
        return response.data;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to search links",
          variant: "destructive",
        });
        return [];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search links';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  // Get links by type
  const getLinksByType = useCallback(async (type: string): Promise<Link[]> => {
    try {
      const response = await apiService.getLinksByType(type);
      if (response.success) {
        return response.data;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to get links by type",
          variant: "destructive",
        });
        return [];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get links by type';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  // Export links
  const exportLinks = useCallback(async (format: 'json' | 'csv' | 'xlsx'): Promise<boolean> => {
    try {
      const response = await apiService.exportLinks(format);
      if (response.success) {
        // Create download link
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `links.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Success",
          description: `Links exported as ${format.toUpperCase()}`,
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to export links",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export links';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Get link statistics
  const getLinkStatistics = useCallback(async (linkId: number, params: {
    start_date: string;
    end_date: string;
    type?: string;
    country_code?: string;
    utm_source?: string;
    utm_medium?: string;
    referrer_host?: string;
  }): Promise<LinkStatistics[]> => {
    setLoading(prev => ({ ...prev, statistics: true }));
    setErrors(prev => ({ ...prev, statistics: null }));
    
    try {
      const response = await apiService.getLinkStatistics(linkId, params);
      if (response.success) {
        setLinkStatistics(response.data);
        return response.data;
      } else {
        setErrors(prev => ({ ...prev, statistics: response.message || 'Failed to load statistics' }));
        toast({
          title: "Error",
          description: response.message || "Failed to load statistics",
          variant: "destructive",
        });
        return [];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load statistics';
      setErrors(prev => ({ ...prev, statistics: errorMessage }));
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(prev => ({ ...prev, statistics: false }));
    }
  }, [toast]);

  // Project management functions
  const createProject = useCallback(async (projectData: {
    name: string;
    color?: string;
  }): Promise<boolean> => {
    try {
      const response = await apiService.createProject(projectData);
      if (response.success) {
        await loadProjects();
        toast({
          title: "Success",
          description: "Project created successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create project",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadProjects]);

  const updateProject = useCallback(async (id: number, updates: {
    name?: string;
    color?: string;
  }): Promise<boolean> => {
    try {
      const response = await apiService.updateProject(id, updates);
      if (response.success) {
        await loadProjects();
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update project",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadProjects]);

  const deleteProject = useCallback(async (id: number): Promise<boolean> => {
    try {
      const response = await apiService.deleteProject(id);
      if (response.success) {
        await loadProjects();
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete project",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadProjects]);

  // Team management functions
  const createTeam = useCallback(async (name: string): Promise<boolean> => {
    try {
      const response = await apiService.createTeam({ name });
      if (response.success) {
        await loadTeams();
        toast({
          title: "Success",
          description: "Team created successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create team",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create team';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadTeams]);

  const updateTeam = useCallback(async (id: number, updates: {
    name?: string;
  }): Promise<boolean> => {
    try {
      const response = await apiService.updateTeam(id, updates);
      if (response.success) {
        await loadTeams();
        toast({
          title: "Success",
          description: "Team updated successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update team",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update team';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadTeams]);

  const deleteTeam = useCallback(async (id: number): Promise<boolean> => {
    try {
      const response = await apiService.deleteTeam(id);
      if (response.success) {
        await loadTeams();
        toast({
          title: "Success",
          description: "Team deleted successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete team",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete team';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadTeams]);

  // Domain management functions
  const createDomain = useCallback(async (host: string, customIndexUrl?: string, customNotFoundUrl?: string): Promise<boolean> => {
    try {
      const response = await apiService.createDomain({ 
        host, 
        custom_index_url: customIndexUrl, 
        custom_not_found_url: customNotFoundUrl 
      });
      if (response.success) {
        await loadDomains();
        toast({
          title: "Success",
          description: "Domain created successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create domain",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create domain';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadDomains]);

  const updateDomain = useCallback(async (id: number, updates: { 
    host?: string; 
    custom_index_url?: string; 
    custom_not_found_url?: string 
  }): Promise<boolean> => {
    try {
      const response = await apiService.updateDomain(id, updates);
      if (response.success) {
        await loadDomains();
        toast({
          title: "Success",
          description: "Domain updated successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update domain",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update domain';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadDomains]);

  const deleteDomain = useCallback(async (id: number): Promise<boolean> => {
    try {
      const response = await apiService.deleteDomain(id);
      if (response.success) {
        await loadDomains();
        toast({
          title: "Success",
          description: "Domain deleted successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete domain",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete domain';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadDomains]);

  // Data management functions
  const deleteDatum = useCallback(async (id: number): Promise<boolean> => {
    try {
      const response = await apiService.deleteDatum(id);
      if (response.success) {
        await loadData();
        toast({
          title: "Success",
          description: "Data entry deleted successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete data entry",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete data entry';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadData]);

  const createQRCode = useCallback(async (data: any): Promise<boolean> => {
    try {
      const response = await apiService.createQRCode(data);
      if (response.success) {
        await loadQRCodes();
        toast({
          title: "Success",
          description: "QR code created successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create QR code",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create QR code';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadQRCodes]);

  const updateQRCode = useCallback(async (id: number, data: any): Promise<boolean> => {
    try {
      const response = await apiService.updateQRCode(id, data);
      if (response.success) {
        await loadQRCodes();
        toast({
          title: "Success",
          description: "QR code updated successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update QR code",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update QR code';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadQRCodes]);

  const deleteQRCode = useCallback(async (id: number): Promise<boolean> => {
    try {
      const response = await apiService.deleteQRCode(id);
      if (response.success) {
        await loadQRCodes();
        toast({
          title: "Success",
          description: "QR code deleted successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete QR code",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete QR code';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadQRCodes]);

  // Team member management functions
  const createTeamMember = useCallback(async (teamId: number, userEmail: string, access?: string[]): Promise<boolean> => {
    try {
      const response = await apiService.createTeamMember({
        team_id: teamId,
        user_email: userEmail,
        access: access
      });
      if (response.success) {
        await loadTeamMembers(teamId);
        await loadTeams(); // Refresh teams to update member counts
        toast({
          title: "Success",
          description: "Team member added successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to add team member",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add team member';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadTeamMembers, loadTeams]);

  const updateTeamMember = useCallback(async (id: number, updates: {
    access?: string[];
  }): Promise<boolean> => {
    try {
      const response = await apiService.updateTeamMember(id, updates);
      if (response.success) {
        await loadTeamMembers();
        toast({
          title: "Success",
          description: "Team member updated successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update team member",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update team member';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadTeamMembers]);

  const deleteTeamMember = useCallback(async (id: number): Promise<boolean> => {
    try {
      const response = await apiService.deleteTeamMember(id);
      if (response.success) {
        await loadTeamMembers();
        toast({
          title: "Success",
          description: "Team member removed successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to remove team member",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove team member';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadTeamMembers]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      loadLinks(),
      loadAnalytics(),
      loadProfile(),
      loadUser(),
      loadProjects(),
      loadPayments(),
      loadLogs(),
      loadTeams(),
      loadTeamMembers(),
      loadDomains(),
      loadData(),
      loadQRCodes(),
      loadDashboardStats(),
    ]);
  }, [loadLinks, loadAnalytics, loadProfile, loadUser, loadProjects, loadPayments, loadLogs, loadTeams, loadTeamMembers, loadDomains, loadData, loadQRCodes, loadDashboardStats]);

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    // Data
    links,
    analytics,
    profile,
    user,
    projects,
    payments,
    logs,
    teams,
    teamMembers,
    domains,
    data,
    qrCodes,
    linkStatistics,
    dashboardStats,
    
    // Loading states
    loading,
    
    // Error states
    errors,
    
    // Actions
    createLink,
    updateLink,
    deleteLink,
    refreshData,
    searchLinks,
    getLinksByType,
    exportLinks,
    getLinkStatistics,
    createProject,
    updateProject,
    deleteProject,
    createTeam,
    updateTeam,
    deleteTeam,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    createDomain,
    updateDomain,
    deleteDomain,
    deleteDatum,
    createQRCode,
    updateQRCode,
    deleteQRCode
  };
};
