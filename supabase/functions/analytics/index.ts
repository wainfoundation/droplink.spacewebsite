import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, userId, linkId, analyticsData } = await req.json();
    
    if (!action) {
      return new Response(
        JSON.stringify({ error: "Action is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Initialize Supabase client with service role key for admin access
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    switch (action) {
      case 'track_page_view':
        if (!userId) {
          return new Response(
            JSON.stringify({ error: "User ID is required" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        const { error: pageViewError } = await supabaseAdmin
          .from('analytics')
          .insert({
            user_id: userId,
            page_view: true,
            referrer: analyticsData?.referrer || null,
            user_agent: analyticsData?.user_agent || null,
            ip_address: analyticsData?.ip_address || null
          });

        if (pageViewError) {
          console.error("Error tracking page view:", pageViewError);
          return new Response(
            JSON.stringify({ error: pageViewError.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        // Update total clicks in user profile
        await supabaseAdmin
          .from('user_profiles')
          .update({ 
            total_clicks: supabaseAdmin.raw('total_clicks + 1'),
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        return new Response(
          JSON.stringify({ 
            success: true,
            message: "Page view tracked"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      case 'track_link_click':
        if (!userId || !linkId) {
          return new Response(
            JSON.stringify({ error: "User ID and link ID are required" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        // Track link click
        const { error: linkClickError } = await supabaseAdmin
          .from('analytics')
          .insert({
            user_id: userId,
            link_id: linkId,
            link_click: true,
            referrer: analyticsData?.referrer || null,
            user_agent: analyticsData?.user_agent || null,
            ip_address: analyticsData?.ip_address || null
          });

        if (linkClickError) {
          console.error("Error tracking link click:", linkClickError);
          return new Response(
            JSON.stringify({ error: linkClickError.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        // Update link clicks count
        await supabaseAdmin
          .from('links')
          .update({ 
            clicks: supabaseAdmin.raw('clicks + 1'),
            updated_at: new Date().toISOString()
          })
          .eq('id', linkId);

        // Update total clicks in user profile
        await supabaseAdmin
          .from('user_profiles')
          .update({ 
            total_clicks: supabaseAdmin.raw('total_clicks + 1'),
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        return new Response(
          JSON.stringify({ 
            success: true,
            message: "Link click tracked"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      case 'get_analytics':
        if (!userId) {
          return new Response(
            JSON.stringify({ error: "User ID is required" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        const { data: analytics, error: getAnalyticsError } = await supabaseAdmin
          .from('analytics')
          .select(`
            *,
            links (
              id,
              title,
              url
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (getAnalyticsError) {
          console.error("Error getting analytics:", getAnalyticsError);
          return new Response(
            JSON.stringify({ error: getAnalyticsError.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        // Calculate summary statistics
        const totalPageViews = analytics.filter(a => a.page_view).length;
        const totalLinkClicks = analytics.filter(a => a.link_click).length;
        const uniqueVisitors = new Set(analytics.map(a => a.ip_address)).size;

        // Get top performing links
        const linkStats = analytics
          .filter(a => a.link_click && a.links)
          .reduce((acc, a) => {
            const linkId = a.links.id;
            if (!acc[linkId]) {
              acc[linkId] = {
                id: linkId,
                title: a.links.title,
                url: a.links.url,
                clicks: 0
              };
            }
            acc[linkId].clicks++;
            return acc;
          }, {});

        const topLinks = Object.values(linkStats)
          .sort((a: any, b: any) => b.clicks - a.clicks)
          .slice(0, 5);

        return new Response(
          JSON.stringify({ 
            success: true,
            analytics: {
              totalPageViews,
              totalLinkClicks,
              uniqueVisitors,
              topLinks,
              recentActivity: analytics.slice(0, 50)
            }
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      case 'get_link_analytics':
        if (!linkId) {
          return new Response(
            JSON.stringify({ error: "Link ID is required" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        const { data: linkAnalytics, error: linkAnalyticsError } = await supabaseAdmin
          .from('analytics')
          .select('*')
          .eq('link_id', linkId)
          .order('created_at', { ascending: false });

        if (linkAnalyticsError) {
          console.error("Error getting link analytics:", linkAnalyticsError);
          return new Response(
            JSON.stringify({ error: linkAnalyticsError.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        const linkClicks = linkAnalytics.filter(a => a.link_click).length;
        const uniqueClickers = new Set(linkAnalytics.filter(a => a.link_click).map(a => a.ip_address)).size;

        return new Response(
          JSON.stringify({ 
            success: true,
            linkAnalytics: {
              totalClicks: linkClicks,
              uniqueClickers,
              recentClicks: linkAnalytics.filter(a => a.link_click).slice(0, 20)
            }
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
    }

  } catch (error) {
    console.error("Error in analytics:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
}); 