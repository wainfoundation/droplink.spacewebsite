import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoToTop from '@/components/GoToTop';
import { Shield, AlertTriangle, CheckCircle, XCircle, Flag } from 'lucide-react';

const UserRules = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>User Rules - Droplink</title>
        <meta name="description" content="Read the user rules and acceptable use policy for Droplink." />
      </Helmet>
      <Navbar />
      <GoToTop />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-primary/5 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Shield className="w-12 h-12 text-primary mr-4" />
                <h1 className="text-4xl font-bold text-gray-900">User Rules</h1>
              </div>
              
              <p className="text-center text-gray-600 mb-8 text-lg">
                Last updated: December 7, 2025
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                <p className="text-blue-900 font-medium">
                  Welcome to Droplink! These User Rules govern your use of our platform and services. 
                  By using Droplink, you agree to follow these rules and our community standards.
                </p>
              </div>

              {/* Acceptable Use */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Acceptable Use</h2>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">✓ You May:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Create and share links, profiles, and content that you own or have rights to</li>
                      <li>Sell digital products and services through your Droplink page</li>
                      <li>Accept Pi Network payments for your goods and services</li>
                      <li>Promote your content on social media and other platforms</li>
                      <li>Use Droplink for personal or business purposes</li>
                      <li>Collaborate with other creators respectfully</li>
                      <li>Report content that violates these rules</li>
                      <li>Customize your profile with themes and templates</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Prohibited Content */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <XCircle className="w-6 h-6 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Prohibited Content & Behavior</h2>
                </div>
                
                <div className="space-y-6 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-red-600">✗ Strictly Prohibited:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Illegal Content:</strong> Any content that violates local, national, or international laws</li>
                      <li><strong>Hate Speech:</strong> Content promoting violence, discrimination, or hatred based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics</li>
                      <li><strong>Adult/NSFW Content:</strong> Pornography, sexually explicit material, or adult services</li>
                      <li><strong>Violence & Harm:</strong> Content promoting self-harm, suicide, or violence against others</li>
                      <li><strong>Harassment & Bullying:</strong> Targeting individuals or groups with abuse, threats, or intimidation</li>
                      <li><strong>Spam & Scams:</strong> Unsolicited marketing, phishing attempts, or fraudulent schemes</li>
                      <li><strong>Malware & Viruses:</strong> Links to malicious software or harmful downloads</li>
                      <li><strong>Copyright Infringement:</strong> Unauthorized use of copyrighted material</li>
                      <li><strong>Impersonation:</strong> Pretending to be another person, brand, or organization</li>
                      <li><strong>Child Exploitation:</strong> Any content involving minors in inappropriate contexts</li>
                      <li><strong>Terrorism & Extremism:</strong> Content promoting terrorist organizations or extremist ideologies</li>
                      <li><strong>Drug Sales:</strong> Selling or promoting illegal drugs or substances</li>
                      <li><strong>Weapons Sales:</strong> Selling firearms, explosives, or dangerous weapons</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-orange-600">⚠️ Restricted Activities:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Excessive self-promotion or spam behavior</li>
                      <li>Manipulating platform features or gaming the system</li>
                      <li>Creating multiple accounts to circumvent bans</li>
                      <li>Sharing misleading or false information</li>
                      <li>Attempting to access other users' accounts</li>
                      <li>Scraping or automated data collection</li>
                      <li>Reselling Droplink services without authorization</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pi Network Specific Rules */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <img src="/pi-logo.png" alt="Pi Network" className="w-6 h-6 mr-3" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <h2 className="text-2xl font-bold text-gray-900">Pi Network Rules</h2>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <p className="font-medium">When using Pi Network features on Droplink:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Follow all Pi Network platform rules and policies</li>
                    <li>Provide accurate product descriptions and pricing</li>
                    <li>Honor all Pi transactions and payments</li>
                    <li>No price manipulation or fraudulent transactions</li>
                    <li>Respect Pi Network's mainnet compliance requirements</li>
                    <li>Do not use Pi for prohibited goods or services</li>
                    <li>Maintain transparency in all Pi-based transactions</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-4">
                    See our <Link to="/pi-economy-rules" className="text-primary hover:underline">Pi Economy Rules</Link> for detailed guidelines.
                  </p>
                </div>
              </div>

              {/* Account Responsibilities */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Responsibilities</h2>
                
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold mb-2">Account Security</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Keep your login credentials confidential</li>
                      <li>Use a strong, unique password</li>
                      <li>Enable two-factor authentication when available</li>
                      <li>Report suspicious activity immediately</li>
                      <li>You are responsible for all activity on your account</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Profile Accuracy</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Provide accurate information about yourself or business</li>
                      <li>Keep contact information up to date</li>
                      <li>Use appropriate profile photos and branding</li>
                      <li>Update your profile if your business changes</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Content Ownership</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>You retain ownership of your content</li>
                      <li>You grant Droplink license to display your content</li>
                      <li>You are responsible for ensuring you have rights to all content</li>
                      <li>Respect intellectual property rights of others</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Enforcement */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Enforcement & Consequences</h2>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Violations of these User Rules may result in the following actions:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="border-l-4 border-yellow-400 pl-4">
                      <strong>First Offense (Minor Violation):</strong>
                      <p>Warning and content removal</p>
                    </div>
                    
                    <div className="border-l-4 border-orange-400 pl-4">
                      <strong>Second Offense or Moderate Violation:</strong>
                      <p>Temporary account suspension (7-30 days)</p>
                    </div>
                    
                    <div className="border-l-4 border-red-400 pl-4">
                      <strong>Third Offense or Serious Violation:</strong>
                      <p>Permanent account termination</p>
                    </div>
                    
                    <div className="border-l-4 border-red-600 pl-4">
                      <strong>Severe Violations:</strong>
                      <p>Immediate permanent ban and potential legal action (e.g., illegal content, child exploitation, terrorism)</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded">
                    <p className="font-medium">Appeal Process:</p>
                    <p className="text-sm mt-2">
                      If you believe your account was suspended or terminated in error, you may appeal by contacting{' '}
                      <a href="mailto:appeals@droplink.space" className="text-primary hover:underline">
                        appeals@droplink.space
                      </a>{' '}
                      within 30 days. Include your username, the reason for suspension, and why you believe it was incorrect.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reporting Violations */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <Flag className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Reporting Violations</h2>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Help us maintain a safe community by reporting violations:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Use the "Report" button on any profile or content</li>
                    <li>Email <a href="mailto:report@droplink.space" className="text-primary hover:underline">report@droplink.space</a></li>
                    <li>Contact our <Link to="/safety-guidelines" className="text-primary hover:underline">Safety Team</Link></li>
                  </ul>
                  <p className="text-sm mt-4">
                    All reports are reviewed within 24-48 hours. Your report remains confidential.
                  </p>
                </div>
              </div>

              {/* Changes to Rules */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Changes to These Rules</h2>
                <p className="text-gray-700">
                  We may update these User Rules from time to time. Significant changes will be announced via email 
                  and platform notifications. Continued use of Droplink after changes constitutes acceptance of the updated rules.
                </p>
              </div>

              {/* Related Pages */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Related Policies</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link to="/terms" className="text-primary hover:underline flex items-center">
                    → Terms of Service
                  </Link>
                  <Link to="/privacy" className="text-primary hover:underline flex items-center">
                    → Privacy Policy
                  </Link>
                  <Link to="/moderation-policy" className="text-primary hover:underline flex items-center">
                    → Moderation Policy
                  </Link>
                  <Link to="/safety-guidelines" className="text-primary hover:underline flex items-center">
                    → Safety Guidelines
                  </Link>
                  <Link to="/pi-economy-rules" className="text-primary hover:underline flex items-center">
                    → Pi Economy Rules
                  </Link>
                  <Link to="/community" className="text-primary hover:underline flex items-center">
                    → Community Guidelines
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserRules;
