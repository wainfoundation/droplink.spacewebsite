
import React from "react";
import { useProfile } from "@/context/ProfileContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PLATFORM_OPTIONS = {
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  twitter: "Twitter",
  website: "Website",
  whatsapp: "WhatsApp"
};

const ShareLinkInBio = () => {
  const { profile, setProfile } = useProfile();
  const navigate = useNavigate();

  if (!profile) {
    return <div className="text-center mt-10 text-lg">No profile found. Start at Test Signup.</div>;
  }

  function handleReset() {
    setProfile(null);
    navigate("/test-signup");
  }

  const fakeProfileUrl = `/profile/${encodeURIComponent(profile.displayName.replace(/\s+/g, "-").toLowerCase() || "my-bio")}`;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="bg-white rounded-xl shadow-xl p-8 mt-12 max-w-xl w-full">
        <div className="text-center mb-4 text-2xl font-bold">🎉 Your Link in Bio is Ready!</div>
        <div className="text-center mb-2 text-lg">Share this link:</div>
        <div className="text-center mb-6 select-all font-mono bg-gray-100 border rounded px-4 py-2 text-blue-700">
          {fakeProfileUrl}
        </div>
        <div className="mb-8">
          <div className="text-lg font-semibold">{profile.displayName}</div>
          <div className="mb-2 text-sm text-gray-700">{profile.bio}</div>
          <ul className="space-y-2">
            {profile.links.map((link, idx) => (
              <li key={idx}>
                <span className="font-medium">{PLATFORM_OPTIONS[link.platform as keyof typeof PLATFORM_OPTIONS]}:</span>{" "}
                <a href={link.url} className="underline text-blue-800" target="_blank" rel="noopener noreferrer">{link.url}</a>
              </li>
            ))}
          </ul>
        </div>
        <Button className="w-full mt-4 bg-gradient-to-r from-primary to-blue-600" onClick={handleReset}>
          Create Another
        </Button>
      </div>
    </div>
  );
};

export default ShareLinkInBio;
