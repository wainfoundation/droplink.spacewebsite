
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Plan = "free" | "starter" | "pro" | "premium";

interface LinkInBioProfile {
  plan: Plan;
  links: Array<{ platform: string; url: string }>;
  displayName: string;
  bio: string;
  avatarUrl?: string;
}

interface ProfileContextType {
  profile: LinkInBioProfile | null;
  setProfile: (data: LinkInBioProfile | null) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  setProfile: () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<LinkInBioProfile | null>(null);
  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
