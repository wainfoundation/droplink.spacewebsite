import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Pi, ArrowRight, Loader2, Crown, Zap, Star } from "lucide-react";
import UnifiedPiAuthButton from "@/components/UnifiedPiAuthButton";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoToTop from "@/components/GoToTop";
import { getPiConfig } from "@/utils/pi-config";
import { createPiPayment } from "@/utils/pi-sdk";
import { approvePiPayment, completePiPayment } from "@/services/piPaymentService";
import { mainnetPaymentService } from '@/services/mainnetPaymentService';
import PiPaymentButton from '@/components/PiPaymentButton';
import Logo from "@/components/ui/Logo";

// Plan definitions
const PLANS = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    description: 'Perfect for getting started with basic link sharing',
    features: [
      '1 Link Only',
      'Basic Profile',
      'Pi Ads Shown',
      '3 Basic Templates'
    ],
    popular: false,
    badge: 'Free'
  },
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 10,
    description: 'Great for creators who want .pi domains and unlimited links',
    features: [
      'Unlimited Links',
      '.pi Domain Access',
      'Pi Tips Enabled',
      'No Ads',
      '33+ Templates',
      'QR Code Generation',
      'Basic Analytics'
    ],
    popular: true,
    badge: 'Popular'
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 20,
    description: 'For serious creators who want to sell digital products',
    features: [
      'Everything in Starter',
      'Digital Product Sales',
      'Advanced Analytics',
      'SEO Tools',
      '66+ Premium Templates',
      'Priority Support',
      'Custom Themes'
    ],
    popular: false,
    badge: 'Advanced'
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 30,
    description: 'For businesses wanting full customization and API access',
    features: [
      'Everything in Pro',
      'Sell Products with Pi',
      'Custom CSS & Themes',
      'API Access',
      'White-label Option',
      'Team Access (up to 3 users)',
      'Priority 24/7 Support',
      'Data Export & Historical Analytics'
    ],
    popular: false,
    badge: 'Enterprise'
  }
];

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, user, profile, refreshUserData } = useUser();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<'auth' | 'authenticated' | 'plan' | 'payment' | 'complete'>('auth');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'init' | 'processing' | 'success' | 'error'>('init');

  // Get Pi configuration
  const config = getPiConfig();

  // Redirect if already logged in and has a plan
  useEffect(() => {
    console.log('Auth: useEffect triggered - isLoggedIn:', isLoggedIn, 'user:', user, 'profile:', profile);
    
    // Pi Browser mobile detection and optimization
    const isPiMobile = /pibrowser|pi network|pi-browser/i.test(navigator.userAgent) && 
                      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isPiMobile) {
      console.log('Auth: Pi Browser mobile detected - applying mobile optimizations');
      
      // Apply mobile-specific optimizations
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
      
      // Prevent zoom on input focus for mobile
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('focus', function() {
          const viewport = document.querySelector('meta[name="viewport"]');
          if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
          }
        });
      });
    }
    
    if (isLoggedIn && user) {
      // Check for stored plan in localStorage first
      const storedPlan = localStorage.getItem('user_plan');
      if (storedPlan) {
        try {
          const planData = JSON.parse(storedPlan);
          const isExpired = new Date(planData.expiresAt) < new Date();
          
          if (!isExpired && planData.userId === user.id) {
            // User has a valid plan, go to dashboard
            console.log('User has valid stored plan, redirecting to dashboard');
            navigate('/dashboard');
            return;
          }
        } catch (error) {
          console.error('Error parsing stored plan:', error);
        }
      }
      
      // Check profile plan
      if (profile?.plan && profile.plan !== 'free') {
        // User already has a paid plan, go to dashboard
        console.log('User has paid plan in profile, redirecting to dashboard');
        navigate('/dashboard');
      } else {
        // User is logged in but needs to select a plan
        console.log('User logged in but no plan, showing plan selection');
        setAuthStep('plan');
      }
    }
  }, [isLoggedIn, user, profile, navigate]);

      const handleAuthSuccess = async () => {
        setIsAuthenticating(false);
        console.log('Auth: handleAuthSuccess called');
        console.log('Auth: Current user before refresh:', user);
        
        // Force refresh user data - simplified for testing
        await refreshUserData();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Auth: User after refresh:', user);
        console.log('Auth: isLoggedIn:', isLoggedIn);
        
        // Check if we have a Pi auth result stored
        const piAuthResult = localStorage.getItem('pi_auth_result');
        if (piAuthResult) {
          console.log('Auth: Found Pi auth result in localStorage:', piAuthResult);
          try {
            const authData = JSON.parse(piAuthResult);
            console.log('Auth: Parsed Pi auth data:', authData);
            
            // Set flag to show ad modal after authentication
            sessionStorage.setItem('pi_just_authenticated', 'true');
            
            // Show success message for real Pi authentication
            toast({
              title: "Pi Network Authentication Successful!",
              description: `Welcome, ${authData.user?.username || 'Pi User'}! Connected to Pi Network.`,
            });
          } catch (error) {
            console.error('Error parsing Pi auth result:', error);
          }
        }
    
    // Check if user already has a plan
    const existingPlan = localStorage.getItem('user_plan');
    console.log('Auth: Existing plan in localStorage:', existingPlan);
    
    if (existingPlan) {
      try {
        const planData = JSON.parse(existingPlan);
        const isExpired = new Date(planData.expiresAt) < new Date();
        
        console.log('Auth: Plan data:', planData);
        console.log('Auth: Is plan expired:', isExpired);
        console.log('Auth: Plan userId vs current user id:', planData.userId, user?.id);
        
        if (!isExpired && planData.userId === user?.id) {
          // User has a valid plan, redirect immediately to dashboard
          console.log('Auth: User has valid plan, redirecting to dashboard immediately');
          toast({
            title: "Welcome Back!",
            description: `You already have a ${planData.planId} plan. Redirecting to dashboard...`,
          });
          
          // Redirect immediately without showing authenticated step
          setTimeout(() => {
            navigate('/dashboard');
          }, 500);
          return;
        }
      } catch (error) {
        console.error('Error parsing existing plan:', error);
      }
    }
    
    console.log('Auth: No valid plan found, redirecting to plan selection immediately');
    
    // For new users or users without plans, go directly to plan selection
    setTimeout(() => {
      setAuthStep('plan');
    }, 1000);
  };

  const handleAuthError = () => {
    setIsAuthenticating(false);
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
    const plan = PLANS.find(p => p.id === planId);
    
    if (plan?.price === 0) {
      // Free plan - no payment needed
      handleFreePlanSelection(planId);
    } else {
      // Paid plan - proceed to payment
      setAuthStep('payment');
    }
  };

  const handleFreePlanSelection = async (planId: string) => {
    try {
      setIsProcessingPayment(true);
      
      // Update user profile with free plan
      // This would typically call your backend API
      console.log('Setting up free plan for user:', user?.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAuthStep('complete');
      
      toast({
        title: "Free Plan Activated!",
        description: "Your free plan has been set up successfully.",
      });
      
      // Force refresh user data before navigation
      await refreshUserData();
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('Error setting up free plan:', error);
      toast({
        title: "Setup Failed",
        description: "Failed to set up your free plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    
    const plan = PLANS.find(p => p.id === selectedPlan);
    if (!plan || plan.price === 0) return;

    setIsProcessingPayment(true);
    setPaymentStep('processing');

    try {
      console.log('Processing MAINNET payment for plan:', plan);
      console.log('Current user:', user);
      
      // Check if Pi SDK is available
      if (!window.Pi) {
        throw new Error("Pi Network SDK not available");
      }
      
      // Create payment data for Pi Network
      const paymentData = {
        amount: plan.price,
        memo: `Droplink ${plan.name} plan subscription`,
        metadata: {
          planId: plan.id,
          planName: plan.name,
          userId: user?.id,
          app: 'droplink',
          timestamp: Date.now()
        }
      };
      
      // Use mainnet payment service with proper callbacks
      const result = await mainnetPaymentService.createPayment(
        {
          amount: plan.price,
          memo: `Droplink ${plan.name} plan subscription`,
          metadata: {
            planId: plan.id,
            planName: plan.name,
            userId: user?.id,
            app: 'droplink'
          }
        },
        {
          onReadyForServerApproval: (paymentId: string) => {
            console.log('Payment ready for approval:', paymentId);
            toast({
              title: "Payment Ready",
              description: "Your payment is ready for approval in Pi Wallet.",
            });
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            console.log('Payment completed:', paymentId, txid);
            
            // Update user plan after successful payment completion
            await updateUserPlan(selectedPlan);
            
            setPaymentStep('success');
            setAuthStep('complete');
            
            toast({
              title: 'Payment Successful!',
              description: `You have been upgraded to ${plan.name}!`,
            });
            
            // Force refresh user data and navigate to dashboard
            setTimeout(async () => {
              await refreshUserData();
              navigate('/dashboard');
            }, 2000);
          },
          onCancel: (paymentId: string) => {
            console.log('Payment cancelled:', paymentId);
            setPaymentStep('error');
            setIsProcessingPayment(false);
            toast({
              title: 'Payment Cancelled',
              description: 'Payment was cancelled. Please try again.',
              variant: 'destructive',
            });
          },
          onError: (error: any, payment: any) => {
            console.error('Payment error:', error, payment);
            setPaymentStep('error');
            setIsProcessingPayment(false);
            toast({
              title: 'Payment Error',
              description: 'An error occurred during payment. Please try again.',
              variant: 'destructive',
            });
          }
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Payment failed');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStep('error');
      setIsProcessingPayment(false);
      toast({
        title: 'Payment Failed',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const updateUserPlan = async (planId: string) => {
    try {
      // This would typically call your backend API to update the user's plan
      console.log('updateUserPlan: Updating user plan to:', planId);
      console.log('updateUserPlan: Current user:', user);
      
      // Store plan in localStorage for persistence
      const userPlanData = {
        planId,
        userId: user?.id,
        updatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
      };
      
      console.log('updateUserPlan: Storing plan data:', userPlanData);
      localStorage.setItem('user_plan', JSON.stringify(userPlanData));
      
      // Verify the plan was stored
      const storedPlan = localStorage.getItem('user_plan');
      console.log('updateUserPlan: Verified stored plan:', storedPlan);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh user data
      await refreshUserData();
      
      console.log('updateUserPlan: Plan update completed');
      
    } catch (error) {
      console.error('Error updating user plan:', error);
      throw error;
    }
  };

  // Pi Network Payment Success Handler
  const handlePaymentSuccess = async (result: any) => {
    console.log('Pi Network payment successful:', result);
    
    try {
      // Update user plan
      await updateUserPlan(selectedPlan);
      
      // Show success message
      toast({
        title: "Payment Successful!",
        description: `Welcome to ${PLANS.find(p => p.id === selectedPlan)?.name}!`,
      });
      
      // Move to complete step
      setAuthStep('complete');
      
    } catch (error: any) {
      console.error('Error after payment success:', error);
      toast({
        title: "Payment Success, Setup Error",
        description: "Payment completed but there was an issue setting up your account. Please contact support.",
        variant: "destructive"
      });
    }
  };

  // Pi Network Payment Error Handler
  const handlePaymentError = (error: any) => {
    console.error('Pi Network payment failed:', error);
    
    toast({
      title: "Payment Failed",
      description: error.message || "Payment could not be processed. Please try again.",
      variant: "destructive"
    });
    
    // Reset payment state
    setIsProcessingPayment(false);
    setPaymentStep('init');
  };

  const getStepContent = () => {
    switch (authStep) {
      case 'auth':
        return (
          <div className="text-center space-y-6">
            {/* Authentication Description */}
            <div className="text-center mb-6">
              <h3 className="font-semibold text-gray-900 text-lg">Pi Network Authentication</h3>
              <p className="text-sm text-gray-600">Secure, decentralized, and seamless</p>
            </div>
            
            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>No passwords to remember</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Enhanced security with blockchain</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Seamless Pi payments integration</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Access to Pi Network ecosystem</span>
              </div>
            </div>
            
            {/* Pi Network Authentication Button */}
            <div className="pt-4 space-y-3">
              <UnifiedPiAuthButton 
                onAuthSuccess={handleAuthSuccess}
                onAuthError={handleAuthError}
              />
              
              {/* Pi Network Button - Disabled */}
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Secure authentication with Pi Network
                </p>
              </div>
            </div>
            
            {/* Mainnet Mode Info */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Badge variant="outline" className="text-xs border-green-600 text-green-600">
                MAINNET
              </Badge>
              <span>Pi Network Mainnet Production</span>
            </div>
            
            {/* Mainnet Mode Info */}
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                <strong>Mainnet Mode:</strong> Pi Network authentication and payments on mainnet. 
                Real Pi tokens and transactions.
              </AlertDescription>
            </Alert>
            
            {/* Download Pi Browser Button */}
            <div className="pt-4">
              <Button
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => window.open('https://minepi.com/Wain2020', '_blank')}
              >
                <Pi className="w-4 h-4 mr-2" />
                Download Pi Browser
              </Button>
            </div>
          </div>
        );

      case 'authenticated':
        // Check if user has existing plan
        const existingPlan = localStorage.getItem('user_plan');
        const hasExistingPlan = existingPlan && (() => {
          try {
            const planData = JSON.parse(existingPlan);
            const isExpired = new Date(planData.expiresAt) < new Date();
            return !isExpired && planData.userId === user?.id;
          } catch {
            return false;
          }
        })();

        return (
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            {/* Welcome Message */}
            <div>
              <h3 className="font-semibold text-xl text-green-600 mb-2">Welcome, {user?.user_metadata?.username || user?.user_metadata?.pi_username || profile?.username || user?.email?.split('@')[0] || 'User'}!</h3>
              <p className="text-sm text-gray-600">
                {hasExistingPlan ? 'You already have an active plan' : 'You\'ve successfully signed in with Pi Network'}
              </p>
            </div>
            
            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Username:</span>
                <span className="font-medium">{user?.user_metadata?.username || user?.user_metadata?.pi_username || profile?.username || user?.email?.split('@')[0] || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">User ID:</span>
                <span className="font-mono text-xs">{user?.id?.slice(0, 8)}...</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Wallet Address:</span>
                <span className="font-mono text-xs">
                  {user?.user_metadata?.wallet_address ? 
                    `${user.user_metadata.wallet_address.slice(0, 6)}...${user.user_metadata.wallet_address.slice(-4)}` : 
                    'Not set'
                  }
                </span>
              </div>
              {hasExistingPlan && (() => {
                try {
                  const planData = JSON.parse(existingPlan);
                  return (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Active Plan:</span>
                      <span className="font-medium text-green-600">{planData.planId}</span>
                    </div>
                  );
                } catch {
                  return null;
                }
              })()}
            </div>
            
            {/* Loading Message */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{hasExistingPlan ? 'Redirecting to dashboard...' : 'Setting up your account...'}</span>
            </div>
          </div>
        );

      case 'plan':
        return (
          <div className="space-y-4">
            {/* User Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900">Signed in as {user?.user_metadata?.username || user?.user_metadata?.pi_username || profile?.username || user?.email?.split('@')[0] || 'User'}</h4>
                  <p className="text-sm text-green-700">Choose your plan to continue</p>
                </div>
              </div>
            </div>

            {/* Demo Link */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">Try Interactive Demo</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Experience all plans with our interactive demo before choosing
                </p>
                <Button 
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Link to="/demo">
                    Launch Demo
                  </Link>
                </Button>
              </div>
            </div>

            {/* Plan Selection */}
            {PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  plan.popular 
                    ? 'border-2 border-blue-300 bg-blue-50 hover:border-blue-400' 
                    : 'hover:border-blue-300'
                }`}
                onClick={() => handlePlanSelection(plan.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <Badge 
                    variant={plan.popular ? "default" : "secondary"}
                    className={plan.popular ? "bg-blue-600" : ""}
                  >
                    {plan.badge}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {plan.description}
                </p>
                <ul className="text-sm text-gray-700 space-y-1 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
                <Button 
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                >
                  {plan.price === 0 ? 'Start Free' : `Choose ${plan.name}`}
                </Button>
              </div>
            ))}
          </div>
        );

      case 'payment':
        const selectedPlanData = PLANS.find(p => p.id === selectedPlan);
        return (
          <div className="space-y-4">
            {/* User Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Paying as {user?.user_metadata?.username || 'User'}</h4>
                  <p className="text-sm text-blue-700">Complete your payment to activate your plan</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="w-8 h-8 text-yellow-500" />
                <h3 className="text-xl font-semibold">Upgrade to {selectedPlanData?.name}</h3>
              </div>
              <p className="text-gray-600 mb-6">
                {selectedPlanData?.description}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Plan Price:</span>
                <span className="font-semibold">{selectedPlanData?.price} π</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment Method:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Pi Network</span>
                  <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                    Mainnet
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">What you'll get:</h4>
              <ul className="space-y-1 text-sm">
                {selectedPlanData?.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              {/* Pi Network Payment Button */}
              <PiPaymentButton
                planId={selectedPlan}
                planName={selectedPlanData?.name || ''}
                amount={selectedPlanData?.price || 0}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                disabled={isProcessingPayment}
              />
              
              {/* Back Button */}
              <Button
                onClick={() => setAuthStep('plan')}
                variant="outline"
                disabled={isProcessingPayment}
                className="w-full"
              >
                Back
              </Button>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-green-600 mb-2">Welcome to Droplink, {user?.user_metadata?.username || 'User'}!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your {PLANS.find(p => p.id === selectedPlan)?.name} plan is now active. 
                Let's set up your profile to get started.
              </p>
            </div>
            
            {/* User Plan Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900">{PLANS.find(p => p.id === selectedPlan)?.name} Plan Active</h4>
                  <p className="text-sm text-green-700">Ready to set up your profile</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
              >
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Go to Dashboard Setup
                </div>
              </Button>
              
              <p className="text-xs text-gray-500">
                You'll be guided through setting up your profile, links, and preferences.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (authStep) {
      case 'auth':
        return 'Sign In with Pi Network';
      case 'authenticated':
        return 'Authentication Successful';
      case 'plan':
        return 'Choose Your Plan';
      case 'payment':
        return 'Complete Payment';
      case 'complete':
        return 'Welcome to Droplink!';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (authStep) {
      case 'auth':
        return 'Sign in securely with your Pi Network account';
      case 'authenticated':
        return `Welcome back, ${user?.user_metadata?.username || 'User'}!`;
      case 'plan':
        return 'Select the plan that best fits your needs';
      case 'payment':
        return 'Complete your payment to activate your plan';
      case 'complete':
        return 'Setting up your account...';
      default:
        return '';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
        <Navbar />
        
        <main className="flex-grow flex items-center justify-center p-4" style={{ minHeight: 'calc(var(--vh, 1vh) * 100 - 80px)' }}>
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-6">
                {/* Droplink Logo */}
                <div className="flex items-center justify-center mb-4">
                  <Logo />
                </div>

                {/* Step Title and Description */}
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {getStepTitle()}
                </CardTitle>
                <p className="text-gray-600">
                  {getStepDescription()}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {getStepContent()}
                
                <Separator />
                
                {authStep === 'auth' && (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                      By continuing, you agree to our{" "}
                      <a href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
        <GoToTop />
      </div>
    </>
  );
};

export default Auth;
