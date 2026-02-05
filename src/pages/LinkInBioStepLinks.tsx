
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Only add platforms once (no duplicates)
const PLATFORM_OPTIONS = [
  { id: "youtube", name: "YouTube", placeholder: "https://youtube.com/@username" },
  { id: "instagram", name: "Instagram", placeholder: "https://instagram.com/username" },
  { id: "tiktok", name: "TikTok", placeholder: "https://tiktok.com/@username" },
  { id: "twitter", name: "Twitter", placeholder: "https://twitter.com/username" },
  { id: "website", name: "Website", placeholder: "https://yourwebsite.com" },
  { id: "whatsapp", name: "WhatsApp", placeholder: "https://wa.me/1234567890" },
];

const LinkInBioStepLinks = ({
  links,
  setLinks,
  goNext,
  goBack,
  step,
  totalSteps,
  profile,
}) => {
  const [currentLink, setCurrentLink] = useState({ platform: "", url: "" });
  const [error, setError] = useState<string>("");

  const plan = profile?.plan || "free";
  const planLimit = plan === "free" ? 1 : plan === "starter" ? 20 : plan === "pro" ? 50 : 100;
  const reachLimit = links.length >= planLimit;

  function handleAddLink() {
    if (!currentLink.platform || !currentLink.url) return;
    if (reachLimit) {
      setError("Link limit reached for this plan.");
      return;
    }
    if (links.some(l => l.platform === currentLink.platform)) {
      setError("Platform already added.");
      return;
    }
    setLinks([...links, { ...currentLink }]);
    setCurrentLink({ platform: "", url: "" });
    setError("");
  }

  function handleRemoveLink(idx: number) {
    setLinks(links.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className="mb-4 text-lg font-semibold text-center">Add your social links</div>
      <div className="flex gap-2 mb-2">
        <select
          className="border px-2 rounded"
          value={currentLink.platform}
          onChange={e =>
            setCurrentLink(cl => ({ ...cl, platform: e.target.value }))
          }
        >
          <option value="">Platform...</option>
          {PLATFORM_OPTIONS.filter(opt => !links.some(l => l.platform === opt.id)).map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
        <Input
          className="flex-1"
          placeholder="Enter your URL"
          value={currentLink.url}
          onChange={e => setCurrentLink(cl => ({ ...cl, url: e.target.value }))}
        />
        <Button onClick={handleAddLink} disabled={reachLimit || !currentLink.platform || !currentLink.url}>
          Add
        </Button>
      </div>
      {error && <div className="text-amber-700 bg-amber-100 rounded p-2 mb-2">{error}</div>}
      <ul className="space-y-2 mb-3">
        {links.map((link, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span className="font-semibold">{PLATFORM_OPTIONS.find(p => p.id === link.platform)?.name}:</span>
            <a href={link.url} className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">{link.url}</a>
            <Button variant="outline" size="sm" onClick={() => handleRemoveLink(idx)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={goBack}>
          Back
        </Button>
        <Button
          onClick={goNext}
          className="bg-gradient-to-r from-primary to-blue-600"
          disabled={links.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default LinkInBioStepLinks;
