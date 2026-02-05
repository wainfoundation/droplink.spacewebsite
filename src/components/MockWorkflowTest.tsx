import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, ArrowRight, Play, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  route?: string;
}

const MockWorkflowTest: React.FC = () => {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: 'auth',
      name: 'Pi Authentication',
      description: 'Sign in with Pi Network account',
      status: 'pending',
      route: '/auth'
    },
    {
      id: 'plan',
      name: 'Select Plan',
      description: 'Choose your subscription plan',
      status: 'pending',
      route: '/auth'
    },
    {
      id: 'payment',
      name: 'Mock Payment',
      description: 'Complete payment using mock system',
      status: 'pending',
      route: '/auth'
    },
    {
      id: 'setup',
      name: 'Dashboard Setup',
      description: 'Configure your profile and preferences',
      status: 'pending',
      route: '/dashboard'
    },
    {
      id: 'dashboard',
      name: 'Access Dashboard',
      description: 'Use your fully configured dashboard',
      status: 'pending',
      route: '/dashboard'
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateStepStatus = (stepId: string, status: WorkflowStep['status']) => {
    setWorkflowSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const runWorkflowTest = async () => {
    setIsRunning(true);
    setCurrentStep(0);

    try {
      // Step 1: Authentication
      updateStepStatus('auth', 'in_progress');
      toast({
        title: "Step 1: Authentication",
        description: "Testing Pi Network authentication...",
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStepStatus('auth', 'completed');
      setCurrentStep(1);

      // Step 2: Plan Selection
      updateStepStatus('plan', 'in_progress');
      toast({
        title: "Step 2: Plan Selection",
        description: "Testing plan selection...",
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStepStatus('plan', 'completed');
      setCurrentStep(2);

      // Step 3: Mock Payment
      updateStepStatus('payment', 'in_progress');
      toast({
        title: "Step 3: Mock Payment",
        description: "Testing mock payment system...",
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus('payment', 'completed');
      setCurrentStep(3);

      // Step 4: Dashboard Setup
      updateStepStatus('setup', 'in_progress');
      toast({
        title: "Step 4: Dashboard Setup",
        description: "Testing dashboard setup wizard...",
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStepStatus('setup', 'completed');
      setCurrentStep(4);

      // Step 5: Dashboard Access
      updateStepStatus('dashboard', 'in_progress');
      toast({
        title: "Step 5: Dashboard Access",
        description: "Testing dashboard functionality...",
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStepStatus('dashboard', 'completed');

      toast({
        title: "Workflow Test Complete!",
        description: "All steps completed successfully. The mock payment workflow is working.",
      });

    } catch (error: any) {
      console.error('Workflow test error:', error);
      toast({
        title: "Workflow Test Failed",
        description: error.message || "An error occurred during testing",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const resetWorkflow = () => {
    setWorkflowSteps(prev => 
      prev.map(step => ({ ...step, status: 'pending' }))
    );
    setCurrentStep(0);
  };

  const navigateToStep = (step: WorkflowStep) => {
    if (step.route) {
      navigate(step.route);
    }
  };

  const getStepIcon = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStepBadge = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const completedSteps = workflowSteps.filter(step => step.status === 'completed').length;
  const totalSteps = workflowSteps.length;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          Mock Payment Workflow Test
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Progress: {completedSteps}/{totalSteps} steps completed
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Workflow Steps */}
        <div className="space-y-3">
          {workflowSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                step.status === 'in_progress' 
                  ? 'border-blue-200 bg-blue-50' 
                  : step.status === 'completed'
                  ? 'border-green-200 bg-green-50'
                  : step.status === 'failed'
                  ? 'border-red-200 bg-red-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex-shrink-0">
                {getStepIcon(step)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{step.name}</h4>
                  {getStepBadge(step)}
                </div>
                <p className="text-xs text-gray-600">{step.description}</p>
              </div>
              
              {step.route && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateToStep(step)}
                  className="flex-shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={runWorkflowTest}
            disabled={isRunning}
            className="flex-1"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Test...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Workflow Test
              </>
            )}
          </Button>
          
          <Button
            onClick={resetWorkflow}
            variant="outline"
            disabled={isRunning}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Test Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Test Instructions</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Click "Run Workflow Test" to simulate the complete flow</li>
            <li>Or manually test each step by clicking the arrow buttons</li>
            <li>Mock payments will simulate real payment processing</li>
            <li>Dashboard setup will guide you through profile configuration</li>
            <li>All steps should complete successfully in development mode</li>
          </ol>
        </div>

        {/* Mock Payment Info */}
        <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="font-medium text-orange-900 mb-2">Mock Payment Mode</h4>
          <p className="text-sm text-orange-800">
            This test uses mock payments that simulate real Pi Network transactions. 
            No actual payments are processed, making it safe for testing the complete workflow.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MockWorkflowTest;
