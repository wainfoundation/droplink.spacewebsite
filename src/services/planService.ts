/**
 * Plan Service - Handles plan selection and subscription management
 */

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  popular?: boolean;
  recommended?: boolean;
}

export interface PlanSelectionResult {
  success: boolean;
  plan?: Plan;
  error?: string;
}

export const AVAILABLE_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    currency: 'π',
    interval: 'lifetime',
    features: [
      '1 Link Only',
      'Basic Profile',
      'Pi Ads Shown',
      'Droplink Badge',
      '3 Basic Templates'
    ]
  },
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 10,
    currency: 'π',
    interval: 'monthly',
    features: [
      'Unlimited Links',
      '.pi Domain Access',
      'Pi Tips Enabled',
      'No Ads',
      'QR Codes',
      'Basic Analytics',
      'Email Support',
      '33+ Templates',
      'Custom Button Styles'
    ],
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 20,
    currency: 'π',
    interval: 'monthly',
    features: [
      'Everything in Starter',
      'Digital Product Sales',
      'Advanced Analytics',
      'SEO Tools',
      'Link Scheduling',
      'Custom Themes',
      '66+ Premium Templates',
      'Email/Phone Collection',
      'Location Analytics',
      'Hide Droplink Branding'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 30,
    currency: 'π',
    interval: 'monthly',
    features: [
      'Everything in Pro',
      'Sell Products with Pi',
      'Priority Support',
      'Custom CSS',
      'API Access',
      '99+ Exclusive Templates',
      'White-label Option',
      'Historical Analytics',
      'Team Access',
      'Data Export'
    ],
    recommended: true
  }
];

/**
 * Select a plan for the user
 */
export const selectPlan = async (planId: string, userId: string): Promise<PlanSelectionResult> => {
  try {
    console.log(`Selecting plan ${planId} for user ${userId}`);
    
    const plan = AVAILABLE_PLANS.find(p => p.id === planId);
    if (!plan) {
      return {
        success: false,
        error: 'Plan not found'
      };
    }

    // Here you would typically:
    // 1. Update user's subscription in database
    // 2. Handle payment processing for paid plans
    // 3. Set up plan-specific features
    // 4. Send confirmation email
    
    // For now, we'll simulate the process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Successfully selected plan ${planId} for user ${userId}`);
    
    return {
      success: true,
      plan
    };
    
  } catch (error) {
    console.error('Error selecting plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to select plan'
    };
  }
};

/**
 * Get plan by ID
 */
export const getPlanById = (planId: string): Plan | undefined => {
  return AVAILABLE_PLANS.find(plan => plan.id === planId);
};

/**
 * Get recommended plan
 */
export const getRecommendedPlan = (): Plan | undefined => {
  return AVAILABLE_PLANS.find(plan => plan.recommended);
};

/**
 * Get popular plan
 */
export const getPopularPlan = (): Plan | undefined => {
  return AVAILABLE_PLANS.find(plan => plan.popular);
};

/**
 * Format plan price for display
 */
export const formatPlanPrice = (plan: Plan): string => {
  if (plan.price === 0) {
    return 'Free';
  }
  
  const price = plan.price.toFixed(0);
  const interval = plan.interval === 'monthly' ? '/month' : 
                   plan.interval === 'yearly' ? '/year' : '';
  
  return `${price}π${interval}`;
};

/**
 * Get plan features as a formatted list
 */
export const getPlanFeatures = (plan: Plan): string[] => {
  return plan.features;
};
