import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoToTop from '@/components/GoToTop';
import { ShieldCheck, Lock, Eye, Users, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

const SafetyPlan = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Platform Safety Plan - Droplink</title>
        <meta name="description" content="Learn about Droplink's comprehensive platform safety measures and protocols." />
      </Helmet>
      <Navbar />
      <GoToTop />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-slate-50 via-white to-white py-20 text-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <ShieldCheck className="w-12 h-12 text-sky-600 mr-4" />
                <h1 className="text-4xl font-bold text-gray-900">Platform Safety Plan</h1>
              </div>
              
              <p className="text-center text-gray-600 mb-8 text-lg">
                Last updated: December 7, 2025
              </p>

              <div className="bg-blue-50 border-l-4 border-sky-500 p-6 mb-8 rounded-lg">
                <p className="text-slate-800 font-medium">
                  Droplink is committed to providing a safe, secure, and trustworthy platform for all users. 
                  This Platform Safety Plan outlines our comprehensive approach to protecting our community.
                </p>
              </div>

              {/* Mission Statement */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Safety Mission</h2>
                
                <div className="space-y-4 text-gray-700">
                  <p className="text-lg font-medium">
                    To create and maintain a platform where users can safely connect, create, and transact 
                    without fear of harm, fraud, or exploitation.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <h3 className="font-semibold">Protection</h3>
                      <p className="text-sm mt-1">Safeguarding users from harmful content</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <Lock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h3 className="font-semibold">Privacy</h3>
                      <p className="text-sm mt-1">Protecting personal data and information</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <h3 className="font-semibold">Trust</h3>
                      <p className="text-sm mt-1">Building confidence in our community</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Safety Pillars */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Safety Pillars</h2>
                
                <div className="space-y-6">
                  {/* Pillar 1 */}
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-bold mb-3">1. Content Safety</h3>
                    <p className="text-gray-700 mb-3">Protecting users from harmful, illegal, or inappropriate content.</p>
                    
                    <div className="bg-blue-50 p-4 rounded">
                      <h4 className="font-semibold mb-2">Measures:</h4>
                      <ul className="text-sm space-y-1">
                        <li>✓ Automated content filtering using AI/ML</li>
                        <li>✓ Image and text moderation systems</li>
                        <li>✓ URL/link safety checking</li>
                        <li>✓ Proactive scanning of uploaded content</li>
                        <li>✓ 24/7 moderation team review</li>
                        <li>✓ Community reporting mechanisms</li>
                      </ul>
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="border-l-4 border-green-500 pl-6">
                    <h3 className="text-xl font-bold mb-3">2. User Safety</h3>
                    <p className="text-gray-700 mb-3">Protecting users from harassment, abuse, and exploitation.</p>
                    
                    <div className="bg-green-50 p-4 rounded">
                      <h4 className="font-semibold mb-2">Measures:</h4>
                      <ul className="text-sm space-y-1">
                        <li>✓ Anti-harassment policies and enforcement</li>
                        <li>✓ Block and report user features</li>
                        <li>✓ Privacy controls for profiles</li>
                        <li>✓ Age verification for sensitive features</li>
                        <li>✓ Support resources for victims</li>
                        <li>✓ Collaboration with safety organizations</li>
                      </ul>
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h3 className="text-xl font-bold mb-3">3. Data Security</h3>
                    <p className="text-gray-700 mb-3">Protecting user data from unauthorized access and breaches.</p>
                    
                    <div className="bg-purple-50 p-4 rounded">
                      <h4 className="font-semibold mb-2">Measures:</h4>
                      <ul className="text-sm space-y-1">
                        <li>✓ End-to-end encryption for sensitive data</li>
                        <li>✓ Regular security audits and penetration testing</li>
                        <li>✓ Secure authentication (OAuth, 2FA)</li>
                        <li>✓ Data minimization practices</li>
                        <li>✓ GDPR and privacy law compliance</li>
                        <li>✓ Incident response protocols</li>
                      </ul>
                    </div>
                  </div>

                  {/* Pillar 4 */}
                  <div className="border-l-4 border-yellow-500 pl-6">
                    <h3 className="text-xl font-bold mb-3">4. Transaction Safety</h3>
                    <p className="text-gray-700 mb-3">Ensuring safe and legitimate transactions on the platform.</p>
                    
                    <div className="bg-yellow-50 p-4 rounded">
                      <h4 className="font-semibold mb-2">Measures:</h4>
                      <ul className="text-sm space-y-1">
                        <li>✓ Secure Pi Network payment integration</li>
                        <li>✓ Fraud detection and prevention</li>
                        <li>✓ Seller verification processes</li>
                        <li>✓ Dispute resolution mechanisms</li>
                        <li>✓ Transaction monitoring and alerts</li>
                        <li>✓ Compliance with financial regulations</li>
                      </ul>
                    </div>
                  </div>

                  {/* Pillar 5 */}
                  <div className="border-l-4 border-red-500 pl-6">
                    <h3 className="text-xl font-bold mb-3">5. Platform Integrity</h3>
                    <p className="text-gray-700 mb-3">Maintaining trust and preventing abuse of platform features.</p>
                    
                    <div className="bg-red-50 p-4 rounded">
                      <h4 className="font-semibold mb-2">Measures:</h4>
                      <ul className="text-sm space-y-1">
                        <li>✓ Bot and spam detection</li>
                        <li>✓ Fake account prevention</li>
                        <li>✓ Rate limiting and abuse prevention</li>
                        <li>✓ Verification badges for authentic accounts</li>
                        <li>✓ Regular platform audits</li>
                        <li>✓ Transparency reporting</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technology & Tools */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <Eye className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Safety Technology & Tools</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border p-5 rounded-lg">
                      <h3 className="font-bold mb-3 flex items-center">
                        <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">1</span>
                        Automated Detection
                      </h3>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• AI-powered content moderation</li>
                        <li>• Natural language processing (NLP)</li>
                        <li>• Image recognition (NSFW detection)</li>
                        <li>• Pattern recognition for abuse</li>
                        <li>• Anomaly detection systems</li>
                      </ul>
                    </div>

                    <div className="border p-5 rounded-lg">
                      <h3 className="font-bold mb-3 flex items-center">
                        <span className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">2</span>
                        Reporting Systems
                      </h3>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• In-app reporting buttons</li>
                        <li>• Email reporting channels</li>
                        <li>• Anonymous reporting options</li>
                        <li>• Priority flagging system</li>
                        <li>• Reporter protection measures</li>
                      </ul>
                    </div>

                    <div className="border p-5 rounded-lg">
                      <h3 className="font-bold mb-3 flex items-center">
                        <span className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">3</span>
                        Human Review
                      </h3>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Trained moderation team (24/7)</li>
                        <li>• Multi-level review process</li>
                        <li>• Context-aware decision making</li>
                        <li>• Quality assurance checks</li>
                        <li>• Regular training updates</li>
                      </ul>
                    </div>

                    <div className="border p-5 rounded-lg">
                      <h3 className="font-bold mb-3 flex items-center">
                        <span className="bg-yellow-100 text-yellow-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">4</span>
                        User Controls
                      </h3>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Privacy settings dashboard</li>
                        <li>• Block/mute user options</li>
                        <li>• Content filtering preferences</li>
                        <li>• Notification controls</li>
                        <li>• Data download/deletion tools</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Protocols */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Incident Response Protocols</h2>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-700">
                    We have established protocols for responding to various safety incidents:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50 border border-red-200 p-4 rounded">
                      <h3 className="font-bold text-red-700 mb-2">Critical Incidents (Immediate Response)</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Child safety concerns (NCMEC report)</li>
                        <li>• Imminent harm or violence</li>
                        <li>• Terrorism-related content</li>
                        <li>• Major security breaches</li>
                      </ul>
                      <p className="text-xs mt-2 font-semibold">Response Time: &lt;1 hour</p>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 p-4 rounded">
                      <h3 className="font-bold text-orange-700 mb-2">High Priority (Rapid Response)</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Harassment campaigns</li>
                        <li>• Hate speech</li>
                        <li>• Scams targeting users</li>
                        <li>• Privacy violations</li>
                      </ul>
                      <p className="text-xs mt-2 font-semibold">Response Time: &lt;6 hours</p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                      <h3 className="font-bold text-yellow-700 mb-2">Medium Priority (Standard Response)</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Spam content</li>
                        <li>• Copyright issues</li>
                        <li>• Minor policy violations</li>
                        <li>• Impersonation reports</li>
                      </ul>
                      <p className="text-xs mt-2 font-semibold">Response Time: &lt;24 hours</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                      <h3 className="font-bold text-blue-700 mb-2">Low Priority (Scheduled Response)</h3>
                      <ul className="text-sm space-y-1">
                        <li>• General inquiries</li>
                        <li>• Feature abuse (minor)</li>
                        <li>• Quality concerns</li>
                        <li>• Non-urgent feedback</li>
                      </ul>
                      <p className="text-xs mt-2 font-semibold">Response Time: &lt;48 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Partnerships & Collaboration */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Partnerships & Collaboration</h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    We work with leading organizations to enhance platform safety:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold mb-2">Child Safety Organizations</h3>
                      <ul className="text-sm space-y-1">
                        <li>• National Center for Missing & Exploited Children (NCMEC)</li>
                        <li>• Internet Watch Foundation (IWF)</li>
                        <li>• Child safety advocacy groups</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-semibold mb-2">Security Organizations</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Cybersecurity firms</li>
                        <li>• Fraud prevention services</li>
                        <li>• Security researchers</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="font-semibold mb-2">Law Enforcement</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Local and federal agencies</li>
                        <li>• Interpol and international partners</li>
                        <li>• Legal compliance teams</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h3 className="font-semibold mb-2">Industry Coalitions</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Tech Against Trafficking</li>
                        <li>• Global Internet Forum (GIFCT)</li>
                        <li>• Trust & Safety Professional Association</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Education */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">User Education & Resources</h2>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-700">
                    We provide resources to help users stay safe:
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded text-center">
                      <h3 className="font-semibold mb-2">Safety Center</h3>
                      <p className="text-sm mb-3">Comprehensive safety guides and tips</p>
                      <Link to="/safety-guidelines" className="text-xs text-primary hover:underline">
                        Visit Safety Center →
                      </Link>
                    </div>

                    <div className="bg-green-50 p-4 rounded text-center">
                      <h3 className="font-semibold mb-2">Help Articles</h3>
                      <p className="text-sm mb-3">Step-by-step safety tutorials</p>
                      <Link to="/help" className="text-xs text-primary hover:underline">
                        Browse Help Center →
                      </Link>
                    </div>

                    <div className="bg-purple-50 p-4 rounded text-center">
                      <h3 className="font-semibold mb-2">Support Team</h3>
                      <p className="text-sm mb-3">24/7 safety support available</p>
                      <Link to="/contact" className="text-xs text-primary hover:underline">
                        Contact Support →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Continuous Improvement */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Continuous Improvement</h2>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <p>Our commitment to safety is ongoing:</p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3">Our Safety Roadmap:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>✓ Quarterly safety audits and assessments</li>
                      <li>✓ Regular policy reviews and updates</li>
                      <li>✓ User feedback integration</li>
                      <li>✓ Technology upgrades and innovations</li>
                      <li>✓ Staff training and development</li>
                      <li>✓ Transparency reporting (quarterly)</li>
                      <li>✓ External security assessments</li>
                      <li>✓ Community advisory board input</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact Safety Team */}
              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Our Safety Team</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-1">Report Safety Concerns:</p>
                    <a href="mailto:safety@droplink.space" className="text-primary hover:underline">
                      safety@droplink.space
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Emergency/Urgent Issues:</p>
                    <a href="mailto:urgent@droplink.space" className="text-primary hover:underline">
                      urgent@droplink.space
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Security Vulnerabilities:</p>
                    <a href="mailto:security@droplink.space" className="text-primary hover:underline">
                      security@droplink.space
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Law Enforcement:</p>
                    <a href="mailto:legal@droplink.space" className="text-primary hover:underline">
                      legal@droplink.space
                    </a>
                  </div>
                </div>
              </div>

              {/* Related Pages */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Related Resources</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link to="/safety-guidelines" className="text-primary hover:underline">
                    → Safety Guidelines
                  </Link>
                  <Link to="/user-rules" className="text-primary hover:underline">
                    → User Rules
                  </Link>
                  <Link to="/moderation-policy" className="text-primary hover:underline">
                    → Moderation Policy
                  </Link>
                  <Link to="/privacy" className="text-primary hover:underline">
                    → Privacy Policy
                  </Link>
                  <Link to="/terms" className="text-primary hover:underline">
                    → Terms of Service
                  </Link>
                  <Link to="/help" className="text-primary hover:underline">
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

export default SafetyPlan;
