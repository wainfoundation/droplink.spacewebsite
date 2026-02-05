import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Camera, 
  Palette, 
  Globe, 
  Shield, 
  Bell,
  Save,
  Upload,
  Eye,
  EyeOff,
  Copy,
  Check,
  Building2,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  X,
  Star,
  CheckCircle,
  Clock,
  Users,
  Target,
  Code,
  Image,
  Video,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { getBaseUrl } from '@/utils/url-helper';

interface ProfileSettingsProps {
  userPlan: string;
  onUpgrade?: (planId: string) => void;
}

const ProfileSettings = ({ userPlan, onUpgrade }: ProfileSettingsProps) => {
  const { toast } = useToast();
  const { user, profile, updateProfile } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    username: profile?.username || user?.user_metadata?.username || "",
    displayName: profile?.display_name || user?.user_metadata?.display_name || "",
    bio: profile?.bio || "",
    avatar: profile?.avatar_url || "",
    coverPhoto: profile?.cover_photo || "",
    theme: profile?.theme || "default",
    customDomain: profile?.custom_domain || "",
    isPublic: profile?.is_public !== false,
    showAnalytics: profile?.show_analytics !== false,
    emailNotifications: profile?.email_notifications !== false,
    
    // Professional Information
    businessName: profile?.business_name || "",
    professionalTitle: profile?.professional_title || "",
    industry: profile?.industry || "",
    location: profile?.location || "",
    contactEmail: profile?.contact_email || "",
    contactPhone: profile?.contact_phone || "",
    website: profile?.website || "",
    languages: profile?.languages || [],
    skills: profile?.skills || [],
    availability: profile?.availability || "available",
    
    // Professional Bio
    professionalBio: profile?.professional_bio || "",
    experience: profile?.experience || "",
    education: profile?.education || "",
    certifications: profile?.certifications || [],
    
    // Social Links
    socialLinks: {
      instagram: profile?.social_links?.instagram || "",
      twitter: profile?.social_links?.twitter || "",
      linkedin: profile?.social_links?.linkedin || "",
      youtube: profile?.social_links?.youtube || "",
      tiktok: profile?.social_links?.tiktok || "",
      facebook: profile?.social_links?.facebook || "",
      discord: profile?.social_links?.discord || "",
      telegram: profile?.social_links?.telegram || "",
      spotify: profile?.social_links?.spotify || "",
      twitch: profile?.social_links?.twitch || "",
      pinterest: profile?.social_links?.pinterest || "",
      github: profile?.social_links?.github || "",
      behance: profile?.social_links?.behance || "",
      dribbble: profile?.social_links?.dribbble || ""
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const themes = [
    { id: "default", name: "Default", preview: "bg-gradient-to-br from-blue-500 to-purple-600" },
    { id: "dark", name: "Dark", preview: "bg-gradient-to-br from-gray-800 to-gray-900" },
    { id: "minimal", name: "Minimal", preview: "bg-gradient-to-br from-white to-gray-100" },
    { id: "vibrant", name: "Vibrant", preview: "bg-gradient-to-br from-pink-500 to-orange-500" },
    { id: "ocean", name: "Ocean", preview: "bg-gradient-to-br from-cyan-500 to-blue-500" },
    { id: "sunset", name: "Sunset", preview: "bg-gradient-to-br from-red-500 to-yellow-500" }
  ];

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for demo
      localStorage.setItem('user_profile', JSON.stringify(profileData));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirm password must match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully",
      });
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const getProfileUrl = () => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/profile/${profileData.username}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          <p className="text-gray-600">Customize your profile and account settings</p>
        </div>
        <Button
          onClick={handleSaveProfile}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profileData.avatar ? (
                      <img 
                        src={profileData.avatar} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      profileData.displayName?.charAt(0) || user?.email?.charAt(0) || "U"
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    placeholder="your-username"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                  placeholder="Your Name"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Tell people about yourself..."
                  rows={3}
                  maxLength={200}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {profileData.bio.length}/200 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business/Company Name</Label>
                  <Input
                    id="businessName"
                    value={profileData.businessName}
                    onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                    placeholder="Your Business Name"
                  />
                </div>
                <div>
                  <Label htmlFor="professionalTitle">Professional Title</Label>
                  <Input
                    id="professionalTitle"
                    value={profileData.professionalTitle}
                    onChange={(e) => setProfileData({ ...profileData, professionalTitle: e.target.value })}
                    placeholder="e.g., Digital Creator, CEO, Designer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <select
                    id="industry"
                    value={profileData.industry}
                    onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Industry</option>
                    <option value="technology">Technology</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="fashion">Fashion</option>
                    <option value="food">Food & Beverage</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={profileData.contactEmail}
                    onChange={(e) => setProfileData({ ...profileData, contactEmail: e.target.value })}
                    placeholder="contact@yourbusiness.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={profileData.contactPhone}
                    onChange={(e) => setProfileData({ ...profileData, contactPhone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profileData.website}
                  onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <Label htmlFor="availability">Availability Status</Label>
                <select
                  id="availability"
                  value={profileData.availability}
                  onChange={(e) => setProfileData({ ...profileData, availability: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Available for work</option>
                  <option value="busy">Currently busy</option>
                  <option value="hiring">Hiring</option>
                  <option value="collaborating">Open to collaboration</option>
                  <option value="consulting">Available for consulting</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Professional Bio & Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Professional Bio & Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="professionalBio">Professional Bio</Label>
                <Textarea
                  id="professionalBio"
                  value={profileData.professionalBio}
                  onChange={(e) => setProfileData({ ...profileData, professionalBio: e.target.value })}
                  placeholder="Tell people about your professional background, expertise, and what you do..."
                  rows={4}
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {profileData.professionalBio.length}/500 characters
                </p>
              </div>

              <div>
                <Label htmlFor="experience">Experience</Label>
                <Textarea
                  id="experience"
                  value={profileData.experience}
                  onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                  placeholder="List your work experience, key achievements, and notable projects..."
                  rows={3}
                  maxLength={300}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {profileData.experience.length}/300 characters
                </p>
              </div>

              <div>
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  value={profileData.education}
                  onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                  placeholder="Your educational background, degrees, certifications..."
                  rows={2}
                  maxLength={200}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {profileData.education.length}/200 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Social Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={profileData.socialLinks.instagram}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, instagram: e.target.value }
                    })}
                    placeholder="@username"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter/X</Label>
                  <Input
                    id="twitter"
                    value={profileData.socialLinks.twitter}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, twitter: e.target.value }
                    })}
                    placeholder="@username"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={profileData.socialLinks.linkedin}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, linkedin: e.target.value }
                    })}
                    placeholder="linkedin.com/in/username"
                  />
                </div>
                <div>
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={profileData.socialLinks.youtube}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, youtube: e.target.value }
                    })}
                    placeholder="youtube.com/@username"
                  />
                </div>
                <div>
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input
                    id="tiktok"
                    value={profileData.socialLinks.tiktok}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, tiktok: e.target.value }
                    })}
                    placeholder="@username"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={profileData.socialLinks.facebook}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, facebook: e.target.value }
                    })}
                    placeholder="facebook.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="discord">Discord</Label>
                  <Input
                    id="discord"
                    value={profileData.socialLinks.discord}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, discord: e.target.value }
                    })}
                    placeholder="discord.gg/server"
                  />
                </div>
                <div>
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input
                    id="telegram"
                    value={profileData.socialLinks.telegram}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, telegram: e.target.value }
                    })}
                    placeholder="@username"
                  />
                </div>
                <div>
                  <Label htmlFor="spotify">Spotify</Label>
                  <Input
                    id="spotify"
                    value={profileData.socialLinks.spotify}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, spotify: e.target.value }
                    })}
                    placeholder="open.spotify.com/artist/..."
                  />
                </div>
                <div>
                  <Label htmlFor="twitch">Twitch</Label>
                  <Input
                    id="twitch"
                    value={profileData.socialLinks.twitch}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, twitch: e.target.value }
                    })}
                    placeholder="twitch.tv/username"
                  />
                </div>
                <div>
                  <Label htmlFor="pinterest">Pinterest</Label>
                  <Input
                    id="pinterest"
                    value={profileData.socialLinks.pinterest}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, pinterest: e.target.value }
                    })}
                    placeholder="pinterest.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={profileData.socialLinks.github}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, github: e.target.value }
                    })}
                    placeholder="github.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="behance">Behance</Label>
                  <Input
                    id="behance"
                    value={profileData.socialLinks.behance}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, behance: e.target.value }
                    })}
                    placeholder="behance.net/username"
                  />
                </div>
                <div>
                  <Label htmlFor="dribbble">Dribbble</Label>
                  <Input
                    id="dribbble"
                    value={profileData.socialLinks.dribbble}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, dribbble: e.target.value }
                    })}
                    placeholder="dribbble.com/username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Theme & Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      profileData.theme === theme.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setProfileData({ ...profileData, theme: theme.id })}
                  >
                    <div className={`w-full h-16 rounded ${theme.preview} mb-2`}></div>
                    <p className="text-sm font-medium text-center">{theme.name}</p>
                    {profileData.theme === theme.id && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Domain */}
          {userPlan !== 'free' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Custom Domain
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customDomain">Custom Domain</Label>
                  <Input
                    id="customDomain"
                    value={profileData.customDomain}
                    onChange={(e) => setProfileData({ ...profileData, customDomain: e.target.value })}
                    placeholder="yourdomain.com"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Connect your own domain to your profile. Available on Starter and Pro plans.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile URL */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  value={getProfileUrl()}
                  readOnly
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyToClipboard(getProfileUrl(), "Profile URL")}
                >
                  {copiedField === "Profile URL" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(getProfileUrl(), '_blank')}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy & Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isPublic">Public Profile</Label>
                  <p className="text-sm text-gray-600">Anyone can view your profile</p>
                </div>
                <Switch
                  id="isPublic"
                  checked={profileData.isPublic}
                  onCheckedChange={(checked) => setProfileData({ ...profileData, isPublic: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showAnalytics">Show Analytics</Label>
                  <p className="text-sm text-gray-600">Display analytics on your profile</p>
                </div>
                <Switch
                  id="showAnalytics"
                  checked={profileData.showAnalytics}
                  onCheckedChange={(checked) => setProfileData({ ...profileData, showAnalytics: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={profileData.emailNotifications}
                  onCheckedChange={(checked) => setProfileData({ ...profileData, emailNotifications: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Plan Information */}
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Plan</span>
                <Badge variant="secondary">
                  {userPlan === 'free' ? 'Free' : userPlan === 'starter' ? 'Starter' : 'Pro'}
                </Badge>
              </div>
              {userPlan === 'free' && (
                <Button
                  onClick={() => onUpgrade?.('starter')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Upgrade Plan
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <Button
            onClick={handlePasswordChange}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? "Changing..." : "Change Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
