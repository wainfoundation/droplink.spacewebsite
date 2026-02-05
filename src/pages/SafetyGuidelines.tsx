import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoToTop from '@/components/GoToTop';
import { Shield, Lock, Eye, UserX, Flag, Phone, Heart, AlertCircle } from 'lucide-react';

const SafetyGuidelines = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Safety Guidelines - Droplink</title>
        <meta name="description" content="Essential safety guidelines and best practices for Droplink users." />
      </Helmet>
      <Navbar />
      <GoToTop />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-purple-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Shield className="w-12 h-12 text-purple-600 mr-4" />
                <h1 className="text-4xl font-bold text-gray-900">Safety Guidelines</h1>
              </div>
              
              <p className="text-center text-gray-600 mb-8 text-lg">
                Your guide to staying safe on Droplink
              </p>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 mb-8">
                <p className="text-purple-900 font-medium">
                  Your safety is our priority. These guidelines will help you protect yourself, 
                  your data, and your community while using Droplink.
                </p>
              </div>

              {/* Quick Safety Tips */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Safety Tips</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <Lock className="w-5 h-5 text-blue-600 mr-2" />
                      <h3 className="font-semibold">Protect Your Account</h3>
                    </div>
                    <p className="text-sm text-gray-700">Use strong passwords and enable two-factor authentication</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <Eye className="w-5 h-5 text-green-600 mr-2" />
                      <h3 className="font-semibold">Control Privacy</h3>
                    </div>
                    <p className="text-sm text-gray-700">Review your privacy settings and what you share publicly</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <Flag className="w-5 h-5 text-red-600 mr-2" />
                      <h3 className="font-semibold">Report Abuse</h3>
                    </div>
                    <p className="text-sm text-gray-700">Report any content or behavior that violates our rules</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <UserX className="w-5 h-5 text-orange-600 mr-2" />
                      <h3 className="font-semibold">Block Users</h3>
                    </div>
                    <p className="text-sm text-gray-700">Block anyone making you uncomfortable</p>
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <Lock className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Account Security</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Protect Your Login</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <div>
                          <strong>Strong Passwords:</strong> Use at least 12 characters with a mix of uppercase, lowercase, numbers, and symbols
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <div>
                          <strong>Unique Passwords:</strong> Don't reuse passwords from other websites
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <div>
                          <strong>Password Manager:</strong> Consider using a password manager like 1Password or LastPass
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <div>
                          <strong>Two-Factor Authentication:</strong> Enable 2FA for extra security (coming soon)
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2 mt-1">✗</span>
                        <div>
                          <strong>Never Share:</strong> Don't share your password with anyone, including Droplink staff
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Recognize Phishing Attempts</h3>
                    <div className="bg-red-50 border border-red-200 p-4 rounded">
                      <p className="font-medium text-red-800 mb-2">⚠️ Warning Signs:</p>
                      <ul className="space-y-1 text-sm text-red-700">
                        <li>• Emails asking for your password or payment info</li>
                        <li>• Urgent messages threatening account suspension</li>
                        <li>• Links to suspicious websites (check the URL carefully)</li>
                        <li>• Offers that seem too good to be true</li>
                        <li>• Poor grammar or spelling in "official" emails</li>
                      </ul>
                      <p className="text-xs mt-3 text-red-600 font-semibold">
                        Droplink will NEVER ask for your password via email or message.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Secure Your Sessions</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Log out when using shared or public computers</li>
                      <li>• Don't save passwords on devices others can access</li>
                      <li>• Clear browser cache and cookies regularly</li>
                      <li>• Use private/incognito mode on public devices</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Privacy Protection */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <Eye className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Privacy Protection</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Control What You Share</h3>
                    <div className="bg-blue-50 p-4 rounded mb-4">
                      <p className="font-medium mb-2">Before sharing, ask yourself:</p>
                      <ul className="text-sm space-y-1">
                        <li>• Would I be comfortable if this was public?</li>
                        <li>• Could this information be used against me?</li>
                        <li>• Am I sharing someone else's private information?</li>
                        <li>• Does this reveal my location or routine?</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Sensitive Information to Avoid Sharing:</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border-l-4 border-red-500 pl-4">
                        <p className="font-semibold text-red-600 mb-2">Never Share:</p>
                        <ul className="text-sm space-y-1">
                          <li>• Full home address</li>
                          <li>• Phone numbers</li>
                          <li>• Financial information</li>
                          <li>• Government ID numbers</li>
                          <li>• Passwords or PINs</li>
                          <li>• Location in real-time</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-yellow-500 pl-4">
                        <p className="font-semibold text-yellow-600 mb-2">Be Cautious:</p>
                        <ul className="text-sm space-y-1">
                          <li>• Full date of birth</li>
                          <li>• Photos with metadata</li>
                          <li>• Travel plans</li>
                          <li>• Children's information</li>
                          <li>• Workplace details</li>
                          <li>• Daily routines</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Privacy Settings</h3>
                    <p className="text-gray-700 mb-3">Review and adjust your privacy settings:</p>
                    <ul className="space-y-2 text-sm">
                      <li>• <Link to="/dashboard/settings" className="text-primary hover:underline">Profile visibility settings</Link></li>
                      <li>• Choose who can see your content</li>
                      <li>• Control who can contact you</li>
                      <li>• Manage data collection preferences</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Safe Transactions */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <img src="/pi-logo.png" alt="Pi" className="w-6 h-6 mr-3" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <h2 className="text-2xl font-bold text-gray-900">Safe Pi Network Transactions</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Buying & Selling Safely:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <div>
                          <strong>Verify Sellers:</strong> Check seller ratings, reviews, and profile history
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <div>
                          <strong>Read Descriptions:</strong> Ensure product/service details are clear and accurate
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <div>
                          <strong>Use Platform Tools:</strong> Complete transactions through Droplink's Pi payment system
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <div>
                          <strong>Document Everything:</strong> Keep records of transactions and communications
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <div>
                          <strong>Report Issues:</strong> Contact support if something seems wrong
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                    <p className="font-semibold text-yellow-800 mb-2">🚨 Red Flags - Avoid These Situations:</p>
                    <ul className="text-sm space-y-1 text-yellow-700">
                      <li>• Requests to move transactions off-platform</li>
                      <li>• Sellers asking for personal payment information</li>
                      <li>• Deals that seem too good to be true</li>
                      <li>• Pressure to complete transactions quickly</li>
                      <li>• Vague or missing product descriptions</li>
                      <li>• Sellers with no reviews or suspicious profiles</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">
                      See our <Link to="/pi-economy-rules" className="text-primary hover:underline">Pi Economy Rules</Link> for detailed transaction guidelines.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dealing with Harassment */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <UserX className="w-6 h-6 text-red-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Dealing with Harassment & Abuse</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">If Someone is Harassing You:</h3>
                    <ol className="list-decimal list-inside space-y-3 text-gray-700">
                      <li>
                        <strong>Don't Engage:</strong> Don't respond to harassment - it often escalates the situation
                      </li>
                      <li>
                        <strong>Block the User:</strong> Use the block feature to prevent further contact
                      </li>
                      <li>
                        <strong>Report to Droplink:</strong> Use the Report button or email report@droplink.space
                      </li>
                      <li>
                        <strong>Save Evidence:</strong> Take screenshots of harassing messages or content
                      </li>
                      <li>
                        <strong>Seek Support:</strong> Talk to someone you trust about what's happening
                      </li>
                    </ol>
                  </div>

                  <div className="bg-red-50 border border-red-200 p-4 rounded">
                    <p className="font-semibold text-red-800 mb-2">⚠️ If You Feel Threatened:</p>
                    <ul className="text-sm space-y-1 text-red-700">
                      <li>• Contact local law enforcement immediately</li>
                      <li>• Document all threats and evidence</li>
                      <li>• Email urgent@droplink.space for immediate assistance</li>
                      <li>• Consider telling trusted friends/family about the situation</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Types of Behavior to Report:</h3>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="border p-3 rounded">
                        <p className="font-semibold mb-1">Harassment</p>
                        <p className="text-gray-600">Repeated unwanted contact or messages</p>
                      </div>
                      <div className="border p-3 rounded">
                        <p className="font-semibold mb-1">Threats</p>
                        <p className="text-gray-600">Any threats of violence or harm</p>
                      </div>
                      <div className="border p-3 rounded">
                        <p className="font-semibold mb-1">Hate Speech</p>
                        <p className="text-gray-600">Discriminatory or hateful content</p>
                      </div>
                      <div className="border p-3 rounded">
                        <p className="font-semibold mb-1">Doxxing</p>
                        <p className="text-gray-600">Sharing private information without consent</p>
                      </div>
                      <div className="border p-3 rounded">
                        <p className="font-semibold mb-1">Impersonation</p>
                        <p className="text-gray-600">Someone pretending to be you</p>
                      </div>
                      <div className="border p-3 rounded">
                        <p className="font-semibold mb-1">Sexual Harassment</p>
                        <p className="text-gray-600">Unwanted sexual content or advances</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* For Parents & Guardians */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 text-pink-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">For Parents & Guardians</h2>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Droplink is designed for users 13 and older. If your child uses Droplink, here are safety tips:
                  </p>

                  <div className="bg-pink-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3">Tips for Parents:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>✓ Have open conversations about online safety</li>
                      <li>✓ Review privacy settings together</li>
                      <li>✓ Encourage them to come to you with concerns</li>
                      <li>✓ Help them understand what's appropriate to share</li>
                      <li>✓ Teach them about online strangers and risks</li>
                      <li>✓ Monitor their online activity appropriately</li>
                      <li>✓ Report any concerning behavior to Droplink</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-pink-500 pl-4">
                    <p className="font-semibold mb-2">Resources:</p>
                    <ul className="text-sm space-y-1">
                      <li>• <a href="https://www.connectsafely.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ConnectSafely.org</a></li>
                      <li>• <a href="https://www.commonsensemedia.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Common Sense Media</a></li>
                      <li>• <a href="https://www.internetsafety101.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Internet Safety 101</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Crisis Resources */}
              <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-8 mb-8">
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 text-red-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Crisis Resources</h2>
                </div>
                
                <div className="space-y-4">
                  <p className="font-medium">If you or someone you know is in crisis, please reach out:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="font-bold mb-1">Suicide Prevention</p>
                      <p>988 Suicide & Crisis Lifeline</p>
                      <p className="text-primary">Call/Text: 988</p>
                    </div>

                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="font-bold mb-1">Crisis Text Line</p>
                      <p>24/7 text support</p>
                      <p className="text-primary">Text "HELLO" to 741741</p>
                    </div>

                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="font-bold mb-1">National Domestic Violence</p>
                      <p>24/7 support hotline</p>
                      <p className="text-primary">1-800-799-7233</p>
                    </div>

                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="font-bold mb-1">Cybertipline (NCMEC)</p>
                      <p>Report child exploitation</p>
                      <p className="text-primary">CyberTipline.org</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reporting */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <Flag className="w-6 h-6 text-orange-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">How to Report Issues</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border p-4 rounded">
                      <h3 className="font-semibold mb-2">Report Button</h3>
                      <p className="text-sm text-gray-700">
                        Click the flag icon on any profile or content to report violations directly
                      </p>
                    </div>

                    <div className="border p-4 rounded">
                      <h3 className="font-semibold mb-2">Email</h3>
                      <p className="text-sm text-gray-700">
                        Send detailed reports to <a href="mailto:report@droplink.space" className="text-primary hover:underline">report@droplink.space</a>
                      </p>
                    </div>

                    <div className="border p-4 rounded">
                      <h3 className="font-semibold mb-2">Urgent Issues</h3>
                      <p className="text-sm text-gray-700">
                        For immediate threats: <a href="mailto:urgent@droplink.space" className="text-primary hover:underline">urgent@droplink.space</a>
                      </p>
                    </div>

                    <div className="border p-4 rounded">
                      <h3 className="font-semibold mb-2">Safety Team</h3>
                      <p className="text-sm text-gray-700">
                        General safety concerns: <a href="mailto:safety@droplink.space" className="text-primary hover:underline">safety@droplink.space</a>
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded">
                    <p className="font-semibold mb-2">What to Include in Your Report:</p>
                    <ul className="text-sm space-y-1">
                      <li>• Username or profile URL of the person involved</li>
                      <li>• Specific content or behavior that's concerning</li>
                      <li>• Screenshots or other evidence (if available)</li>
                      <li>• Date and time of incident</li>
                      <li>• How this violates Droplink's rules</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Stay Updated */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <AlertCircle className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Stay Informed</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Review our safety policies regularly as we update them to address new challenges:
                </p>
                <div className="grid md:grid-cols-3 gap-3">
                  <Link to="/user-rules" className="text-primary hover:underline text-sm">
                    → User Rules
                  </Link>
                  <Link to="/moderation-policy" className="text-primary hover:underline text-sm">
                    → Moderation Policy
                  </Link>
                  <Link to="/safety-plan" className="text-primary hover:underline text-sm">
                    → Platform Safety Plan
                  </Link>
                  <Link to="/privacy" className="text-primary hover:underline text-sm">
                    → Privacy Policy
                  </Link>
                  <Link to="/pi-economy-rules" className="text-primary hover:underline text-sm">
                    → Pi Economy Rules
                  </Link>
                  <Link to="/help" className="text-primary hover:underline text-sm">
                    → Help Center
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

export default SafetyGuidelines;
