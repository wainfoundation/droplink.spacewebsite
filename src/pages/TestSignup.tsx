
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/context/ProfileContext";

const PLANS = [
  {
    id: "free",
    name: "Free",
    features: [
      "1 Link only",
      "Basic design",
      "Badge required"
    ]
  },
  {
    id: "starter",
    name: "Starter",
    features: [
      "Unlimited Links",
      "QR Codes",
      ".pi Domain",
      "No Badge"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    features: [
      "Sell Products",
      "Advanced Analytics",
      "SEO Tools"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    features: [
      "All Features",
      "API Access",
      "Custom CSS",
      "Priority Support"
    ]
  }
];

const TestSignup = () => {
  const navigate = useNavigate();
  const { setProfile } = useProfile();

  function handleSelectPlan(plan: string) {
    setProfile({
      plan: plan as any,
      links: [],
      displayName: "",
      bio: "",
      avatarUrl: undefined,
    });
    navigate("/create-link-in-bio");
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card className="w-full max-w-xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">📝 Test Signup</CardTitle>
          <p className="text-center text-gray-600">Pick a plan to test the Link-in-Bio builder. No signup required.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            {PLANS.map((plan) => (
              <div key={plan.id} className="border rounded-lg p-4 flex flex-col items-center bg-white">
                <div className="text-xl font-bold mb-2">{plan.name}</div>
                <ul className="text-sm text-gray-700 space-y-1 mb-4">
                  {plan.features.map(f => <li key={f}>• {f}</li>)}
                </ul>
                <Button className="w-full bg-gradient-to-r from-primary to-blue-600" onClick={() => handleSelectPlan(plan.id)}>
                  Test as {plan.name}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
};

export default TestSignup;
