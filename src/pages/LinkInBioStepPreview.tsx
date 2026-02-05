
import React from "react";
import DemoPreview from "@/components/DemoPreview";

// Props intentionally loose, just for live preview in onboarding
const LinkInBioStepPreview = ({
  displayName, bio, avatarUrl, links
}) => (
  <div>
    <DemoPreview profileData={{
      title: displayName,
      bio,
      avatar: avatarUrl,
      links,
    }}/>
  </div>
);

export default LinkInBioStepPreview;
