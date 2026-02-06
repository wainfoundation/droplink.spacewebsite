import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { markUserInteraction } from "@/utils/sounds";
import PiBrowserMobileOptimizer from "@/components/PiBrowserMobileOptimizer";
import PiBrowserOptimizer from "@/components/PiBrowserOptimizer";
import { logMainnetOnlyStatus } from "@/config/mainnet-only";
import PostAuthAdGate from "@/components/ads/PostAuthAdGate";
import "@/styles/christmas-theme.css";
// Theme provider wrapper for Christmas theme support

// Pages
import About from "@/pages/About";
import Admin from "@/pages/Admin";
import AdminDashboard from "@/pages/AdminDashboard";
import AllFaqs from "@/pages/AllFaqs";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Careers from "@/pages/Careers";
import Community from "@/pages/Community";
import Contact from "@/pages/Contact";
import Cookies from "@/pages/Cookies";
import CreatorDirectory from "@/pages/CreatorDirectory";
import Dashboard from "@/pages/DashboardNew";
import DashboardComplete from "@/pages/DashboardComplete";
import RealtimeTest from "@/pages/RealtimeTest";
import PublicProfile from "@/pages/PublicProfile";
import UsernameSetup from "@/pages/UsernameSetup";
import Demo from "@/pages/Demo";
import Developers from "@/pages/Developers";
import DevelopersPage from "@/pages/DevelopersPage";
import DomainVerification from "@/pages/DomainVerification";
import Features from "@/pages/Features";
import Forums from "@/pages/Forums";
import GDPR from "@/pages/GDPR";
import GroupChat from "@/pages/GroupChat";
import Groups from "@/pages/Groups";
import Help from "@/pages/Help";
import HelpArticle from "@/pages/HelpArticle";
import Home from "@/pages/Home";
import Index from "@/pages/Index";
import LoginPage from "@/pages/LoginPage";
import OnboardingPage from "@/pages/Onboarding";
import PiDashboard from "@/pages/PiDashboard";
import PiBlockchainWallet from "@/pages/PiBlockchainWallet";
import PiDomainDetails from "@/pages/PiDomainDetails";
import SignupPage from "@/pages/SignupPage";
import Stickers from "@/pages/Stickers";
import Store from "@/pages/Store";
import DropPay from "@/pages/DropPay";
// import DropstorePage from "@/../pages/dropstore"; // Removed: file does not exist
import SystemStatus from "@/pages/SystemStatus";
import Templates from "@/pages/Templates";
import UserInfo from "@/pages/auth/UserInfo";
import TestSignup from "@/pages/TestSignup";
import CreateLinkInBio from "@/pages/CreateLinkInBio";
import ShareLinkInBio from "@/pages/ShareLinkInBio";
import WorkflowDemo from "@/pages/WorkflowDemo";
import { ProfileProvider } from "@/context/ProfileContext";
import PiTest from "@/pages/PiTest";
import PiProfileImport from "@/pages/PiProfileImport";
import Auth from "@/pages/Auth";
import Pricing from "@/pages/Pricing";
import Privacy from "@/pages/Privacy";
import ProfilePage from "@/pages/ProfilePage";
import ProfileTest from "@/components/ProfileTest";
import Terms from "@/pages/Terms";
import TestProfile from "@/pages/TestProfile";
import TestPage from "@/pages/TestPage";
import TestWorkflow from "@/pages/TestWorkflow";
// Removed DebugAuth import for production
import PublicProfilePage from "@/pages/PublicProfile";
import PublicProfileDemo from "@/pages/PublicProfileDemo";
import AdProtectedPage from "@/pages/AdProtectedPage";
import LinktreeProfilePage from "@/pages/LinktreeProfilePage";
import PiNetworkProfilePage from "@/pages/PiNetworkProfilePage";
import StandaloneProfilePage from "@/pages/StandaloneProfilePage";
import DroplinkProfilePage from "@/pages/DroplinkProfilePage";
import PublicBioLink from "@/pages/PublicBioLink";
import BioLinkTemplates from "@/pages/BioLinkTemplates";
import PublicProfileTest from "@/pages/PublicProfileTest";
import TestPublicProfile from "@/pages/TestPublicProfile";
import MobilePreviewTest from "@/components/MobilePreviewTest";
import PiBrowserCompatibilityTest from "@/components/PiBrowserCompatibilityTest";
import LocalhostTest from "@/pages/LocalhostTest";
import DashboardTest from "@/components/DashboardTest";
import CommunityGuidelines from "@/pages/CommunityGuidelines";
import UserRules from "@/pages/UserRules";
import ModerationPolicy from "@/pages/ModerationPolicy";
import SafetyGuidelines from "@/pages/SafetyGuidelines";
import DataDeletion from "@/pages/DataDeletion";
import ReportAbuse from "@/pages/ReportAbuse";
import MicaWhitepaper from "@/pages/MicaWhitepaper";
import PiEconomyRules from "@/pages/PiEconomyRules";
import Transparency from "@/pages/Transparency";
import SafetyPlan from "@/pages/SafetyPlan";

// Components
import NotFound from "@/pages/NotFound";


const queryClient = new QueryClient();

