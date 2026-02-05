import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, TestTube, Eye, EyeOff } from "lucide-react";
import { useMockPiAuth } from "@/hooks/useMockPiAuth";
import { useToast } from "@/hooks/use-toast";

interface MockEmailAuthFormProps {
  mode: 'login' | 'signup';
  onSuccess?: () => void;
  onSwitchMode?: () => void;
}

const MockEmailAuthForm: React.FC<MockEmailAuthFormProps> = ({ 
  mode, 
  onSuccess, 
  onSwitchMode 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { handleEmailLogin, handleEmailSignup, emailAuthenticating, error } = useMockPiAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      let result;
      
      if (mode === 'login') {
        result = await handleEmailLogin(email, password);
      } else {
        result = await handleEmailSignup(email, password);
      }

      if (result) {
        toast({
          title: mode === 'login' ? "Welcome back!" : "Welcome to Droplink!",
          description: `Successfully ${mode === 'login' ? 'signed in' : 'created account'} as ${result.user.username}`,
        });
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      setFormError(err.message || `Failed to ${mode}`);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <TestTube className="w-8 h-8 text-blue-600 mr-2" />
          <CardTitle className="text-xl">
            {mode === 'login' ? 'Sign In' : 'Create Account'} (Mock)
          </CardTitle>
        </div>
        <p className="text-sm text-gray-600">
          {mode === 'login' 
            ? 'Sign in with your email and password' 
            : 'Create a new account with email and password'
          }
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <Alert variant="destructive">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
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
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={emailAuthenticating}
          >
            {emailAuthenticating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4 mr-2" />
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </>
            )}
          </Button>
        </form>

        {onSwitchMode && (
          <div className="mt-4 text-center">
            <Button
              type="button"
              variant="link"
              onClick={onSwitchMode}
              className="text-sm"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </Button>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 text-center">
            <strong>Mock Mode:</strong> This is a development/testing environment. 
            No real authentication is performed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MockEmailAuthForm; 