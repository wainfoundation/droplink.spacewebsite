
import { getPasswordStrength } from "@/utils/passwordSecurity";

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { score, strength, color } = getPasswordStrength(password);
  
  // Only show the meter if there's a password
  if (!password) return null;
  
  // Get color and label based on score
  const getStrengthColor = (score: number): string => {
    switch (score) {
      case 0: return "bg-red-500";
      case 1: return "bg-orange-500";
      case 2: return "bg-yellow-500";
      case 3: return "bg-blue-500";
      case 4: return "bg-green-500";
      case 5: return "bg-green-500";
      case 6: return "bg-green-500";
      default: return "bg-gray-300";
    }
  };
  
  const getStrengthLabel = (score: number): string => {
    switch (score) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      case 5: return "Very Strong";
      case 6: return "Excellent";
      default: return "Unknown";
    }
  };
  
  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm text-gray-600">Password Strength: <span className="font-medium">{getStrengthLabel(score)}</span></p>
      </div>
      <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
        {/* Score segments */}
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className={`flex-1 ${index <= score ? getStrengthColor(score) : "bg-gray-200"} ${
              index > 0 ? "ml-0.5" : ""
            }`}
          />
        ))}
      </div>
      {score < 3 && (
        <div className="mt-2 text-xs text-gray-600">
          <p>• Add uppercase and lowercase letters</p>
          <p>• Include numbers and special characters</p>
          <p>• Make it at least 8 characters long</p>
        </div>
      )}
    </div>
  );
}
