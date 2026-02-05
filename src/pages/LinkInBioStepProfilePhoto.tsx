
import React from "react";
import { Button } from "@/components/ui/button";

const placeholderAvatars = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=PiUser1",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Tiger",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Cat",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Rocket",
];

const LinkInBioStepProfilePhoto = ({
  avatarUrl,
  setAvatarUrl,
  goNext,
  goBack,
  step,
  totalSteps,
}) => {
  return (
    <div>
      <div className="mb-4 text-lg font-semibold text-center">Choose a profile photo</div>
      <div className="flex justify-center gap-4 mb-6">
        {placeholderAvatars.map(url => (
          <button
            key={url}
            className={`rounded-full border-2 w-16 h-16 overflow-hidden p-0 ${avatarUrl === url ? "border-primary" : "border-transparent"}`}
            onClick={() => setAvatarUrl(url)}
            type="button"
          >
            <img src={url} alt="Avatar" className="w-full h-full object-cover"/>
          </button>
        ))}
      </div>
      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={goBack}>
          Back
        </Button>
        <Button onClick={goNext} className="bg-gradient-to-r from-primary to-blue-600" disabled={!avatarUrl}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default LinkInBioStepProfilePhoto;
