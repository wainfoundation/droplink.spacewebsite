import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoToTop from '@/components/GoToTop';
import { Trash2, Lock, Download, Shield, Clock, FileText, CheckCircle } from 'lucide-react';

const DataDeletion = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Data Deletion & Account Removal - Droplink</title>
        <meta name="description" content="Learn how to delete your Droplink account and personal data." />
      </Helmet>
      <Navbar />
      <GoToTop />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-red-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Trash2 className="w-12 h-12 text-red-600 mr-4" />
                <h1 className="text-4xl font-bold text-gray-900">Data Deletion & Account Removal</h1>
              </div>
              
              <p className="text-center text-gray-600 mb-8 text-lg">
                How to Delete Your Account and Personal Data
              </p>

              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
                <p className="text-red-900 font-medium">
                  We respect your right to privacy and data ownership. You can delete your account 
                  and request removal of your personal data at any time. This is a permanent action 
                  that cannot be undone.
                </p>
              </div>

              {/* Quick Start */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start: Delete Your Account</h2>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-600 text-white font-bold">1</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Log in to Your Account</h3>
                      <p className="text-gray-700">Visit <a href="https://droplink.space" className="text-blue-600 hover:underline">droplink.space</a> and sign in with your credentials.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-600 text-white font-bold">2</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Go to Settings</h3>
                      <p className="text-gray-700">Navigate to Dashboard → Settings → Account Settings</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-600 text-white font-bold">3</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Scroll to Danger Zone</h3>
                      <p className="text-gray-700">Find the "Delete Account" section at the bottom of the settings page.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-600 text-white font-bold">4</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Confirm Deletion</h3>
                      <p className="text-gray-700">Click "Delete Account" and follow the confirmation prompts. You'll be asked to type "DELETE" to confirm.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What Gets Deleted */}
              <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What Gets Deleted</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Account Data</h3>
                      <p className="text-gray-700">Your profile, username, email, and authentication credentials</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Personal Information</h3>
                      <p className="text-gray-700">Bio, profile picture, links, and custom content</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Activity Data</h3>
                      <p className="text-gray-700">Your activity history, login records, and preferences</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Associated Content</h3>
                      <p className="text-gray-700">Links, bio pages, and any content you created on the platform</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What We Keep */}
              <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Legal Retention Requirements</h2>
                
                <p className="text-gray-700 mb-6">
                  While we delete most of your data immediately, we may retain limited information for:
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-gray-600 font-bold mr-3">•</span>
                    <div>
                      <strong>Legal Compliance:</strong> Financial records and tax obligations (up to 7 years)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 font-bold mr-3">•</span>
                    <div>
                      <strong>Fraud Prevention:</strong> Transaction records to prevent fraud (up to 2 years)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 font-bold mr-3">•</span>
                    <div>
                      <strong>Law Enforcement:</strong> Information required by law enforcement agencies
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 font-bold mr-3">•</span>
                    <div>
                      <strong>Dispute Resolution:</strong> Records necessary for handling disputes or claims
                    </div>
                  </li>
                </ul>
              </div>

              {/* Timeline */}
              <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-8 mb-8">
                <div className="flex items-center mb-6">
                  <Clock className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Deletion Timeline</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-lg mb-1">Immediate (0-1 hours)</h3>
                    <p className="text-gray-700">
                      Your account becomes inaccessible and your profile is removed from public view
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-lg mb-1">Short-term (1-7 days)</h3>
                    <p className="text-gray-700">
                      Most personal data is deleted from our active systems and backups
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-lg mb-1">Long-term (7-30 days)</h3>
                    <p className="text-gray-700">
                      Remaining data is removed from archived backups and caches
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Download */}
              <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-8 mb-8">
                <div className="flex items-center mb-6">
                  <Download className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Download Your Data First</h2>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Before deleting your account, you can download a copy of your data for your records:
                </p>
                
                <div className="bg-white p-6 rounded border border-green-200 mb-6">
                  <h3 className="font-semibold mb-4">How to Download Your Data:</h3>
                  <ol className="space-y-2 list-decimal list-inside text-gray-700">
                    <li>Go to Settings → Account Settings</li>
                    <li>Click "Download Your Data"</li>
                    <li>Select the data types you want (profiles, links, activity, etc.)</li>
                    <li>A ZIP file will be prepared and sent to your email</li>
                    <li>Download your data before it expires (7 days)</li>
                  </ol>
                </div>
                
                <p className="text-gray-700">
                  Your data download will be encrypted and you'll receive it as a ZIP file containing JSON files.
                </p>
              </div>

              {/* GDPR Rights */}
              <div className="bg-indigo-50 rounded-lg shadow-sm border border-indigo-200 p-8 mb-8">
                <div className="flex items-center mb-6">
                  <Shield className="w-6 h-6 text-indigo-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Your Rights (GDPR & Privacy Laws)</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Right to be Forgotten</h3>
                    <p className="text-gray-700">
                      You have the right to request deletion of your personal data. We'll process deletion requests 
                      within 30 days as required by GDPR and other privacy regulations.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Right to Data Portability</h3>
                    <p className="text-gray-700">
                      You can request a copy of your data in a portable format for transfer to another service.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Right to Rectification</h3>
                    <p className="text-gray-700">
                      You can correct inaccurate personal information at any time through your account settings.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Right to Restrict Processing</h3>
                    <p className="text-gray-700">
                      You can request that we limit how we use your data while your deletion request is processed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Important Notes</h2>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-3">!</span>
                    <div>
                      <strong>Permanent Action:</strong> Account deletion is permanent and cannot be reversed. 
                      Your username cannot be reused afterward.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-3">!</span>
                    <div>
                      <strong>Active Subscriptions:</strong> Any active subscriptions will be cancelled. 
                      Refunds follow our refund policy.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-3">!</span>
                    <div>
                      <strong>Content Removal:</strong> Your public profiles, links, and published content 
                      will be removed from search and view.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-3">!</span>
                    <div>
                      <strong>References Remain:</strong> References to your username in comments or forums 
                      from other users may persist but won't link to a profile.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Contact Support */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Need Help?</h2>
                
                <p className="text-gray-700 mb-6">
                  If you have questions about data deletion or need assistance with your deletion request:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <a href="mailto:privacy@droplink.space" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all text-center font-semibold">
                    Email Privacy Team
                  </a>
                  <Link to="/contact" className="border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition-all text-center font-semibold">
                    Contact Support
                  </Link>
                </div>
              </div>

              <div className="text-center text-gray-600 text-sm mt-8">
                <p>For more information about your privacy rights, see our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></p>
                <p className="mt-2">Last updated: December 7, 2025</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DataDeletion;
