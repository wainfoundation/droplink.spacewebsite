
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, EyeOff as EyeOffIcon } from "lucide-react";
import { useEmailAuth } from "@/hooks/useEmailAuth";
import { validatePasswordSecurity } from "@/services/passwordSecurityService";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { PasswordSecurityInfo } from "./PasswordSecurityInfo";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function EmailSignupFormContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean;
    message?: string;
    isCompromised?: boolean;
  } | null>(null);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  
  const { handleSignup, isSubmitting } = useEmailAuth();
  const { toast } = useToast();

  console.log("EmailSignupFormContent rendered", {
    email,
    password,
    username,
    firstName,
    lastName,
    agreeToTerms,
    isSubmitting
  });

  // Validate password in real-time with debouncing
  useEffect(() => {
    if (!password) {
      setPasswordValidation(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsCheckingPassword(true);
      try {
        const validation = await validatePasswordSecurity(password);
        setPasswordValidation(validation);
      } catch (error) {
        console.error("Password validation error:", error);
        setPasswordValidation({ isValid: true }); // Allow password if validation fails
      } finally {
        setIsCheckingPassword(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submission started");
    console.log("Form data:", { email, password, username, firstName, lastName, agreeToTerms });
    
    // Validate inputs
    if (!email || !password || !username || !firstName || !lastName) {
      console.log("Missing required fields");
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      console.log("Passwords don't match");
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      console.log("Password too short");
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    // Check password security validation
    if (passwordValidation && !passwordValidation.isValid) {
      console.log("Password validation failed");
      toast({
        title: "Weak Password",
        description: passwordValidation.message || "Please choose a stronger password",
        variant: "destructive",
      });
      return;
    }

    if (!agreeToTerms) {
      console.log("Terms not agreed");
      toast({
        title: "Terms Not Accepted",
        description: "Please agree to the Terms of Service and Privacy Policy",
        variant: "destructive",
      });
      return;
    }

    console.log("All validations passed, calling handleSignup");
    
    try {
      await handleSignup({
        email,
        password,
        username,
        firstName,
        lastName,
        marketingConsent
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: "An error occurred while creating your account",
        variant: "destructive",
      });
    }
  };

  // Check if button should be disabled
  const isButtonDisabled = isSubmitting || 
    !agreeToTerms || 
    password !== confirmPassword || 
    password.length < 8 ||
    !email ||
    !username ||
    !firstName ||
    !lastName;

  console.log("Button disabled:", isButtonDisabled, {
    isSubmitting,
    agreeToTerms,
    passwordMatch: password === confirmPassword,
    passwordLength: password.length,
    hasEmail: !!email,
    hasUsername: !!username,
    hasFirstName: !!firstName,
    hasLastName: !!lastName
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username *</Label>
        <Input
          id="username"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          required
        />
        <p className="text-xs text-gray-500">
          Your profile will be available at droplink.space/@{username || 'username'}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
        {password && (
          <PasswordStrengthMeter password={password} />
        )}
        {passwordValidation && (
          <PasswordSecurityInfo 
            isCompromised={passwordValidation.isCompromised}
            showInfo={!passwordValidation.isValid}
            isChecking={isCheckingPassword}
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOffIcon className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
        {confirmPassword && password !== confirmPassword && (
          <div className="text-red-600 text-sm">Passwords don't match</div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
          />
          <div className="space-y-1">
            <Label htmlFor="terms" className="text-sm">
              I agree to the Terms of Service and Privacy Policy *
            </Label>
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our terms and privacy policy.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox 
            id="marketing" 
            checked={marketingConsent}
            onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
          />
          <div className="space-y-1">
            <Label htmlFor="marketing" className="text-sm">
              Send me updates about new features and tips
            </Label>
            <p className="text-xs text-gray-500">
              We'll send you helpful tips and updates about new features.
            </p>
          </div>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-hero hover:bg-secondary" 
        disabled={isButtonDisabled}
        onClick={() => console.log("Button clicked!")}
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </Button>
      
      {/* Debug info - remove in production */}
      <div className="text-xs text-gray-500 mt-2">
        <p>Debug: Button disabled = {isButtonDisabled.toString()}</p>
        <p>Form filled: {email && username && firstName && lastName && password && confirmPassword ? 'Yes' : 'No'}</p>
        <p>Terms agreed: {agreeToTerms ? 'Yes' : 'No'}</p>
        <p>Passwords match: {password === confirmPassword ? 'Yes' : 'No'}</p>
        <p>Password length: {password.length}/8</p>
      </div>
    </form>
  );
}

export default function EmailSignupForm() {
  console.log("EmailSignupForm component rendered");
  return (
    <ErrorBoundary>
      <EmailSignupFormContent />
    </ErrorBoundary>
  );
}
