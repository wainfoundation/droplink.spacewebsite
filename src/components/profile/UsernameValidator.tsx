// Username Validation Component
// Provides real-time username validation and suggestions

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  Copy,
  Sparkles
} from 'lucide-react';
import { usernameService, UsernameValidationResult } from '@/services/usernameService';
import { useToast } from '@/hooks/use-toast';

interface UsernameValidatorProps {
  initialUsername?: string;
  onUsernameChange?: (username: string, isValid: boolean) => void;
  onUsernameSelect?: (username: string) => void;
  excludeUserId?: string;
  className?: string;
}

const UsernameValidator: React.FC<UsernameValidatorProps> = ({
  initialUsername = '',
  onUsernameChange,
  onUsernameSelect,
  excludeUserId,
  className
}) => {
  const { toast } = useToast();
  const [username, setUsername] = useState(initialUsername);
  const [validation, setValidation] = useState<UsernameValidationResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Validate username with debouncing
  const validateUsername = useCallback(async (inputUsername: string) => {
    if (!inputUsername.trim()) {
      setValidation(null);
      setSuggestions([]);
      return;
    }

    setIsChecking(true);
    
    try {
      const result = await usernameService.checkUsernameAvailability(inputUsername, {
        excludeUserId
      });
      
      setValidation(result);
      
      if (!result.isAvailable && result.suggestions) {
        setSuggestions(result.suggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Username validation failed:', error);
      setValidation({
        isValid: false,
        isAvailable: false,
        error: 'Failed to validate username'
      });
    } finally {
      setIsChecking(false);
    }
  }, [excludeUserId]);

  // Handle username input change
  const handleUsernameChange = (value: string) => {
    setUsername(value);
    
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Set new timer for debounced validation
    const timer = setTimeout(() => {
      validateUsername(value);
    }, 500);
    
    setDebounceTimer(timer);
    
    // Notify parent component
    if (onUsernameChange) {
      onUsernameChange(value, false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setUsername(suggestion);
    validateUsername(suggestion);
    
    if (onUsernameSelect) {
      onUsernameSelect(suggestion);
    }
    
    toast({
      title: "Username Selected",
      description: `Selected username: ${suggestion}`,
    });
  };

  // Generate suggestions from full name
  const generateSuggestionsFromName = async (fullName: string) => {
    if (!fullName.trim()) return;
    
    try {
      const nameSuggestions = await usernameService.getUsernameSuggestions(fullName);
      setSuggestions(nameSuggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    }
  };

  // Copy username to clipboard
  const copyUsername = () => {
    navigator.clipboard.writeText(username).then(() => {
      toast({
        title: "Username Copied",
        description: "Username copied to clipboard",
      });
    });
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Update parent when validation changes
  useEffect(() => {
    if (onUsernameChange && validation) {
      onUsernameChange(username, validation.isValid && validation.isAvailable);
    }
  }, [validation, username, onUsernameChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Choose Your Username</span>
            {validation?.isValid && validation?.isAvailable && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Available
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="Enter your username"
                className={`pr-10 ${
                  validation?.isValid && validation?.isAvailable
                    ? 'border-green-500 focus:border-green-500'
                    : validation?.isValid === false
                    ? 'border-red-500 focus:border-red-500'
                    : ''
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isChecking ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : validation?.isValid && validation?.isAvailable ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : validation?.isValid === false ? (
                  <XCircle className="w-4 h-4 text-red-500" />
                ) : null}
              </div>
            </div>
            
            {/* Username preview */}
            {username && (
              <div className="mt-2 text-sm text-gray-600">
                Your profile will be available at: <br />
                <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">
                  https://droplink.space/{username}
                </code>
                <Button
                  onClick={copyUsername}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
            )}
          </div>

          {/* Validation message */}
          {validation && (
            <div className={`p-3 rounded-lg ${
              validation.isValid && validation.isAvailable
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                {validation.isValid && validation.isAvailable ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${
                  validation.isValid && validation.isAvailable
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}>
                  {validation.isValid && validation.isAvailable
                    ? 'Great! This username is available'
                    : validation.error || 'Username validation failed'}
                </span>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Suggested usernames:
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="justify-start text-left"
                  >
                    <Sparkles className="w-3 h-3 mr-2" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Generate from name */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Or generate from your name:
            </Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter your full name"
                onChange={(e) => {
                  if (e.target.value.trim()) {
                    generateSuggestionsFromName(e.target.value);
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={() => generateSuggestionsFromName('')}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Username requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Username Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 3-30 characters long</li>
            <li>• Only letters, numbers, underscores, and hyphens</li>
            <li>• Cannot start or end with special characters</li>
            <li>• Must be unique and available</li>
            <li>• Cannot use reserved words</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsernameValidator;
