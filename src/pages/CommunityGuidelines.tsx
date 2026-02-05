import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoToTop from '@/components/GoToTop';
import { Users, Heart, Shield, AlertCircle, Lightbulb, MessageSquare, Flag } from 'lucide-react';

const CommunityGuidelines = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Community Guidelines - Droplink</title>
        <meta name="description" content="Droplink Community Guidelines - Build a respectful and positive community." />
      </Helmet>
      <Navbar />
      <GoToTop />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-emerald-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Users className="w-12 h-12 text-emerald-600 mr-4" />
                <h1 className="text-4xl font-bold text-gray-900">Community Guidelines</h1>
              </div>
              
              <p className="text-center text-gray-600 mb-8 text-lg">
                Building a Respectful and Positive Community
              </p>

              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 mb-8">
                <p className="text-emerald-900 font-medium">
                  Droplink thrives on respect, inclusion, and positive interactions. These guidelines 
                  help ensure our community remains welcoming for everyone. When in doubt, treat others 
                  as you'd like to be treated.
                </p>
              </div>

              {/* Core Principles */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-6">
                  <Heart className="w-6 h-6 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Core Principles</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Be Respectful</h3>
                    <p className="text-gray-700">
                      Treat all community members with dignity. Respect differences in opinions, backgrounds, 
                      and experiences.
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Be Inclusive</h3>
                    <p className="text-gray-700">
                      Welcome people from all backgrounds. Don't discriminate based on race, gender, religion, 
                      sexuality, or any other characteristic.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Be Constructive</h3>
                    <p className="text-gray-700">
                      Provide feedback that helps others improve. Avoid personal attacks and focus on ideas 
                      instead of individuals.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Be Authentic</h3>
                    <p className="text-gray-700">
                      Be genuine in your interactions. Don't impersonate others or spread misinformation.
                    </p>
                  </div>
                </div>
              </div>

              {/* What We Support */}
              <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-8 mb-8">
                <div className="flex items-center mb-6">
                  <Lightbulb className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">What We Support</h2>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-4">✓</span>
                    <div>
                      <strong>Diverse Perspectives:</strong> We value different viewpoints and encourage thoughtful discussion.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-4">✓</span>
                    <div>
                      <strong>Peer Support:</strong> Help fellow community members and celebrate their achievements.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-4">✓</span>
                    <div>
                      <strong>Constructive Criticism:</strong> Offer feedback that's kind, specific, and helpful.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-4">✓</span>
                    <div>
                      <strong>Knowledge Sharing:</strong> Share your expertise and help others learn and grow.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-4">✓</span>
                    <div>
                      <strong>Positive Community Spaces:</strong> Create and participate in spaces that bring people together.
                    </div>
                  </li>
                </ul>
              </div>

              {/* What We Don't Allow */}
              <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-8 mb-8">
                <div className="flex items-center mb-6">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">What We Don't Allow</h2>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-4">✗</span>
                    <div>
                      <strong>Harassment & Bullying:</strong> Don't target, intimidate, or belittle anyone. This includes repeated unwanted contact.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-4">✗</span>
                    <div>
                      <strong>Hate Speech:</strong> We don't tolerate slurs, insults, or content promoting discrimination.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-4">✗</span>
                    <div>
                      <strong>Misinformation:</strong> Don't deliberately spread false information or conspiracy theories.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-4">✗</span>
                    <div>
                      <strong>Sexual Harassment:</strong> Any unwanted sexual content, advances, or comments are prohibited.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-4">✗</span>
                    <div>
                      <strong>Spam:</strong> Don't post repetitive content, excessive self-promotion, or commercial spam.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-4">✗</span>
                    <div>
                      <strong>Doxxing & Privacy Violations:</strong> Don't share others' personal information without consent.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Reporting & Support */}
              <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-8 mb-8">
                <div className="flex items-center mb-6">
                  <Flag className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Reporting & Support</h2>
                </div>
                
                <p className="text-gray-700 mb-6">
                  If you witness violations of these guidelines or feel unsafe, please report it immediately.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">How to Report</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Use the "Report" button on content or profiles</li>
                      <li>Contact our trust & safety team at <a href="mailto:safety@droplink.space" className="text-blue-600 hover:underline">safety@droplink.space</a></li>
                      <li>For urgent safety concerns, use our <Link to="/report-abuse" className="text-blue-600 hover:underline">abuse reporting form</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Confidentiality</h3>
                    <p className="text-gray-700">
                      We take all reports seriously and investigate confidentially. We'll keep your identity private 
                      unless required to disclose it.
                    </p>
                  </div>
                </div>
              </div>

              {/* Consequences */}
              <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Enforcement & Consequences</h2>
                
                <p className="text-gray-700 mb-6">
                  We enforce these guidelines consistently to protect our community:
                </p>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="font-semibold mb-2">Warnings</h3>
                    <p className="text-gray-700">First-time violations may result in a warning and notification.</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold mb-2">Content Removal</h3>
                    <p className="text-gray-700">Violating content will be removed from the platform.</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="font-semibold mb-2">Temporary Suspension</h3>
                    <p className="text-gray-700">Repeated violations may result in temporary account suspension.</p>
                  </div>
                  <div className="border-l-4 border-red-700 pl-4">
                    <h3 className="font-semibold mb-2">Permanent Ban</h3>
                    <p className="text-gray-700">Severe or repeated violations will result in permanent removal.</p>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-6">
                  <MessageSquare className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Get Help</h2>
                </div>
                
                <p className="text-gray-700 mb-6">
                  If you need support or have questions about these guidelines:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Link to="/contact" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all text-center font-semibold">
                    Contact Support
                  </Link>
                  <Link to="/help" className="border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition-all text-center font-semibold">
                    View Help Center
                  </Link>
                </div>
              </div>

              <div className="text-center text-gray-600 text-sm">
                <p>Last updated: December 7, 2025</p>
                <p className="mt-2">Questions? <Link to="/contact" className="text-primary hover:underline">Contact us</Link></p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityGuidelines;
