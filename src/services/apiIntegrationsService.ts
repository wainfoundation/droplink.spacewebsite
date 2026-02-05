import { supabase } from '@/integrations/supabase/client';

export interface APIKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  permissions: string[];
  isActive: boolean;
  lastUsed?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Webhook {
  id: string;
  userId: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  payload: any;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  responseCode?: number;
  responseBody?: string;
  attempts: number;
  nextRetryAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface ThirdPartyIntegration {
  id: string;
  userId: string;
  platform: string;
  config: any;
  isActive: boolean;
  lastSync?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ZapierConnection {
  id: string;
  userId: string;
  zapId: string;
  trigger: string;
  action: string;
  config: any;
  isActive: boolean;
  lastTriggered?: string;
  createdAt: string;
  updatedAt: string;
}

class APIIntegrationsService {
  private static instance: APIIntegrationsService;

  public static getInstance(): APIIntegrationsService {
    if (!APIIntegrationsService.instance) {
      APIIntegrationsService.instance = new APIIntegrationsService();
    }
    return APIIntegrationsService.instance;
  }

  // API Key Management
  public async createAPIKey(
    userId: string,
    name: string,
    permissions: string[],
    expiresAt?: string
  ): Promise<{ success: boolean; data?: APIKey; error?: string }> {
    try {
      const key = this.generateAPIKey();
      
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: userId,
          name,
          key,
          permissions,
          is_active: true,
          expires_at: expiresAt,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as APIKey };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getAPIKeys(userId: string): Promise<{ success: boolean; data?: APIKey[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as APIKey[] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async revokeAPIKey(apiKeyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', apiKeyId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async validateAPIKey(apiKey: string): Promise<{ success: boolean; data?: APIKey; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key', apiKey)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return { success: false, error: 'Invalid API key' };
      }

      // Check expiration
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return { success: false, error: 'API key has expired' };
      }

      // Update last used
      await supabase
        .from('api_keys')
        .update({ 
          last_used: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);

      return { success: true, data: data as APIKey };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Webhook Management
  public async createWebhook(
    userId: string,
    name: string,
    url: string,
    events: string[],
    maxRetries: number = 3
  ): Promise<{ success: boolean; data?: Webhook; error?: string }> {
    try {
      const secret = this.generateWebhookSecret();
      
      const { data, error } = await supabase
        .from('webhooks')
        .insert({
          user_id: userId,
          name,
          url,
          events,
          secret,
          is_active: true,
          retry_count: 0,
          max_retries: maxRetries,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as Webhook };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getWebhooks(userId: string): Promise<{ success: boolean; data?: Webhook[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as Webhook[] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async triggerWebhook(
    webhookId: string,
    event: string,
    payload: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: webhook, error: webhookError } = await supabase
        .from('webhooks')
        .select('*')
        .eq('id', webhookId)
        .eq('is_active', true)
        .single();

      if (webhookError || !webhook) {
        return { success: false, error: 'Webhook not found or inactive' };
      }

      if (!webhook.events.includes(event)) {
        return { success: false, error: 'Event not configured for this webhook' };
      }

      // Create webhook delivery record
      const { data: delivery, error: deliveryError } = await supabase
        .from('webhook_deliveries')
        .insert({
          webhook_id: webhookId,
          event,
          payload,
          status: 'pending',
          attempts: 0,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (deliveryError) {
        return { success: false, error: deliveryError.message };
      }

      // Process webhook delivery asynchronously
      this.processWebhookDelivery(delivery.id, webhook.url, webhook.secret, event, payload);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private async processWebhookDelivery(
    deliveryId: string,
    url: string,
    secret: string,
    event: string,
    payload: any
  ): Promise<void> {
    try {
      const signature = this.generateWebhookSignature(JSON.stringify(payload), secret);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Event': event,
          'X-Webhook-Signature': signature,
          'X-Webhook-Timestamp': Date.now().toString()
        },
        body: JSON.stringify(payload)
      });

      const responseBody = await response.text();

      // Update delivery status
      await supabase
        .from('webhook_deliveries')
        .update({
          status: response.ok ? 'delivered' : 'failed',
          response_code: response.status,
          response_body: responseBody,
          delivered_at: new Date().toISOString(),
          attempts: supabase.raw('attempts + 1')
        })
        .eq('id', deliveryId);

      // Update webhook retry count
      if (response.ok) {
        await supabase
          .from('webhooks')
          .update({ retry_count: 0 })
          .eq('id', deliveryId);
      } else {
        await supabase
          .from('webhooks')
          .update({ retry_count: supabase.raw('retry_count + 1') })
          .eq('id', deliveryId);
      }
    } catch (error) {
      // Mark as failed and schedule retry if within limits
      await supabase
        .from('webhook_deliveries')
        .update({
          status: 'failed',
          attempts: supabase.raw('attempts + 1'),
          next_retry_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
        })
        .eq('id', deliveryId);
    }
  }

  // Third-party Integrations
  public async createIntegration(
    userId: string,
    platform: string,
    config: any
  ): Promise<{ success: boolean; data?: ThirdPartyIntegration; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('third_party_integrations')
        .insert({
          user_id: userId,
          platform,
          config,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as ThirdPartyIntegration };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getIntegrations(userId: string): Promise<{ success: boolean; data?: ThirdPartyIntegration[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('third_party_integrations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as ThirdPartyIntegration[] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Zapier Integration
  public async createZapierConnection(
    userId: string,
    zapId: string,
    trigger: string,
    action: string,
    config: any
  ): Promise<{ success: boolean; data?: ZapierConnection; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('zapier_connections')
        .insert({
          user_id: userId,
          zap_id: zapId,
          trigger,
          action,
          config,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as ZapierConnection };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getZapierConnections(userId: string): Promise<{ success: boolean; data?: ZapierConnection[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('zapier_connections')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as ZapierConnection[] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // API Endpoints
  public async getLinks(apiKey: string, filters?: any): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const { success, data: keyData, error: keyError } = await this.validateAPIKey(apiKey);
      
      if (!success || !keyData) {
        return { success: false, error: keyError };
      }

      if (!keyData.permissions.includes('links:read')) {
        return { success: false, error: 'Insufficient permissions' };
      }

      let query = supabase
        .from('links')
        .select('*')
        .eq('user_id', keyData.user_id);

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async createLink(apiKey: string, linkData: any): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { success, data: keyData, error: keyError } = await this.validateAPIKey(apiKey);
      
      if (!success || !keyData) {
        return { success: false, error: keyError };
      }

      if (!keyData.permissions.includes('links:write')) {
        return { success: false, error: 'Insufficient permissions' };
      }

      const { data, error } = await supabase
        .from('links')
        .insert({
          user_id: keyData.user_id,
          ...linkData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async updateLink(apiKey: string, linkId: string, updates: any): Promise<{ success: boolean; error?: string }> {
    try {
      const { success, data: keyData, error: keyError } = await this.validateAPIKey(apiKey);
      
      if (!success || !keyData) {
        return { success: false, error: keyError };
      }

      if (!keyData.permissions.includes('links:write')) {
        return { success: false, error: 'Insufficient permissions' };
      }

      const { error } = await supabase
        .from('links')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', linkId)
        .eq('user_id', keyData.user_id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async deleteLink(apiKey: string, linkId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { success, data: keyData, error: keyError } = await this.validateAPIKey(apiKey);
      
      if (!success || !keyData) {
        return { success: false, error: keyError };
      }

      if (!keyData.permissions.includes('links:delete')) {
        return { success: false, error: 'Insufficient permissions' };
      }

      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId)
        .eq('user_id', keyData.user_id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Helper Methods
  private generateAPIKey(): string {
    const prefix = 'dp_';
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const base64 = btoa(String.fromCharCode(...randomBytes));
    return prefix + base64.replace(/[+/=]/g, '').substring(0, 40);
  }

  private generateWebhookSecret(): string {
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    return btoa(String.fromCharCode(...randomBytes));
  }

  private generateWebhookSignature(payload: string, secret: string): string {
    // This would use HMAC-SHA256 in a real implementation
    return `sha256=${btoa(payload + secret)}`;
  }
}

export const apiIntegrationsService = APIIntegrationsService.getInstance();
