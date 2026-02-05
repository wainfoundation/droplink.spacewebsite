// API Service for Droplink Dashboard
const API_BASE_URL = 'https://linkrme.com/api';
const API_KEY = '68dbcc8e08c3d9f1f5956e5118c55e9c';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface Link {
  id: number;
  project_id: number | null;
  domain_id: number;
  type: string;
  url: string;
  location_url: string;
  settings: {
    password: string | null;
    sensitive_content: boolean;
  };
  clicks: number;
  order: number;
  start_date: string | null;
  end_date: string | null;
  datetime: string;
}

interface Analytics {
  totalClicks: number;
  totalViews: number;
  clickRate: number;
  topLink: Link | null;
  dailyClicks: Array<{ date: string; clicks: number }>;
  topCountries: Array<{ country: string; clicks: number }>;
  topDevices: Array<{ device: string; clicks: number }>;
}

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  email: string;
  createdAt: string;
}

interface User {
  id: string;
  type: string;
  email: string;
  billing: {
    type: string;
    name: string;
    address: string;
    city: string;
    county: string;
    zip: string;
    country: string;
    phone: string;
    tax_id: string;
    is_enabled: boolean;
    plan_id: string;
    plan_expiration_date: string;
    plan_settings: any;
    plan_trial_done: boolean;
    language: string;
    timezone: string;
    country_code: string | null;
    datetime: string;
    last_activity: string;
    total_logins: number;
  };
}

interface Project {
  id: number;
  name: string;
  color: string;
  last_datetime: string | null;
  datetime: string;
}

interface Payment {
  id: number;
  plan_id: number;
  processor: string;
  type: string;
  frequency: string;
  email: string;
  name: string | null;
  total_amount: string;
  currency: string;
  status: boolean;
  datetime: string;
}

interface Log {
  type: string;
  ip: string;
  device_type: string;
  continent_code: string;
  country_code: string;
  city_name: string;
  datetime: string;
}

