
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LinkInBioStepBio = ({
  bio,
  setBio,
  goNext,
  goBack,
  step,
  totalSteps,
}) => (
  <div>
    <div className="mb-4 text-lg font-semibold text-center">Write a short bio</div>
    <Input
      value={bio}
      onChange={e => setBio(e.target.value)}
      placeholder="Share what you do in 80 characters"
      maxLength={80}
      className="mb-6"
    />
    <div className="flex justify-between gap-3">
      <Button variant="outline" onClick={goBack}>
        Back
      </Button>
      <Button
        onClick={goNext}
        disabled={!bio.trim()}
        className="bg-gradient-to-r from-primary to-blue-600"
      >
        Next
      </Button>
    </div>
  </div>
);

export default LinkInBioStepBio;
