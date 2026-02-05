import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const MicaWhitepaper = () => {
  useEffect(() => {
    // Redirect to the external PDF URL
    window.location.href = 'https://minepi.com/wp-content/uploads/2025/11/MiCA-Whitepaper-Pi-1.pdf';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Helmet>
        <title>MiCA Whitepaper - Droplink</title>
        <meta name="description" content="MiCA Whitepaper - Regulatory Compliance Framework" />
      </Helmet>
      <div className="text-center">
        <p className="text-gray-600">Redirecting to MiCA Whitepaper...</p>
      </div>
    </div>
  );
};

export default MicaWhitepaper;
