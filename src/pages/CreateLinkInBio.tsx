import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/context/ProfileContext";

const PLATFORM_OPTIONS = [
  { id: "youtube", name: "YouTube", placeholder: "https://youtube.com/@username" },
  { id: "instagram", name: "Instagram", placeholder: "https://instagram.com/username" },
  { id: "tiktok", name: "TikTok", placeholder: "https://tiktok.com/@username" },
  { id: "twitter", name: "Twitter", placeholder: "https://twitter.com/username" },
  { id: "website", name: "Website", placeholder: "https://yourwebsite.com" },
  { id: "whatsapp", name: "WhatsApp", placeholder: "https://wa.me/1234567890" }
];

const PLAN_LIMITS = {
  free: 1,
  starter: 20,
  pro: 50,
  premium: 100,
};

const CreateLinkInBio = () => {
  const { profile, setProfile } = useProfile();
  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [links, setLinks] = useState(profile?.links || []);
  const [currentLink, setCurrentLink] = useState({ platform: "", url: "" });
  const [error, setError] = useState<string>("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  const navigate = useNavigate();

  if (!profile) {
    return <div className="text-center mt-10 text-xl">No plan selected. Go to Test Signup.</div>;
  }

  const linkLimit = PLAN_LIMITS[profile.plan];
  const reachLimit = links.length >= linkLimit;

  function handleAddLink() {
    if (!currentLink.platform || !currentLink.url) return;
    if (reachLimit) {
      setShowUpgrade(true);
      setError("You've reached your link limit. Upgrade to add more links!");
      return;
    }
    if (links.some(l => l.platform === currentLink.platform)) {
      setError("You already added this platform.");
      return;
    }
    setLinks([...links, { ...currentLink }]);
    setCurrentLink({ platform: "", url: "" });
    setError("");
  }

  function handleRemoveLink(idx: number) {
    setLinks(links.filter((_, i) => i !== idx));
  }

  function handleFinish() {
    setProfile({
      ...profile,
      displayName,
      bio,
      links
    });
    navigate("/share-link-in-bio");
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <Card className="w-full max-w-xl mx-auto shadow-xl mt-8">
        <CardHeader>
          <CardTitle className="text-xl">Create your Link in Bio Profile ({profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)} Plan)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div>
              <label className="font-medium">Display Name:</label>
              <Input value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={30} />
            </div>
            <div>
              <label className="font-medium">Bio:</label>
              <Input value={bio} onChange={e => setBio(e.target.value)} maxLength={80} />
            </div>
            <div>
              <label className="font-medium">Add a Link:</label>
              <div className="flex gap-2">
                <select className="border px-2" value={currentLink.platform} onChange={e => setCurrentLink(cl => ({ ...cl, platform: e.target.value }))}>
                  <option value="">Platform...</option>
                  {PLATFORM_OPTIONS.filter(opt => !links.some(l => l.platform === opt.id)).map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
                <Input className="flex-1" placeholder="Enter your URL" value={currentLink.url} onChange={e => setCurrentLink(cl => ({ ...cl, url: e.target.value }))} />
                <Button onClick={handleAddLink} disabled={reachLimit || !currentLink.platform || !currentLink.url}>Add</Button>
              </div>
            </div>
            <div>
              <div className="mb-2 font-medium">Your Links ({links.length}/{linkLimit})</div>
              <ul className="space-y-2">
                {links.map((link, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="font-semibold">{PLATFORM_OPTIONS.find(p => p.id === link.platform)?.name}:</span>
                    <a href={link.url} className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">{link.url}</a>
                    <Button variant="outline" size="sm" onClick={() => handleRemoveLink(idx)}>Remove</Button>
                  </li>
                ))}
              </ul>
            </div>
            {error && <div className="text-amber-700 bg-amber-100 rounded p-2">{error}</div>}
            {showUpgrade &&
              <div className="bg-blue-50 p-4 mt-2 rounded shadow text-blue-800">
                Link limit reached for the <b>{profile.plan}</b> plan. Upgrade to add more links.
              </div>
            }
            <Button className="w-full mt-4 bg-gradient-to-r from-primary to-blue-600" onClick={handleFinish} disabled={!displayName || links.length === 0}>
              Finish & Get Shareable Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateLinkInBio;
