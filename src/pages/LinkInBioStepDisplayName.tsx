
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LinkInBioStepDisplayName = ({
  displayName,
  setDisplayName,
  goNext,
  goBack,
  step,
  totalSteps,
}) => (
  <div>
    <div className="mb-4 text-lg font-semibold text-center">Pick your display name</div>
    <Input
      value={displayName}
      onChange={e => setDisplayName(e.target.value)}
      placeholder="Your name or brand"
      maxLength={30}
      className="mb-6"
    />
    <div className="flex justify-between gap-3">
      <Button variant="outline" onClick={goBack} disabled={step === 0}>
        Back
      </Button>
      <Button
        onClick={goNext}
        disabled={!displayName.trim()}
        className="bg-gradient-to-r from-primary to-blue-600"
      >
        Next
      </Button>
    </div>
  </div>
);

export default LinkInBioStepDisplayName;
