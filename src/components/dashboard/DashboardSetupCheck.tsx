import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import DashboardSetupWizard from './DashboardSetupWizard';

interface DashboardSetupCheckProps {
  children: React.ReactNode;
}

const DashboardSetupCheck: React.FC<DashboardSetupCheckProps> = ({ children }) => {
  const { user, profile, isLoading } = useUser();
  const [showSetup, setShowSetup] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSetupStatus = () => {
      if (isLoading) return;

      // Check if user is logged in
      if (!user) {
        setIsChecking(false);
        return;
      }

      // Check if profile exists and setup is completed
      if (!profile || !profile.setup_completed) {
        setShowSetup(true);
      }

      setIsChecking(false);
    };

    checkSetupStatus();
  }, [user, profile, isLoading]);

  const handleSetupComplete = () => {
    setShowSetup(false);
  };

  const handleSkipSetup = () => {
    setShowSetup(false);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <DashboardSetupWizard 
        onComplete={handleSetupComplete}
        onSkip={handleSkipSetup}
      />
    );
  }

  return <>{children}</>;
};

export default DashboardSetupCheck;
