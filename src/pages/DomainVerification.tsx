import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Copy, Globe, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const DomainVerification = () => {
  const [domain, setDomain] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  // Validation key for domain verification
  const validationKey = "7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a";

  // Supported domains that should have the validation key
  const supportedDomains = [
    'droplink.space',
    'droplink-seven.vercel.app',
    'localhost:2222',
    'localhost:8081',
    'localhost:8080'
  ];

  const copyValidationKey = () => {
    navigator.clipboard.writeText(validationKey);
    toast({
      title: "Validation Key Copied",
      description: "The validation key has been copied to your clipboard",
    });
  };

  const verifyDomain = async () => {
    setIsVerifying(true);
    setVerificationStatus('idle');
    setErrorMessage("");

    try {
      // Check if the validation file exists at the domain
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
      
      // Handle different environments
      let validationUrl;
      if (cleanDomain.includes('localhost')) {
        // Development environment
        validationUrl = `http://${cleanDomain}/validation-key.txt`;
      } else {
        // Production environment
        validationUrl = `https://${cleanDomain}/validation-key.txt`;
      }
      
      console.log('Verifying domain:', cleanDomain);
      console.log('Checking URL:', validationUrl);

      // Try to fetch the validation file
      const response = await fetch(validationUrl, {
        method: 'GET',
        mode: 'cors'
      }).catch(() => {
        throw new Error('Failed to access validation file');
      });

      if (!response.ok) {
        throw new Error('Validation file not found or not accessible');
      }

      const content = await response.text();
      const trimmedContent = content.trim();

      if (trimmedContent === validationKey) {
        setVerificationStatus('success');
        toast({
          title: "Domain Verified",
          description: `${cleanDomain} has been successfully verified`,
        });
      } else {
        throw new Error('Validation key does not match');
      }

    } catch (error) {
      console.error('Domain verification error:', error);
      setVerificationStatus('failed');
      setErrorMessage(error instanceof Error ? error.message : 'Verification failed');
      
      toast({
        title: "Verification Failed",
        description: "Please check the troubleshooting steps below",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Get current development URL
  const getCurrentDevUrl = () => {
    const port = window.location.port || '8081';
    return `http://localhost:${port}/validation-key.txt`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Droplink</h1>
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">Testnet</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">Verify App Domain</h2>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>How to verify?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2">1. Include the following key in a .txt file named <strong>validation-key.txt</strong>, and place this file on your hosting domain accessible at</p>
                <p className="font-mono text-sm bg-muted p-2 rounded">
                  {window.location.hostname === 'localhost' 
                    ? getCurrentDevUrl()
                    : 'https://droplink.space/validation-key.txt'
                  }
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between gap-2">
                  <code className="font-mono text-sm flex-1 break-all">
                    {validationKey}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyValidationKey}
                    className="flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>NOTE:</strong> If utilizing the Demo App setup to begin copy the validation-key above and paste it into your .env file. Developers using the Demo App setup should copy the validation and paste it into their .env file. Tap here for assistance.
                </AlertDescription>
              </Alert>

              <div>
                <p>2. Once the file is uploaded to your host, or your demo app instance is being served at your domain, click the verify button below.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="domain" className="block text-sm font-medium mb-2">
                    Enter your domain:
                  </label>
                  <Input
                    id="domain"
                    type="text"
                    placeholder={window.location.hostname === 'localhost' 
                      ? `localhost:${window.location.port || '8081'}` 
                      : "www.yourdomain.com"
                    }
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>

                <Button
                  onClick={verifyDomain}
                  disabled={isVerifying || !domain.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isVerifying ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify Domain'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Display */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-medium">Status:</span>
                {verificationStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span>Domain ownership is validated.</span>
                  </div>
                )}
                {verificationStatus === 'failed' && (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    <span>Domain ownership is not validated.</span>
                  </div>
                )}
                {verificationStatus === 'idle' && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <XCircle className="h-5 w-5" />
                    <span>Domain ownership is not validated.</span>
                  </div>
                )}
              </div>

              {verificationStatus === 'failed' && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <strong>Error:</strong> {errorMessage}
                    <br /><br />
                    <strong>Troubleshooting:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Ensure the validation-key.txt file is accessible at the specified URL</li>
                      <li>Check that the file contains exactly the validation key shown above</li>
                      <li>Verify there are no extra spaces or characters in the file</li>
                      <li>Make sure your domain is accessible and the file is publicly readable</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {verificationStatus === 'success' && (
                <Alert>
                  <AlertDescription>
                    <strong>Success!</strong> Your domain has been verified. You can now proceed with the Pi Network integration.
                    <br /><br />
                    <strong>Next Steps:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Configure your Pi Network app settings</li>
                      <li>Set up payment processing</li>
                      <li>Test the integration with Pi Browser</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Instructions for different environments */}
          <Card>
            <CardHeader>
              <CardTitle>Environment-Specific Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">For Local Development:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Enter <code className="bg-muted px-1 rounded">localhost:8081</code> as your domain</li>
                  <li>The validation key should be accessible at <code className="bg-muted px-1 rounded">http://localhost:8081/validation-key.txt</code></li>
                  <li>Your Validation Key is correctly saved in validation-key.txt file</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">For Production Domains:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>droplink.space</strong> - Upload validation-key.txt to root directory</li>
                  <li><strong>droplink-seven.vercel.app</strong> - Upload to Vercel public directory</li>
                  <li>Ensure accessible at: <code className="bg-muted px-1 rounded">https://yourdomain.com/validation-key.txt</code></li>
                  <li>Verify the file contains exactly the validation key shown above</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Supported Domains:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {supportedDomains.map((domain) => (
                    <div key={domain} className="bg-muted p-2 rounded text-sm">
                      <code>{domain}</code>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DomainVerification;
