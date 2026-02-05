import React from "react";
import PublicProfile from "@/components/profile/PublicProfile";
import { Helmet } from "react-helmet-async";

const PublicProfileDemo: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Public Profile Demo - Droplink</title>
        <meta name="description" content="See how your Droplink profile will look to visitors" />
      </Helmet>
      <PublicProfile />
    </>
  );
};

export default PublicProfileDemo;
