
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TestTube } from "lucide-react";

export function PiTestNetBanner() {
  // Force mainnet mode - never show testnet banner
  const isTestNet = false; // Force mainnet only
  
  // Don't show banner in mainnet mode
  if (!isTestNet) return null;

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <TestTube className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center gap-2 text-orange-800">
        <Badge variant="outline" className="text-orange-600 border-orange-300">
          TEST NET MODE
        </Badge>
        Pi Network is running in sandbox/test mode. All transactions are simulated.
      </AlertDescription>
    </Alert>
  );
}
