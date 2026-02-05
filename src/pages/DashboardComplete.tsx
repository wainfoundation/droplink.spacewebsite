// Complete Dashboard Page
// Uses the full dashboard component with all functionality

import React from 'react';
import { Helmet } from 'react-helmet-async';
import FullDashboard from '@/components/dashboard/FullDashboard';

const DashboardComplete = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Dashboard - Droplink</title>
        <meta name="description" content="Complete Droplink dashboard with all features" />
      </Helmet>
      
      <FullDashboard />
    </div>
  );
};

export default DashboardComplete;
