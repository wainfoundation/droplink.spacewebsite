import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoToTop from '@/components/GoToTop';
import { Shield, Eye, AlertOctagon, Clock, Users, Scale } from 'lucide-react';

const ModerationPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Moderation Policy - Droplink</title>
        <meta name="description" content="Learn about Droplink's content moderation policies and enforcement procedures." />
      </Helmet>
      <Navbar />
      <GoToTop />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Shield className="w-12 h-12 text-blue-600 mr-4" />
                <h1 className="text-4xl font-bold text-gray-900">Moderation Policy</h1>
              </div>
              
              <p className="text-center text-gray-600 mb-8 text-lg">
                Last updated: December 7, 2025
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                <p className="text-blue-900 font-medium">
                  This Moderation Policy outlines how Droplink reviews, moderates, and enforces platform rules 
                  to maintain a safe, respectful, and productive environment for all users.
                </p>
              </div>

              {/* Our Approach */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Moderation Approach</h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Droplink employs a multi-layered moderation system combining automated tools, community reporting, 
                    and human review to maintain platform integrity.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Eye className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h3 className="font-semibold mb-2">Proactive Monitoring</h3>
                      <p className="text-sm">Automated systems detect potential violations</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <h3 className="font-semibold mb-2">Community Reports</h3>
                      <p className="text-sm">User reports flagged for review</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Scale className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <h3 className="font-semibold mb-2">Human Review</h3>
                      <p className="text-sm">Trained moderators make final decisions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What We Moderate */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Moderate</h2>
                
                <div className="space-y-6 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Content Types:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <div>
                          <strong>User Profiles:</strong> Profile photos, bios, usernames, and display names
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <div>
                          <strong>Links & URLs:</strong> External links shared on profiles
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <div>
                          <strong>Products & Services:</strong> Digital products, descriptions, and pricing
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <div>
                          <strong>Comments & Messages:</strong> User interactions and communications
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <div>
                          <strong>Forum Posts:</strong> Community discussions and threads
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <div>
                          <strong>Uploaded Media:</strong> Images, videos, and other files
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Moderation Process */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Moderation Process</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="font-bold text-lg mb-2">1. Detection & Reporting</h3>
                    <p className="text-gray-700 mb-2">Content is flagged through:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Automated content filters</li>
                      <li>User reports via Report button</li>
                      <li>Email reports to report@droplink.space</li>
                      <li>Proactive moderation team review</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-500 pl-6">
                    <h3 className="font-bold text-lg mb-2">2. Initial Review</h3>
                    <p className="text-gray-700 mb-2">Flagged content enters review queue:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li><strong>Priority 1 (Severe):</strong> Reviewed within 1 hour</li>
                      <li><strong>Priority 2 (High):</strong> Reviewed within 6 hours</li>
                      <li><strong>Priority 3 (Medium):</strong> Reviewed within 24 hours</li>
                      <li><strong>Priority 4 (Low):</strong> Reviewed within 48 hours</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-6">
                    <h3 className="font-bold text-lg mb-2">3. Investigation</h3>
                    <p className="text-gray-700 mb-2">Moderators review:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Flagged content and context</li>
                      <li>User's history and previous violations</li>
                      <li>Applicable platform rules and policies</li>
                      <li>Severity and impact of violation</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-6">
                    <h3 className="font-bold text-lg mb-2">4. Decision & Action</h3>
                    <p className="text-gray-700 mb-2">Moderators take appropriate action:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>No action (if no violation found)</li>
                      <li>Content removal</li>
                      <li>Warning to user</li>
                      <li>Temporary suspension</li>
                      <li>Permanent ban</li>
                      <li>Report to authorities (illegal content)</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-red-500 pl-6">
                    <h3 className="font-bold text-lg mb-2">5. Notification</h3>
                    <p className="text-gray-700 mb-2">Users are notified of:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Specific rule violated</li>
                      <li>Action taken (removal, suspension, etc.)</li>
                      <li>Appeal process and deadline</li>
                      <li>Steps to prevent future violations</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Enforcement Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <AlertOctagon className="w-6 h-6 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Enforcement Actions</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-3 text-left">Violation Type</th>
                          <th className="border p-3 text-left">First Offense</th>
                          <th className="border p-3 text-left">Second Offense</th>
                          <th className="border p-3 text-left">Third Offense</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr>
                          <td className="border p-3"><strong>Minor Spam</strong></td>
                          <td className="border p-3">Warning + Content Removal</td>
                          <td className="border p-3">7-day suspension</td>
                          <td className="border p-3">30-day suspension</td>
                        </tr>
                        <tr>
                          <td className="border p-3"><strong>Harassment</strong></td>
                          <td className="border p-3">Warning + 3-day suspension</td>
                          <td className="border p-3">14-day suspension</td>
                          <td className="border p-3">Permanent ban</td>
                        </tr>
                        <tr>
                          <td className="border p-3"><strong>Hate Speech</strong></td>
                          <td className="border p-3">7-day suspension</td>
                          <td className="border p-3">30-day suspension</td>
                          <td className="border p-3">Permanent ban</td>
                        </tr>
                        <tr>
                          <td className="border p-3"><strong>Copyright Violation</strong></td>
                          <td className="border p-3">Content removal + Warning</td>
                          <td className="border p-3">14-day suspension</td>
                          <td className="border p-3">Permanent ban</td>
                        </tr>
                        <tr>
                          <td className="border p-3"><strong>Adult Content</strong></td>
                          <td className="border p-3">Content removal + Warning</td>
                          <td className="border p-3">30-day suspension</td>
                          <td className="border p-3">Permanent ban</td>
                        </tr>
                        <tr className="bg-red-50">
                          <td className="border p-3"><strong>Illegal Content</strong></td>
                          <td className="border p-3" colSpan={3}>Immediate permanent ban + law enforcement report</td>
                        </tr>
                        <tr className="bg-red-50">
                          <td className="border p-3"><strong>Child Exploitation</strong></td>
                          <td className="border p-3" colSpan={3}>Immediate permanent ban + NCMEC report + law enforcement</td>
                        </tr>
                        <tr className="bg-red-50">
                          <td className="border p-3"><strong>Terrorism</strong></td>
                          <td className="border p-3" colSpan={3}>Immediate permanent ban + authorities notified</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Appeals Process */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Appeals Process</h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you believe a moderation decision was made in error, you have the right to appeal:
                  </p>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-bold mb-3">How to Appeal:</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Email <a href="mailto:appeals@droplink.space" className="text-primary hover:underline">appeals@droplink.space</a> within 30 days</li>
                      <li>Include your username and the specific action being appealed</li>
                      <li>Explain why you believe the decision was incorrect</li>
                      <li>Provide any supporting evidence or context</li>
                    </ol>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <p><strong>Review Timeline:</strong></p>
                    <p className="text-sm mt-1">Appeals are reviewed by a different moderator within 5-7 business days. Decisions on appeals are final.</p>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4 py-2">
                    <p><strong>Appeal Outcomes:</strong></p>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• <strong>Upheld:</strong> Original decision stands</li>
                      <li>• <strong>Overturned:</strong> Action reversed, account restored</li>
                      <li>• <strong>Modified:</strong> Penalty reduced or adjusted</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Moderator Guidelines */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Moderator Guidelines</h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>Our moderation team follows strict guidelines:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border p-4 rounded">
                      <h3 className="font-semibold mb-2">✓ Moderators Must:</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Apply rules consistently</li>
                        <li>• Remain impartial and objective</li>
                        <li>• Consider context and intent</li>
                        <li>• Document all decisions</li>
                        <li>• Respect user privacy</li>
                        <li>• Escalate complex cases</li>
                      </ul>
                    </div>
                    
                    <div className="border p-4 rounded">
                      <h3 className="font-semibold mb-2">✗ Moderators Must Not:</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Make decisions based on personal bias</li>
                        <li>• Share user information publicly</li>
                        <li>• Abuse moderation powers</li>
                        <li>• Engage in conflicts of interest</li>
                        <li>• Retaliate against reporters</li>
                        <li>• Rush critical decisions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transparency */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Transparency & Reporting</h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    We believe in transparency about our moderation efforts:
                  </p>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3">Quarterly Transparency Reports Include:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Total number of reports received</li>
                      <li>• Action taken rates by violation type</li>
                      <li>• Average response times</li>
                      <li>• Appeal statistics and outcomes</li>
                      <li>• Platform safety improvements</li>
                    </ul>
                    <p className="text-xs mt-4 text-gray-600">
                      View our latest transparency report at <Link to="/transparency" className="text-primary hover:underline">/transparency</Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Moderation Team</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-1">Report Violations:</p>
                    <a href="mailto:report@droplink.space" className="text-primary hover:underline">
                      report@droplink.space
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Appeals:</p>
                    <a href="mailto:appeals@droplink.space" className="text-primary hover:underline">
                      appeals@droplink.space
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">General Inquiries:</p>
                    <a href="mailto:moderation@droplink.space" className="text-primary hover:underline">
                      moderation@droplink.space
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Emergency:</p>
                    <a href="mailto:urgent@droplink.space" className="text-primary hover:underline">
                      urgent@droplink.space
                    </a>
                  </div>
                </div>
              </div>

              {/* Related Policies */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Related Policies</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link to="/user-rules" className="text-primary hover:underline">
                    → User Rules
                  </Link>
                  <Link to="/safety-guidelines" className="text-primary hover:underline">
                    → Safety Guidelines
                  </Link>
                  <Link to="/terms" className="text-primary hover:underline">
                    → Terms of Service
                  </Link>
                  <Link to="/community" className="text-primary hover:underline">
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

export default ModerationPolicy;
