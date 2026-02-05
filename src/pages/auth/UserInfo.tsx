import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Helmet } from "react-helmet-async";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";
import GoToTop from '@/components/GoToTop';

const UserInfo = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const { subscribeToNewsletter, updateNewsletterConsent } = useNewsletterSubscription();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to continue",
        variant: "destructive"
      });
      return;
    }

    if (newsletterConsent && !email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email to receive updates",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update user profile with username
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          username: username.trim(),
          display_name: username.trim(),
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Handle newsletter subscription if consented
      if (newsletterConsent && email.trim()) {
        await subscribeToNewsletter(email.trim(), user?.id);
        await updateNewsletterConsent(user?.id || '', true);
      } else if (user?.id) {
        await updateNewsletterConsent(user?.id, false);
      }

      toast({
        title: "Profile updated",
        description: "Your information has been saved successfully",
      });

      // Navigate to onboarding instead of old register flow
      navigate("/onboarding");
      
    } catch (error) {
      console.error('Error updating user info:', error);
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Complete Your Profile - Droplink</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome to Droplink!</CardTitle>
              <p className="text-gray-600">Let's complete your profile setup</p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Choose your username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="your-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-center"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Your profile will be available at: droplink.space/@{username || 'username'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={newsletterConsent}
                      onCheckedChange={(checked) => setNewsletterConsent(checked as boolean)}
                    />
                    <Label htmlFor="newsletter" className="text-sm">
                      Subscribe to newsletter for updates and tips
                    </Label>
                  </div>
                  
                  {newsletterConsent && (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Continue"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <GoToTop />
    </>
  );
};

export default UserInfo;
