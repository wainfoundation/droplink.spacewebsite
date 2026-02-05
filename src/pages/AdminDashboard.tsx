import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useUserPlan } from "@/hooks/use-user-plan";
import { useFeatureGate } from "@/hooks/useFeatureGate";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import DashboardMain from "@/components/dashboard/DashboardMain";
import MobilePreview from "@/components/dashboard/MobilePreview";
import PlanStatusHeader from "@/components/dashboard/PlanStatusHeader";
import PlanUpgradeModal from "@/components/dashboard/PlanUpgradeModal";
import { Helmet } from "react-helmet-async";
import { toast } from "@/hooks/use-toast";
import GoToTop from '@/components/GoToTop';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, profile } = useUser();
  const { plan, limits } = useUserPlan();
  const { hasFeatureAccess, getRequiredPlan } = useFeatureGate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState("");
  const [activeSection, setActiveSection] = useState("my-droplink");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthAndOnboarding = async () => {
      try {
        // Check if user is logged in
        if (!isLoggedIn) {
          console.log("User not logged in, redirecting to login");
          navigate("/login");
          return;
        }

        // Wait for profile to load
        if (!profile) {
          console.log("Profile not found, waiting for data...");
          return; // Wait for profile to load
        }

        // Check if onboarding is completed
        if (!profile.onboarding_completed) {
          console.log("Onboarding not completed, redirecting to onboarding");
          toast({
            title: "Complete Your Setup",
            description: "Please complete your profile setup to access the dashboard.",
          });
          navigate("/onboarding");
          return;
        }

        // Welcome message for completed users
        if (profile.onboarding_completed) {
          console.log("User authenticated and onboarding completed, showing dashboard");
          toast({
            title: "Welcome to Your Dashboard!",
            description: `Welcome back, ${profile.display_name || profile.username}! Manage your Droplink profile here.`,
          });
        }
      } catch (error) {
        console.error("Error checking authentication and onboarding:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthAndOnboarding();
  }, [isLoggedIn, profile, navigate]);

  const handleFeatureClick = (feature: string, requiredFeatures: string[]) => {
    // Check if any of the required features are accessible
    const hasAccess = requiredFeatures.some(req => hasFeatureAccess(req));
    
    if (!hasAccess) {
      const requiredPlan = getRequiredPlan(requiredFeatures[0]);
      setUpgradeFeature(requiredFeatures[0]);
      setShowUpgradeModal(true);
      return false;
    }
    
    setActiveSection(feature);
    return true;
  };

  // Show loading state while checking authentication and profile
  if (isCheckingAuth || !isLoggedIn || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Droplink</title>
      </Helmet>
      
      <Navbar />
      
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <AdminSidebar 
          activeSection={activeSection}
          onSectionChange={handleFeatureClick}
          plan={plan}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <PlanStatusHeader plan={plan} limits={limits} />
          
          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Main Dashboard */}
            <div className="flex-1 overflow-y-auto">
              <DashboardMain 
                activeSection={activeSection}
                plan={plan}
                limits={limits}
              />
            </div>
            
            {/* Mobile Preview */}
            <div className="hidden lg:block w-80 border-l bg-gray-50">
              <MobilePreview />
            </div>
          </div>
        </div>
      </div>
      
      {/* Upgrade Modal */}
      <PlanUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={upgradeFeature}
        currentPlan={plan}
      />
      
      <Footer />
      <GoToTop />
    </>
  );
};

export default AdminDashboard;
