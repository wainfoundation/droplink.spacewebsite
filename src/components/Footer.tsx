import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, HelpCircle, FileText, Users, Shield, Cookie, Link as LinkIcon, Activity, Home, User, BarChart3, Settings, Zap, Star, Heart, Play, Droplet, X, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AdAccessButton from '@/components/ads/AdAccessButton';

// X Icon Component (Twitter's new branding)
const XIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.97 6.75H2.556l7.73-8.835L1.488 2.25h6.767l4.682 6.18 5.371-6.18zM17.15 18.75h1.833L6.822 4.157H4.881l12.269 14.593z" />
  </svg>
);

const Footer = () => {
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isOfficialStatementModalOpen, setIsOfficialStatementModalOpen] = useState(false);
  const handleAdAccessGranted = () => {
    // Optionally show success message or redirect
    console.log('Ad access granted!');
  };

  return (
    <footer className="bg-muted py-16 px-4 relative overflow-hidden">
      {/* Quick Navigation Buttons */}
      <div className="container mx-auto mb-12">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Quick Navigation</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-2 sm:gap-3">
            <Link to="/" className="group">
              <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white transition-all duration-200">
                <Home className="w-4 h-4" />
                <span className="text-xs font-medium">Home</span>
              </Button>
            </Link>
            <Link to="/dashboard" className="group">
              <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white transition-all duration-200">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs font-medium">Dashboard</span>
              </Button>
            </Link>
            <Link to="/features" className="group">
              <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white transition-all duration-200">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-medium">Features</span>
              </Button>
            </Link>
            <Link to="/templates" className="group">
              <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white transition-all duration-200">
                <Star className="w-4 h-4" />
                <span className="text-xs font-medium">Templates</span>
              </Button>
            </Link>
            <Link to="/pricing" className="group">
              <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white transition-all duration-200">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-medium">Pricing</span>
              </Button>
            </Link>
            <Link to="/droppay" className="group">
              <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white transition-all duration-200">
                <LinkIcon className="w-4 h-4" />
                <span className="text-xs font-medium">DropPay</span>
              </Button>
            </Link>
            <Link to="/help" className="group">
              <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white transition-all duration-200">
                <HelpCircle className="w-4 h-4" />
                <span className="text-xs font-medium">Help</span>
              </Button>
            </Link>
            <a href="https://www.dropshops.space/" target="_blank" rel="noopener noreferrer" className="group">
              <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white transition-all duration-200">
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs font-medium">Dropstore</span>
              </Button>
            </a>
            {/* Removed Learn Dropstore, now all info is on /dropstore */}
            <Link to="/pi-blockchain-wallet" className="group">
              <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white transition-all duration-200">
                <Droplet className="w-4 h-4" />
                <span className="text-xs font-medium">Wallet</span>
              </Button>
            </Link>
            
            {/* Watch Ads Button */}
            <div className="group">
              <AdAccessButton
                onAccessGranted={handleAdAccessGranted}
                title="Watch Ad to Access Premium Features"
                description="Watch a Pi Network ad to access premium features and content."
                contentName="premium features"
                className="w-full h-12 flex flex-col items-center justify-center gap-1 transition-all duration-200"
                variant="outline"
                showPlanStatus={false}
              />
            </div>
          </div>
          
          {/* Second Row of Navigation Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-2 sm:gap-3 mt-4">
            <Link to="/about" className="group">
              <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white transition-all duration-200">
                <User className="w-4 h-4" />
                <span className="text-xs font-medium">About</span>
              </Button>
            </Link>
            <Link to="/contact" className="group">
              <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white transition-all duration-200">
                <Mail className="w-4 h-4" />
                <span className="text-xs font-medium">Contact</span>
              </Button>
            </Link>
            <Link to="/blog" className="group">
              <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white transition-all duration-200">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-medium">Blog</span>
              </Button>
            </Link>
            <Link to="/creator-directory" className="group">
              <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white transition-all duration-200">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">Creators</span>
                <span className="text-xs font-medium sm:hidden">Creator</span>
              </Button>
            </Link>
            <Link to="/status" className="group">
              <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white transition-all duration-200">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-medium">Status</span>
              </Button>
            </Link>
            <Link to="/developers" className="group">
              <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white transition-all duration-200">
                <LinkIcon className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">Developers</span>
                <span className="text-xs font-medium sm:hidden">Dev</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="space-y-6">
          <span className="font-bold text-xl text-sky-500">Droplink</span>
          <p className="text-sm">
            Unify your links, sell products, and earn Pi on Pi Network with one elegant page.
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com/droplinkspace" aria-label="Instagram" className="text-primary hover:text-secondary transition-colors">
              <Instagram size={24} />
            </a>
            <a href="https://twitter.com/droplink_space" aria-label="X (formerly Twitter)" className="text-sky-500 hover:text-sky-600 transition-colors">
              <XIcon size={24} />
            </a>
            <a href="https://facebook.com/droplinkspace" aria-label="Facebook" className="text-primary hover:text-secondary transition-colors">
              <Facebook size={24} />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-poppins font-semibold text-lg">Company</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-sm hover:text-primary transition-colors">About</Link></li>
            <li><Link to="/blog" className="text-sm hover:text-primary transition-colors">Blog</Link></li>
            <li><Link to="/careers" className="text-sm hover:text-primary transition-colors">Careers</Link></li>
            <li><Link to="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link></li>
            <li><Link to="/status" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <Activity size={16} /> System Status
            </Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-poppins font-semibold text-lg">Resources</h3>
          <ul className="space-y-2">
            <li><Link to="/help" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <HelpCircle size={16} /> Help Center
            </Link></li>
            <li><Link to="/templates" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <FileText size={16} /> Templates
            </Link></li>
            <li><Link to="/dropstore" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <ShoppingBag size={16} /> Dropstore
            </Link></li>
            <li><Link to="/droppay" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <LinkIcon size={16} /> DropPay
            </Link></li>
            <li><Link to="/creator-directory" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <Users size={16} /> Creator Directory
            </Link></li>
            <li><Link to="/developers" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <LinkIcon size={16} /> Developers
            </Link></li>
            <li><Link to="/pi-blockchain-wallet" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <Droplet size={16} /> Droplink Wallet
            </Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-poppins font-semibold text-lg">Legal</h3>
          <ul className="space-y-2">
            <li><Link to="/terms" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <FileText size={16} /> Terms of Service
            </Link></li>
            <li><Link to="/privacy" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <Shield size={16} /> Privacy Policy
            </Link></li>
            <li><Link to="/cookies" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <Cookie size={16} /> Cookie Policy
            </Link></li>
            <li>
              <button
                onClick={() => setIsLicenseModalOpen(true)}
                className="text-sm hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FileText size={16} /> Software License
              </button>
            </li>
            <li>
              <button
                onClick={() => setIsOfficialStatementModalOpen(true)}
                className="text-sm hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FileText size={16} /> Official Statement
              </button>
            </li>
            <li><Link to="/gdpr" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <Shield size={16} /> GDPR Compliance
            </Link></li>
            <li><Link to="/community-guidelines" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <Users size={16} /> Community Guidelines
            </Link></li>
            <li><Link to="/user-rules" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <Shield size={16} /> User Rules
            </Link></li>
            <li><Link to="/moderation-policy" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <Shield size={16} /> Moderation Policy
            </Link></li>
            <li><Link to="/safety-guidelines" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <Shield size={16} /> Safety Guidelines
            </Link></li>
            <li><Link to="/data-deletion" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <FileText size={16} /> Data Deletion
            </Link></li>
            <li><Link to="/report-abuse" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
              <HelpCircle size={16} /> Report Abuse
            </Link></li>
            <li>
              <a
                href="https://minepi.com/wp-content/uploads/2025/11/MiCA-Whitepaper-Pi-1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-primary transition-colors flex items-center gap-2"
              >
                <FileText size={16} /> MiCA Whitepaper
              </a>
            </li>
          </ul>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="font-poppins font-semibold text-lg mb-2">Subscribe</h3>
            <form className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                <Mail size={16} /> Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-12 pt-6 border-t border-gray-200 text-center text-sm">
        <p>© {new Date().getFullYear()} All rights reserved.</p>
        <p className="mt-2 text-xs text-gray-500">Built by the community, for the community. We are committed to helping creators thrive on Pi Network.</p>
      </div>

      {/* Software License Modal */}
      {isLicenseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Software License</h2>
                <p className="text-sm text-gray-600 mt-1">Copyright (C) 2025 MRWAIN ORGANIZATION</p>
              </div>
              <button
                onClick={() => setIsLicenseModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>Permission is hereby granted</strong> by the application software developer ("Software Developer"), free of charge, to any person obtaining a copy of this application, software and associated documentation files (the "Software"), which was developed by the Software Developer for use on Pi Network, whereby the purpose of this license is to permit the development of derivative works based on the Software, including the right to use, copy, modify, merge, publish, distribute, sub-license, and/or sell copies of such derivative works and any Software components incorporated therein, and to permit persons to whom such derivative works are furnished to do so, in each case, solely to develop, use and market applications for the official Pi Network.
              </p>

              <p>
                For purposes of this license, <strong>Pi Network</strong> shall mean any application, software, or other present or future platform developed, owned or managed by Pi Community Company, and its parents, affiliates or subsidiaries, for which the Software was developed, or on which the Software continues to operate. However, you are prohibited from using any portion of the Software or any derivative works thereof in any manner (a) which infringes on any Pi Network intellectual property rights, (b) to hack any of Pi Network's systems or processes or (c) to develop any product or service which is competitive with the Pi Network.
              </p>

              <p>
                The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
              </p>

              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <p className="font-semibold mb-2">DISCLAIMER OF WARRANTIES</p>
                <p>
                  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS, PUBLISHERS, OR COPYRIGHT HOLDERS OF THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO BUSINESS INTERRUPTION, LOSS OF USE, DATA OR PROFITS) HOWEVER CAUSED AND UNDER ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE) ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                </p>
              </div>

              <p>
                <strong>Pi, Pi Network</strong> and the <strong>Pi logo</strong> are trademarks of the Pi Community Company.
              </p>

              <p className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                Copyright (C) 2025 MRWAIN ORGANIZATION
              </p>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={() => setIsLicenseModalOpen(false)}
                className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-secondary transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Statement Modal */}
      {isOfficialStatementModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Official Statement</h2>
                <p className="text-sm text-gray-600 mt-1">MrWain Organization</p>
              </div>
              <button
                onClick={() => setIsOfficialStatementModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 text-sm text-gray-700 leading-relaxed">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Declaration of Independence</h3>
                <p>
                  The <strong>MrWain Organization</strong> operates as a fully independent, private institution with no affiliation, partnership, endorsement, or collaboration with any local or international government, governmental agency, regulatory body, or state-sponsored entity whatsoever.
                </p>

                <p>
                  We maintain a strict policy of non-participation in any governmental program, project, initiative, or partnership. This unwavering commitment to independence ensures the complete autonomy, privacy, and security of our developers, founders, and the communities we serve.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Mission & Focus</h3>
                <p>
                  The <strong>MrWain Organization</strong> is dedicated exclusively to the research, design, and development of innovative software applications within the Pi Network ecosystem, serving both current needs and future expansion of the decentralized economy.
                </p>

                <p>
                  Our mission is to deliver cutting-edge, secure, and high-quality digital solutions that generate tangible utility for the global Pi Network community. We are committed to advancing the ecosystem through technological innovation and practical application development.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Core Values & Commitment</h3>
                <p>
                  As a proudly independent entity, the <strong>MrWain Organization</strong> upholds the highest standards of:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Ethical Development:</strong> Maintaining integrity and responsible practices in all development activities</li>
                  <li><strong>Technological Excellence:</strong> Delivering superior quality and innovative solutions</li>
                  <li><strong>Decentralization Principles:</strong> Full alignment with the foundational values of decentralized systems</li>
                  <li><strong>Transparency & Security:</strong> Ensuring open communication and robust protection for all users</li>
                  <li><strong>Community First:</strong> Creating a forward-thinking environment that empowers builders and creators</li>
                </ul>
              </div>

              <p className="text-xs text-gray-600 italic pt-4">
                This statement reflects our organizational policy and is for informational purposes only; it does not constitute legal advice or a waiver of any rights or obligations.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 mt-6">
                <div className="text-center mb-6">
                  <p className="font-bold text-lg text-gray-900">© 2025 MrWain Organization</p>
                  <p className="text-sm text-gray-700 mt-2">All Rights Reserved</p>
                  <p className="mt-4 text-xs text-gray-600 italic">
                    This official statement is protected by copyright law. Unauthorized reproduction, distribution, modification, or use of this document or any portion thereof is strictly prohibited and may result in legal action.
                  </p>
                </div>
                
                <div className="border-t border-blue-300 pt-4 mt-4">
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-900">Officially Issued</p>
                      <p className="text-xs text-gray-600 mt-1">December 10, 2025</p>
                    </div>
                    
                    <div className="text-center mt-2">
                      <div className="font-signature text-2xl text-gray-800 mb-1" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                        MrWain Organization
                      </div>
                      <div className="h-px w-48 bg-gray-400 mx-auto"></div>
                      <p className="text-xs text-gray-600 mt-1">Authorized Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={() => setIsOfficialStatementModalOpen(false)}
                className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-secondary transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