function App() {
  // Log mainnet-only configuration status
  useEffect(() => {
    logMainnetOnlyStatus();
  }, []);

  // Handle user interaction for audio playback
  useEffect(() => {
    const handleUserInteraction = () => {
      markUserInteraction();
      // Remove event listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    // Add event listeners for user interaction
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider>
          <UserProvider>
            <ProfileProvider>
              <PiBrowserOptimizer>
                <PiBrowserMobileOptimizer>
                  <Router>
                    <PostAuthAdGate>
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/index" element={<Index />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        <Route path="/careers" element={<Careers />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/cookies" element={<Cookies />} />
                        <Route path="/community-guidelines" element={<CommunityGuidelines />} />
                        <Route path="/creator-directory" element={<CreatorDirectory />} />
                        <Route path="/data-deletion" element={<DataDeletion />} />
                        <Route path="/demo" element={<Demo />} />
                        <Route path="/developers" element={<Developers />} />
                        <Route path="/developers-page" element={<DevelopersPage />} />
                        <Route path="/domain-verification" element={<DomainVerification />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/forums" element={<Forums />} />
                        <Route path="/gdpr" element={<GDPR />} />
                        <Route path="/group-chat" element={<GroupChat />} />
                        <Route path="/groups" element={<Groups />} />
                        <Route path="/help" element={<Help />} />
                        <Route path="/help/article/:articleId" element={<HelpArticle />} />
                        <Route path="/help/:slug" element={<HelpArticle />} />
                        <Route path="/faqs" element={<AllFaqs />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/login" element={<Auth />} />
                        <Route path="/signup" element={<Auth />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/pi-domain-details" element={<PiDomainDetails />} />
                        <Route path="/pi-blockchain-wallet" element={<PiBlockchainWallet />} />
                        <Route path="/moderation-policy" element={<ModerationPolicy />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/report-abuse" element={<ReportAbuse />} />
                        <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
                        <Route path="/safety-plan" element={<SafetyPlan />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/user-rules" element={<UserRules />} />
                        <Route path="/mica-whitepaper" element={<MicaWhitepaper />} />
                        <Route path="/pi-economy-rules" element={<PiEconomyRules />} />
                        <Route path="/transparency" element={<Transparency />} />
                        <Route path="/stickers" element={<Stickers />} />
                        <Route path="/store" element={<Store />} />
                        <Route path="/dropstore" element={<Store />} />
                        <Route path="/droppay" element={<DropPay />} />
                        <Route path="/status" element={<SystemStatus />} />
                        <Route path="/templates" element={<Templates />} />
                        <Route path="/biolink-templates" element={<BioLinkTemplates />} />
                        <Route path="/test-signup" element={<TestSignup />} />
                        <Route path="/public-profile-test" element={<PublicProfileTest />} />
                        <Route path="/test-public-profile/:username" element={<TestPublicProfile />} />
                        <Route path="/mobile-preview-test" element={<MobilePreviewTest />} />
                        <Route path="/pi-browser-test" element={<PiBrowserCompatibilityTest />} />
                        <Route path="/localhost-test" element={<LocalhostTest />} />
                        <Route path="/dashboard-test" element={<DashboardTest />} />
                        <Route path="/create-link-in-bio" element={<CreateLinkInBio />} />
                        <Route path="/share-link-in-bio" element={<ShareLinkInBio />} />
                        <Route path="/workflow-demo" element={<WorkflowDemo />} />
                        <Route path="/pi-test" element={<PiTest />} />
                        <Route path="/pi-profile-import" element={<PiProfileImport />} />
                        <Route path="/public-profile-demo" element={<PublicProfileDemo />} />
                        <Route path="/premium-content" element={<AdProtectedPage />} />

                        {/* Authentication Routes */}
                        <Route path="/auth/userinfo" element={<UserInfo />} />

                        {/* Dashboard Routes */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/dashboard-complete" element={<DashboardComplete />} />
                        <Route path="/realtime-test" element={<RealtimeTest />} />
                        <Route path="/username-setup" element={<UsernameSetup />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                        <Route path="/pi-dashboard" element={<PiDashboard />} />

                        {/* Onboarding Routes */}
                        <Route path="/onboarding" element={<OnboardingPage />} />

                        {/* Profile Routes - Specific routes first */}
                        <Route path="/@:username" element={<ProfilePage />} />
                        <Route path="/link/:username" element={<LinktreeProfilePage />} />
                        <Route path="/pi/:username" element={<PiNetworkProfilePage />} />
                        <Route path="/live/:username" element={<StandaloneProfilePage />} />
                        <Route path="/profile-test" element={<ProfileTest />} />
                        <Route path="/test-profile" element={<TestProfile />} />
                        <Route path="/test-page" element={<TestPage />} />
                        <Route path="/test-workflow" element={<TestWorkflow />} />
                        {/* Removed debug-auth route for production */}
                        
                        {/* Public Profile Route */}
                        <Route path="/:username" element={<PublicProfile />} />

                        {/* Catch-all Route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <Toaster />
                    </PostAuthAdGate>
                  </Router>
                </PiBrowserMobileOptimizer>
              </PiBrowserOptimizer>
            </ProfileProvider>
          </UserProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