interface TeamMember {
  team_member_id: number;
  user_email: string;
  access: {
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  status: number;
  datetime: string;
  last_datetime: string | null;
}

interface Domain {
  id: number;
  scheme: string;
  host: string;
  custom_index_url: string;
  custom_not_found_url?: string;
  is_enabled: boolean;
  last_datetime: string | null;
  datetime: string;
}

interface Data {
  id: number;
  biolink_block_id: number;
  link_id: number;
  project_id: number;
  type: string;
  data: {
    email?: string;
    name?: string;
    [key: string]: any;
  };
  datetime: string;
}

interface QRCode {
  id: number;
  type: string;
  name: string;
  qr_code: string;
  qr_code_logo: string | null;
  qr_code_background: string | null;
  settings: {
    foreground_type: string;
    foreground_color: string;
    background_color: string;
    custom_eyes_color: boolean;
    qr_code_logo_size: number;
    size: number;
    margin: number;
    ecc: string;
    url?: string;
    text?: string;
    phone?: string;
    sms?: string;
    email?: string;
    whatsapp?: string;
    facetime?: string;
    location?: string;
    wifi?: string;
    event?: string;
    vcard?: string;
    crypto?: string;
    paypal?: string;
    upi?: string;
    epc?: string;
    pix?: string;
    [key: string]: any;
  };
  embedded_data: string;
  last_datetime: string | null;
  datetime: string;
}

interface SplashPage {
  id: number;
  name: string;
  title?: string;
  logo?: string;
  favicon?: string;
  opengraph?: string;
  description?: string;
  secondary_button_name?: string;
  secondary_button_url?: string;
  custom_css?: string;
  custom_js?: string;
  ads_header?: string;
  ads_footer?: string;
  link_unlock_seconds?: number;
  auto_redirect?: boolean;
  last_datetime: string | null;
  datetime: string;
}

interface Team {
  id: number;
  name: string;
  team_members: TeamMember[];
  last_datetime: string | null;
  datetime: string;
}

class ApiService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.apiKey = API_KEY;
  }

  private createFormData(data: Record<string, any>): FormData {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              Object.entries(item).forEach(([subKey, subValue]) => {
                formData.append(`${key}[${index}][${subKey}]`, String(subValue));
              });
            } else {
              formData.append(`${key}[${index}]`, String(item));
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            formData.append(`${key}[${subKey}]`, String(subValue));
          });
        } else {
          formData.append(key, String(value));
        }
      }
    });
    
    return formData;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
    };

    // Only add Content-Type for JSON, not for FormData
    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        data,
        success: true,
      };
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        data: null as T,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Links API
  async getLinks(page: number = 1, resultsPerPage: number = 25): Promise<ApiResponse<{ data: Link[], meta: any, links: any }>> {
    return this.request<{ data: Link[], meta: any, links: any }>(`/links?page=${page}&results_per_page=${resultsPerPage}`);
  }

  async getLink(id: number): Promise<ApiResponse<Link>> {
    return this.request<Link>(`/links/${id}`);
  }

  async createLink(data: {
    url?: string;
    location_url: string;
    type?: string;
    domain_id?: number;
    project_id?: number;
    pixels_ids?: number[];
    email_reports?: any[];
    schedule?: boolean;
    start_date?: string;
    end_date?: string;
    clicks_limit?: number;
    expiration_url?: string;
    sensitive_content?: boolean;
    http_status_code?: number;
    app_linking_is_enabled?: boolean;
    cloaking_is_enabled?: boolean;
    cloaking_title?: string;
    cloaking_meta_description?: string;
    cloaking_custom_js?: string;
    password?: string;
    forward_query_parameters_is_enabled?: boolean;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    targeting_type?: string;
    [key: string]: any;
  }): Promise<ApiResponse<{ id: number }>> {
    return this.request<{ id: number }>('/links', {
      method: 'POST',
      body: this.createFormData(data),
    });
  }

  async updateLink(id: number, data: {
    location_url?: string;
    url?: string;
    domain_id?: number;
    project_id?: number;
    pixels_ids?: number[];
    email_reports?: any[];
    schedule?: boolean;
    start_date?: string;
    end_date?: string;
    clicks_limit?: number;
    expiration_url?: string;
    sensitive_content?: boolean;
    http_status_code?: number;
    app_linking_is_enabled?: boolean;
    cloaking_is_enabled?: boolean;
    cloaking_title?: string;
    cloaking_meta_description?: string;
    cloaking_custom_js?: string;
    password?: string;
    forward_query_parameters_is_enabled?: boolean;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    targeting_type?: string;
    [key: string]: any;
  }): Promise<ApiResponse<{ id: number }>> {
    return this.request<{ id: number }>(`/links/${id}`, {
      method: 'POST',
      body: this.createFormData(data),
    });
  }

  async deleteLink(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/links/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics API
  async getAnalytics(): Promise<ApiResponse<Analytics>> {
    return this.request<Analytics>('/analytics');
  }

  async getLinkAnalytics(linkId: string): Promise<ApiResponse<Analytics>> {
    return this.request<Analytics>(`/analytics/links/${linkId}`);
  }

  // Statistics API
  async getLinkStatistics(linkId: number, params: {
    start_date: string;
    end_date: string;
    type?: string;
    country_code?: string;
    utm_source?: string;
    utm_medium?: string;
    referrer_host?: string;
  }): Promise<ApiResponse<Array<{
    pageviews: number;
    visitors: number;
    formatted_date: string;
  }>>> {
    const queryParams = new URLSearchParams();
    queryParams.append('start_date', params.start_date);
    queryParams.append('end_date', params.end_date);
    
    if (params.type) queryParams.append('type', params.type);
    if (params.country_code) queryParams.append('country_code', params.country_code);
    if (params.utm_source) queryParams.append('utm_source', params.utm_source);
    if (params.utm_medium) queryParams.append('utm_medium', params.utm_medium);
    if (params.referrer_host) queryParams.append('referrer_host', params.referrer_host);

    return this.request<Array<{
      pageviews: number;
      visitors: number;
      formatted_date: string;
    }>>(`/statistics/${linkId}?${queryParams.toString()}`);
  }

  // User API
  async getUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/user');
  }

  // Projects API
  async getProjects(page: number = 1, resultsPerPage: number = 25): Promise<ApiResponse<{ data: Project[], meta: any, links: any }>> {
    return this.request<{ data: Project[], meta: any, links: any }>(`/projects?page=${page}&results_per_page=${resultsPerPage}`);
  }

  async getProject(id: number): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/projects/${id}`);
  }

  async createProject(data: {
    name: string;
    color?: string;
  }): Promise<ApiResponse<{ id: number }>> {
    return this.request<{ id: number }>('/projects', {
      method: 'POST',
      body: this.createFormData(data),
    });
  }

  async updateProject(id: number, data: {
    name?: string;
    color?: string;
  }): Promise<ApiResponse<{ id: number }>> {
    return this.request<{ id: number }>(`/projects/${id}`, {
      method: 'POST',
      body: this.createFormData(data),
    });
  }

  async deleteProject(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Payments API
  async getPayments(page: number = 1, resultsPerPage: number = 25): Promise<ApiResponse<{ data: Payment[], meta: any, links: any }>> {
    return this.request<{ data: Payment[], meta: any, links: any }>(`/payments?page=${page}&results_per_page=${resultsPerPage}`);
  }

  async getPayment(id: number): Promise<ApiResponse<Payment>> {
    return this.request<Payment>(`/payments/${id}`);
  }

  // Logs API
  async getLogs(page: number = 1, resultsPerPage: number = 25): Promise<ApiResponse<{ data: Log[], meta: any, links: any }>> {
    return this.request<{ data: Log[], meta: any, links: any }>(`/logs?page=${page}&results_per_page=${resultsPerPage}`);
  }

  // Teams API
  async getTeams(page: number = 1, resultsPerPage: number = 25): Promise<ApiResponse<{ data: Team[], meta: any, links: any }>> {
    return this.request<{ data: Team[], meta: any, links: any }>(`/teams?page=${page}&results_per_page=${resultsPerPage}`);
  }

  async getTeam(id: number): Promise<ApiResponse<Team>> {
    return this.request<Team>(`/teams/${id}`);
  }

  async createTeam(data: {
    name: string;
  }): Promise<ApiResponse<{ id: number }>> {
    return this.request<{ id: number }>('/teams', {
      method: 'POST',
      body: this.createFormData(data),
    });
  }

  async updateTeam(id: number, data: {
    name?: string;
  }): Promise<ApiResponse<{ id: number }>> {
    return this.request<{ id: number }>(`/teams/${id}`, {
      method: 'POST',
      body: this.createFormData(data),
    });
  }

  async deleteTeam(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/teams/${id}`, {
      method: 'DELETE',
    });
  }

  // Domain management methods
  async getDomains(page: number = 1, resultsPerPage: number = 25): Promise<ApiResponse<{ data: Domain[], meta: any, links: any }>> {
    return this.request<{ data: Domain[], meta: any, links: any }>(`/domains?page=${page}&results_per_page=${resultsPerPage}`);
  }

  async getDomain(id: number): Promise<ApiResponse<Domain>> {
    return this.request<Domain>(`/domains/${id}`);
  }

  async createDomain(data: {
    host: string;
    custom_index_url?: string;
    custom_not_found_url?: string;
  }): Promise<ApiResponse<{ id: number }>> {
    return this.request<{ id: number }>('/domains', {
      method: 'POST',
      body: this.createFormData(data),
    });
  }

  async updateDomain(id: number, data: {
    host?: string;
    custom_index_url?: string;
    custom_not_found_url?: string;
  }): Promise<ApiResponse<{ id: number }>> {
    return this.request<{ id: number }>(`/domains/${id}`, {
      method: 'POST',
      body: this.createFormData(data),
    });
  }

  async deleteDomain(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/domains/${id}`, {
      method: 'DELETE',
    });
  }

  // Data management methods
  async getData(page: number = 1, resultsPerPage: number = 25): Promise<ApiResponse<{ data: Data[], meta: any, links: any }>> {
    return this.request<{ data: Data[], meta: any, links: any }>(`/data?page=${page}&results_per_page=${resultsPerPage}`);
  }

  async getDatum(id: number): Promise<ApiResponse<Data>> {
    return this.request<Data>(`/data/${id}`);
  }

  async deleteDatum(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/data/${id}`, {
      method: 'DELETE',
    });
  }

  // QR Code management methods
  async getQRCodes(page: number = 1, resultsPerPage: number = 25): Promise<ApiResponse<{ data: QRCode[], meta: any, links: any }>> {
    return this.request<{ data: QRCode[], meta: any, links: any }>(`/qr-codes?page=${page}&results_per_page=${resultsPerPage}`);
  }

  async getQRCode(id: number): Promise<ApiResponse<QRCode>> {
    return this.request<QRCode>(`/qr-codes/${id}`);
  }

  async createQRCode(data: {
    project_id?: number;
    name: string;
    type: string;
    is_bulk?: boolean;
    style?: string;
    inner_eye_style?: string;
    outer_eye_style?: string;
    foreground_type?: string;
    foreground_color?: string;
    foreground_gradient_style?: string;
    foreground_gradient_one?: string;
    foreground_gradient_two?: string;
    background_color?: string;
    background_color_transparency?: number;
    custom_eyes_color?: boolean;
    eyes_inner_color?: string;
    eyes_outer_color?: string;
    qr_code_logo?: File;
    qr_code_logo_size?: number;
    qr_code_background?: File;
    qr_code_background_transparency?: number;
    qr_code_foreground?: File;
    qr_code_foreground_transparency?: number;
    frame?: string;
    frame_text?: string;
    frame_text_size?: number;
    frame_text_font?: string;
    frame_custom_colors?: boolean;
    frame_color?: string;
    frame_text_color?: string;
    size?: number;
    margin?: number;
    ecc?: string;
    text?: string;
    url?: string;
    phone?: string;
    sms?: string;
    email?: string;
    whatsapp?: string;
    facetime?: string;
    location?: string;
    wifi?: string;
    event?: string;
    vcard?: string;
    crypto?: string;
    paypal?: string;
    upi?: string;
    epc?: string;
    pix?: string;
  }): Promise<ApiResponse<{ id: number }>> {
    return this.request<{ id: number }>('/qr-codes', {
      method: 'POST',
      body: this.createFormData(data),
    });
  }

  async updateQRCode(id: number, data: {
    project_id?: string;
    name?: string;
    type?: string;
    style?: string;
    inner_eye_style?: string;
    outer_eye_style?: string;
    foreground_type?: string;
    foreground_color?: string;
    foreground_gradient_style?: string;
    foreground_gradient_one?: string;
    foreground_gradient_two?: string;
    background_color?: string;
    background_color_transparency?: number;
    custom_eyes_color?: boolean;
    eyes_inner_color?: string;
    eyes_outer_color?: string;
    qr_code_logo?: File;
    qr_code_logo_size?: number;
    qr_code_background?: File;
    qr_code_background_transparency?: number;
    qr_code_foreground?: File;
    qr_code_foreground_transparency?: number;
    frame?: string;
    frame_text?: string;
    frame_text_size?: number;
    frame_text_font?: string;
    frame_custom_colors?: boolean;
    frame_color?: string;
    frame_text_color?: string;
    size?: number;
    margin?: number;
    ecc?: string;
    text?: string;
    url?: string;
    phone?: string;
    sms?: string;
    email?: string;
    whatsapp?: string;
    facetime?: string;
    location?: string;
    wifi?: string;
    event?: string;
    vcard?: string;
    crypto?: string;
    paypal?: string;
    upi?: string;
    epc?: string;
    pix?: string;
  }): Promise<ApiResponse<{ id: number }>> {
    return this.request<{ id: number }>(`/qr-codes/${id}`, {
      method: 'POST',
      body: this.createFormData(data),
    });
  }

  async deleteQRCode(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/qr-codes/${id}`, {
      method: 'DELETE',
    });
  }

  // Splash Pages API methods
  async getSplashPages(page: number = 1, resultsPerPage: number = 25): Promise<ApiResponse<{ data: SplashPage[], meta: any, links: any }>> {
    return this.request<{ data: SplashPage[], meta: any, links: any }>(`/splash-pages?page=${page}&results_per_page=${resultsPerPage}`);
  }

  async getSplashPage(id: number): Promise<ApiResponse<SplashPage>> {
    return this.request<SplashPage>(`/splash-pages/${id}`);
  }

  async createSplashPage(data: {
    name: string;
    title?: string;
    logo?: File;
    favicon?: File;
    opengraph?: File;
    description?: string;
    secondary_button_name?: string;
    secondary_button_url?: string;
    custom_css?: string;
    custom_js?: string;
    ads_header?: string;
    ads_footer?: string;
    link_unlock_seconds?: number;
    auto_redirect?: boolean;
  }): Promise<ApiResponse<{ id: number }>> {
    return this.request<{ id: number }>('/splash-pages', {
      method: 'POST',
      body: this.createFormData(data),
    });
  }

  async updateSplashPage(id: number, data: {
    name?: string;
    title?: string;
    logo?: File;
    favicon?: File;
    opengraph?: File;
    description?: string;
    secondary_button_name?: string;
    secondary_button_url?: string;
    custom_css?: string;
    custom_js?: string;
    ads_header?: string;
    ads_footer?: string;
    link_unlock_seconds?: number;
    auto_redirect?: boolean;
  }): Promise<ApiResponse<{ id: number }>> {
    return this.request<{ id: number }>(`/splash-pages/${id}`, {
      method: 'POST',
      body: this.createFormData(data),
    });
  }

  async deleteSplashPage(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/splash-pages/${id}`, {
      method: 'DELETE',
    });
  }

  // Teams Member API
  async getTeamMembers(teamId: number): Promise<ApiResponse<{ data: TeamMember[] }>> {
    return this.request<{ data: TeamMember[] }>(`/team-members/${teamId}`);
  }

  async createTeamMember(data: {
    team_id: number;
    user_email: string;
    access?: string[];
  }): Promise<ApiResponse<{ id: number }>> {
    return this.request<{ id: number }>('/team-members', {
      method: 'POST',
      body: this.createFormData(data),
    });
  }

  async updateTeamMember(id: number, data: {
    access?: string[];
  }): Promise<ApiResponse<{ id: number }>> {
    return this.request<{ id: number }>(`/team-members/${id}`, {
      method: 'POST',
      body: this.createFormData(data),
    });
  }

  async deleteTeamMember(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/team-members/${id}`, {
      method: 'DELETE',
    });
  }

  // Profile API
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/profile');
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Dashboard Stats API
  async getDashboardStats(): Promise<ApiResponse<{
    totalLinks: number;
    totalClicks: number;
    totalViews: number;
    clickRate: number;
    topLink: Link | null;
    recentActivity: Link[];
  }>> {
    return this.request('/dashboard/stats');
  }

  // Link Types API
  async getLinkTypes(): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
  }>>> {
    return this.request('/link-types');
  }

  // Search and Filter API
  async searchLinks(query: string): Promise<ApiResponse<Link[]>> {
    return this.request<Link[]>(`/links/search?q=${encodeURIComponent(query)}`);
  }

  async getLinksByType(type: string): Promise<ApiResponse<Link[]>> {
    return this.request<Link[]>(`/links/type/${type}`);
  }

  // Export API
  async exportLinks(format: 'json' | 'csv' | 'xlsx'): Promise<ApiResponse<Blob>> {
    return this.request<Blob>(`/links/export?format=${format}`, {
      headers: {
        'Accept': format === 'json' ? 'application/json' : 
                 format === 'csv' ? 'text/csv' : 
                 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  }

  // Bulk Operations API
  async bulkUpdateLinks(updates: Array<{ id: string; updates: Partial<Link> }>): Promise<ApiResponse<Link[]>> {
    return this.request<Link[]>('/links/bulk-update', {
      method: 'PUT',
      body: JSON.stringify({ updates }),
    });
  }

  async bulkDeleteLinks(ids: string[]): Promise<ApiResponse<void>> {
    return this.request<void>('/links/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;

// Export types for use in components
export type { Link, Analytics, UserProfile, User, Project, Payment, Log, Team, TeamMember, Domain, Data, QRCode, ApiResponse };
