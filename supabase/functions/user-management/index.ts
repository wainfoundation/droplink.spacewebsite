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
    const { action, userId, profileData, linkData } = await req.json();
    
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
      case 'create_profile':
        if (!userId || !profileData) {
          return new Response(
            JSON.stringify({ error: "User ID and profile data are required" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        const { data: profile, error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            id: userId,
            username: profileData.username,
            display_name: profileData.display_name,
            bio: profileData.bio,
            avatar_url: profileData.avatar_url,
            intent: profileData.intent,
            plan: profileData.plan || 'free',
            consent_updates: profileData.consent_updates || false
          })
          .select()
          .single();

        if (profileError) {
          console.error("Error creating profile:", profileError);
          return new Response(
            JSON.stringify({ error: profileError.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        // Create user features based on plan
        const { error: featuresError } = await supabaseAdmin
          .from('user_features')
          .insert({
            user_id: userId,
            max_links: profileData.plan === 'free' ? 1 : profileData.plan === 'basic' ? 5 : 50,
            can_schedule: profileData.plan === 'pro' || profileData.plan === 'premium',
            can_sell: profileData.plan === 'pro' || profileData.plan === 'premium',
            can_use_analytics: profileData.plan !== 'free',
            can_remove_ads: profileData.plan === 'pro' || profileData.plan === 'premium',
            can_customize_css: profileData.plan === 'premium',
            can_capture_emails: profileData.plan !== 'free',
            can_use_pi_domain: profileData.plan !== 'free'
          });

        if (featuresError) {
          console.error("Error creating user features:", featuresError);
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            profile: profile
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      case 'update_profile':
        if (!userId || !profileData) {
          return new Response(
            JSON.stringify({ error: "User ID and profile data are required" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        const { data: updatedProfile, error: updateError } = await supabaseAdmin
          .from('user_profiles')
          .update({
            ...profileData,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select()
          .single();

        if (updateError) {
          console.error("Error updating profile:", updateError);
          return new Response(
            JSON.stringify({ error: updateError.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            profile: updatedProfile
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      case 'get_profile':
        if (!userId) {
          return new Response(
            JSON.stringify({ error: "User ID is required" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        const { data: userProfile, error: getError } = await supabaseAdmin
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (getError) {
          console.error("Error getting profile:", getError);
          return new Response(
            JSON.stringify({ error: getError.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            profile: userProfile
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      case 'add_links':
        if (!userId || !linkData || !Array.isArray(linkData)) {
          return new Response(
            JSON.stringify({ error: "User ID and link data array are required" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        const linksToInsert = linkData.map((link: any, index: number) => ({
          user_id: userId,
          title: link.title,
          url: link.url,
          icon: link.icon,
          position: index,
          is_active: true
        }));

        const { data: links, error: linksError } = await supabaseAdmin
          .from('links')
          .insert(linksToInsert)
          .select();

        if (linksError) {
          console.error("Error adding links:", linksError);
          return new Response(
            JSON.stringify({ error: linksError.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            links: links
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      case 'update_plan':
        if (!userId || !profileData.plan) {
          return new Response(
            JSON.stringify({ error: "User ID and plan are required" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        // Update user plan using the database function
        const { error: planError } = await supabaseAdmin
          .rpc('update_user_plan', {
            user_id: userId,
            new_plan: profileData.plan
          });

        if (planError) {
          console.error("Error updating plan:", planError);
          return new Response(
            JSON.stringify({ error: planError.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            message: "Plan updated successfully"
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
    console.error("Error in user management:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
}); 