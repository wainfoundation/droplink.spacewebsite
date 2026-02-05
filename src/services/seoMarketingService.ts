import { supabase } from '@/integrations/supabase/client';

export interface SEOConfig {
  id: string;
  userId: string;
  linkId?: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robotsMeta?: string;
  structuredData?: any;
  customMeta?: Array<{
    name: string;
    content: string;
    property?: string;
  }>;
}

export interface UTMParameters {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

export interface QRCodeConfig {
  id: string;
  userId: string;
  linkId: string;
  size: number;
  format: 'png' | 'svg' | 'pdf';
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  foregroundColor: string;
  backgroundColor: string;
  logo?: string;
  logoSize?: number;
  margin: number;
  downloadUrl: string;
  createdAt: string;
}

export interface EmailCaptureForm {
  id: string;
  userId: string;
  linkId?: string;
  title: string;
  description: string;
  fields: Array<{
    id: string;
    type: 'email' | 'name' | 'phone' | 'company' | 'custom';
    label: string;
    placeholder: string;
    required: boolean;
    validation?: {
      pattern?: string;
      minLength?: number;
      maxLength?: number;
    };
  }>;
  submitAction: {
    type: 'email' | 'webhook' | 'database';
    email?: string;
    webhookUrl?: string;
    successMessage: string;
    redirectUrl?: string;
  };
  styling: {
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
    borderRadius: number;
    fontFamily: string;
  };
  isActive: boolean;
  submissions: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeadMagnet {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'ebook' | 'checklist' | 'template' | 'guide' | 'video' | 'course';
  fileUrl?: string;
  downloadUrl?: string;
  thumbnail?: string;
  requiredFields: string[];
  isActive: boolean;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

class SEOMarketingService {
  private static instance: SEOMarketingService;

  public static getInstance(): SEOMarketingService {
    if (!SEOMarketingService.instance) {
      SEOMarketingService.instance = new SEOMarketingService();
    }
    return SEOMarketingService.instance;
  }

  // SEO Methods
  public async createSEOConfig(
    userId: string,
    seoData: Omit<SEOConfig, 'id' | 'userId'>
  ): Promise<{ success: boolean; data?: SEOConfig; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('seo_configs')
        .insert({
          user_id: userId,
          ...seoData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as SEOConfig };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getSEOConfig(
    userId: string,
    linkId?: string
  ): Promise<{ success: boolean; data?: SEOConfig; error?: string }> {
    try {
      let query = supabase
        .from('seo_configs')
        .select('*')
        .eq('user_id', userId);

      if (linkId) {
        query = query.eq('link_id', linkId);
      }

      const { data, error } = await query.single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as SEOConfig };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async updateSEOConfig(
    seoId: string,
    updates: Partial<SEOConfig>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('seo_configs')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', seoId);

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

  public generateMetaTags(seoConfig: SEOConfig): string {
    const tags = [
      `<title>${seoConfig.title}</title>`,
      `<meta name="description" content="${seoConfig.description}">`,
      `<meta name="keywords" content="${seoConfig.keywords.join(', ')}">`,
      seoConfig.canonicalUrl ? `<link rel="canonical" href="${seoConfig.canonicalUrl}">` : '',
      seoConfig.robotsMeta ? `<meta name="robots" content="${seoConfig.robotsMeta}">` : '',
      // Open Graph tags
      `<meta property="og:title" content="${seoConfig.ogTitle || seoConfig.title}">`,
      `<meta property="og:description" content="${seoConfig.ogDescription || seoConfig.description}">`,
      seoConfig.ogImage ? `<meta property="og:image" content="${seoConfig.ogImage}">` : '',
      `<meta property="og:type" content="website">`,
      // Twitter Card tags
      `<meta name="twitter:card" content="${seoConfig.twitterCard || 'summary'}">`,
      `<meta name="twitter:title" content="${seoConfig.twitterTitle || seoConfig.title}">`,
      `<meta name="twitter:description" content="${seoConfig.twitterDescription || seoConfig.description}">`,
      seoConfig.twitterImage ? `<meta name="twitter:image" content="${seoConfig.twitterImage}">` : '',
      // Custom meta tags
      ...(seoConfig.customMeta || []).map(meta => 
        meta.property 
          ? `<meta property="${meta.property}" content="${meta.content}">`
          : `<meta name="${meta.name}" content="${meta.content}">`
      )
    ].filter(tag => tag !== '');

    return tags.join('\n');
  }

  public generateStructuredData(seoConfig: SEOConfig, linkData?: any): string {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": seoConfig.title,
      "description": seoConfig.description,
      "url": seoConfig.canonicalUrl,
      ...(linkData && {
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": linkData.map((link: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": link.title,
            "url": link.url
          }))
        }
      })
    };

    return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
  }

  // UTM Parameter Methods
  public generateUTMUrl(baseUrl: string, utmParams: UTMParameters): string {
    const url = new URL(baseUrl);
    url.searchParams.set('utm_source', utmParams.source);
    url.searchParams.set('utm_medium', utmParams.medium);
    url.searchParams.set('utm_campaign', utmParams.campaign);
    
    if (utmParams.term) {
      url.searchParams.set('utm_term', utmParams.term);
    }
    
    if (utmParams.content) {
      url.searchParams.set('utm_content', utmParams.content);
    }

    return url.toString();
  }

  public extractUTMParameters(url: string): UTMParameters | null {
    const urlObj = new URL(url);
    const source = urlObj.searchParams.get('utm_source');
    const medium = urlObj.searchParams.get('utm_medium');
    const campaign = urlObj.searchParams.get('utm_campaign');

    if (!source || !medium || !campaign) {
      return null;
    }

    return {
      source,
      medium,
      campaign,
      term: urlObj.searchParams.get('utm_term') || undefined,
      content: urlObj.searchParams.get('utm_content') || undefined
    };
  }

  // QR Code Methods
  public async generateQRCode(
    userId: string,
    linkId: string,
    config: Omit<QRCodeConfig, 'id' | 'userId' | 'linkId' | 'downloadUrl' | 'createdAt'>
  ): Promise<{ success: boolean; data?: QRCodeConfig; error?: string }> {
    try {
      // Generate QR code using a QR code library (you'll need to install qrcode)
      const qrCodeData = await this.generateQRCodeData(linkId, config);
      
      const { data, error } = await supabase
        .from('qr_codes')
        .insert({
          user_id: userId,
          link_id: linkId,
          ...config,
          download_url: qrCodeData.downloadUrl,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as QRCodeConfig };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private async generateQRCodeData(linkId: string, config: any): Promise<{ downloadUrl: string }> {
    // This would integrate with a QR code generation service
    // For now, return a placeholder
    return {
      downloadUrl: `https://api.qrserver.com/v1/create-qr-code/?size=${config.size}x${config.size}&data=${encodeURIComponent(window.location.origin + '/link/' + linkId)}`
    };
  }

  public async getQRCodes(userId: string): Promise<{ success: boolean; data?: QRCodeConfig[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as QRCodeConfig[] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Email Capture Methods
  public async createEmailCaptureForm(
    userId: string,
    formData: Omit<EmailCaptureForm, 'id' | 'userId' | 'submissions' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; data?: EmailCaptureForm; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('email_capture_forms')
        .insert({
          user_id: userId,
          ...formData,
          submissions: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as EmailCaptureForm };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async submitEmailCaptureForm(
    formId: string,
    formData: Record<string, any>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Store form submission
      const { error: submissionError } = await supabase
        .from('email_capture_submissions')
        .insert({
          form_id: formId,
          form_data: formData,
          submitted_at: new Date().toISOString()
        });

      if (submissionError) {
        return { success: false, error: submissionError.message };
      }

      // Update form submission count
      const { error: updateError } = await supabase
        .from('email_capture_forms')
        .update({ 
          submissions: supabase.raw('submissions + 1'),
          updated_at: new Date().toISOString()
        })
        .eq('id', formId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getEmailCaptureForms(userId: string): Promise<{ success: boolean; data?: EmailCaptureForm[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('email_capture_forms')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as EmailCaptureForm[] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Lead Magnet Methods
  public async createLeadMagnet(
    userId: string,
    magnetData: Omit<LeadMagnet, 'id' | 'userId' | 'downloads' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; data?: LeadMagnet; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('lead_magnets')
        .insert({
          user_id: userId,
          ...magnetData,
          downloads: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as LeadMagnet };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async downloadLeadMagnet(
    magnetId: string,
    userData: Record<string, any>
  ): Promise<{ success: boolean; downloadUrl?: string; error?: string }> {
    try {
      // Store download data
      const { error: downloadError } = await supabase
        .from('lead_magnet_downloads')
        .insert({
          magnet_id: magnetId,
          user_data: userData,
          downloaded_at: new Date().toISOString()
        });

      if (downloadError) {
        return { success: false, error: downloadError.message };
      }

      // Update download count
      const { error: updateError } = await supabase
        .from('lead_magnets')
        .update({ 
          downloads: supabase.raw('downloads + 1'),
          updated_at: new Date().toISOString()
        })
        .eq('id', magnetId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      // Get download URL
      const { data: magnetData, error: fetchError } = await supabase
        .from('lead_magnets')
        .select('download_url')
        .eq('id', magnetId)
        .single();

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      return { success: true, downloadUrl: magnetData.download_url };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getLeadMagnets(userId: string): Promise<{ success: boolean; data?: LeadMagnet[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('lead_magnets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as LeadMagnet[] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Analytics Integration
  public async integrateGoogleAnalytics(
    userId: string,
    trackingId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('analytics_integrations')
        .upsert({
          user_id: userId,
          platform: 'google_analytics',
          tracking_id: trackingId,
          is_active: true,
          updated_at: new Date().toISOString()
        });

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

  public generateGoogleAnalyticsCode(trackingId: string): string {
    return `
      <!-- Google Analytics -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${trackingId}');
      </script>
    `;
  }

  public generateFacebookPixelCode(pixelId: string): string {
    return `
      <!-- Facebook Pixel Code -->
      <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      </script>
      <noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"
      /></noscript>
    `;
  }
}

export const seoMarketingService = SEOMarketingService.getInstance();
