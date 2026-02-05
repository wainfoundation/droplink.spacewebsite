import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Flag, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReportingSystemProps {
  contentType: 'profile' | 'post' | 'comment' | 'product' | 'message' | 'other';
  contentId?: string;
  reportedUserId?: string;
  reportedUsername?: string;
  triggerButtonText?: string;
  triggerButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
}

const ReportingSystem: React.FC<ReportingSystemProps> = ({
  contentType,
  contentId,
  reportedUserId,
  reportedUsername,
  triggerButtonText = 'Report',
  triggerButtonVariant = 'outline',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'details' | 'confirm'>('select');
  const [violationType, setViolationType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const violationTypes = [
    { value: 'spam', label: 'Spam or Misleading', icon: '🗑️' },
    { value: 'harassment', label: 'Harassment or Bullying', icon: '😡' },
    { value: 'hate-speech', label: 'Hate Speech', icon: '⚠️' },
    { value: 'violence', label: 'Violence or Threats', icon: '🔴' },
    { value: 'adult-content', label: 'Adult/NSFW Content', icon: '🔞' },
    { value: 'illegal', label: 'Illegal Content', icon: '🚫' },
    { value: 'impersonation', label: 'Impersonation', icon: '🎭' },
    { value: 'copyright', label: 'Copyright Violation', icon: '©️' },
    { value: 'scam', label: 'Scam or Fraud', icon: '💰' },
    { value: 'self-harm', label: 'Self-Harm or Suicide', icon: '❤️' },
    { value: 'child-safety', label: 'Child Safety Concern', icon: '🛡️' },
    { value: 'privacy', label: 'Privacy Violation', icon: '🔒' },
    { value: 'other', label: 'Other Violation', icon: '📋' },
  ];

  const handleSubmit = async () => {
    if (!violationType || !description.trim()) {
      toast({
        title: 'Incomplete Report',
        description: 'Please select a violation type and provide details.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call to submit report
      const reportData = {
        contentType,
        contentId,
        reportedUserId,
        reportedUsername,
        violationType,
        description,
        reporterEmail: reporterEmail || 'anonymous',
        timestamp: new Date().toISOString(),
      };

      console.log('Report submitted:', reportData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitted(true);
      setStep('confirm');

      toast({
        title: 'Report Submitted',
        description: 'Thank you for helping keep Droplink safe. We\'ll review this report within 24-48 hours.',
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          resetForm();
        }, 300);
      }, 3000);

    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your report. Please try again or email report@droplink.space',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep('select');
    setViolationType('');
    setDescription('');
    setReporterEmail('');
    setIsSubmitted(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => resetForm(), 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={triggerButtonVariant} size="sm" className={className}>
          <Flag className="w-4 h-4 mr-2" />
          {triggerButtonText}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Flag className="w-5 h-5 mr-2 text-red-500" />
            Report {contentType === 'profile' ? 'User' : contentType.charAt(0).toUpperCase() + contentType.slice(1)}
          </DialogTitle>
          <DialogDescription>
            Help us maintain a safe community by reporting violations of our{' '}
            <a href="/user-rules" target="_blank" className="text-primary hover:underline">
              User Rules
            </a>
            . Your report will be reviewed confidentially.
          </DialogDescription>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">
                What type of violation are you reporting?
              </Label>
              <RadioGroup value={violationType} onValueChange={setViolationType} className="space-y-2">
                {violationTypes.map((type) => (
                  <div
                    key={type.value}
                    className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => setViolationType(type.value)}
                  >
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Label
                      htmlFor={type.value}
                      className="flex items-center cursor-pointer w-full"
                    >
                      <span className="text-xl mr-2">{type.icon}</span>
                      <span>{type.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {violationType === 'child-safety' && (
              <Alert className="bg-red-50 border-red-300">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Urgent:</strong> Child safety concerns are prioritized. We will review this report immediately
                  and forward to appropriate authorities if necessary. If this is an emergency, please also contact
                  local law enforcement and the National Center for Missing & Exploited Children (CyberTipline.org).
                </AlertDescription>
              </Alert>
            )}

            {violationType === 'self-harm' && (
              <Alert className="bg-yellow-50 border-yellow-300">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  If someone is in immediate danger, please call 911 or the 988 Suicide & Crisis Lifeline.
                  Our team will review this report and reach out to provide resources.
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={() => setStep('details')}
              disabled={!violationType}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-2 block">
                Provide Details
              </Label>
              <p className="text-sm text-gray-600 mb-3">
                Please describe what happened and why this violates our rules. Include specific examples if possible.
              </p>
              <Textarea
                placeholder="Describe the violation in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Minimum 20 characters ({description.length}/20)
              </p>
            </div>

            <div>
              <Label htmlFor="reporter-email" className="text-sm">
                Your Email (Optional)
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Provide your email if you'd like updates on this report. Reports are confidential.
              </p>
              <Input
                id="reporter-email"
                type="email"
                placeholder="your.email@example.com"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
              />
            </div>

            <Alert className="bg-blue-50 border-blue-300">
              <AlertDescription className="text-blue-800 text-sm">
                <strong>Confidentiality:</strong> Your report is confidential. The reported user will not know who reported them.
                False reports may result in action against your account.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('select')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || description.trim().length < 20}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && isSubmitted && (
          <div className="space-y-4 py-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Report Submitted</h3>
              <p className="text-gray-600">
                Thank you for helping keep Droplink safe. We take all reports seriously.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <p className="text-sm font-semibold mb-2">What happens next?</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Our moderation team will review your report within 24-48 hours</li>
                <li>• High-priority reports (violence, child safety) are reviewed within 1 hour</li>
                <li>• We'll take appropriate action based on our{' '}
                  <a href="/moderation-policy" target="_blank" className="text-primary hover:underline">
                    Moderation Policy
                  </a>
                </li>
                <li>• If you provided your email, we'll send you an update</li>
              </ul>
            </div>

            <div className="text-xs text-gray-500">
              This window will close automatically...
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportingSystem;
