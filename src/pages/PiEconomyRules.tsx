import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoToTop from '@/components/GoToTop';
import { Droplet, ShieldCheck, Scale, AlertTriangle, CheckCircle, XCircle, FileText } from 'lucide-react';

const PiEconomyRules = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Pi Economy Rules - Droplink</title>
        <meta name="description" content="Rules and guidelines for Pi Network transactions and economy on Droplink." />
      </Helmet>
      <Navbar />
      <GoToTop />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-yellow-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Droplet className="w-12 h-12 text-sky-600 mr-4" />
                <h1 className="text-4xl font-bold text-gray-900">Pi Economy Rules</h1>
              </div>
              
              <p className="text-center text-gray-600 mb-8 text-lg">
                Last updated: December 7, 2025
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
                <p className="text-yellow-900 font-medium">
                  Droplink operates on the Pi Network blockchain. These rules govern all Pi-based transactions, 
                  payments, and economic activities on our platform to ensure fairness, security, and compliance.
                </p>
              </div>

              {/* Pi Network Integration */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pi Network Integration</h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Droplink is an official Pi Network app operating on the Pi Mainnet. All transactions 
                    are conducted using Pi cryptocurrency in accordance with Pi Network's policies.
                  </p>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3">Key Principles:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>✓ All Pi transactions are final and irreversible</li>
                      <li>✓ Transactions must be transparent and legitimate</li>
                      <li>✓ Users must comply with Pi Network's terms of service</li>
                      <li>✓ Only real goods/services can be exchanged for Pi</li>
                      <li>✓ No speculative or fraudulent activities allowed</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Acceptable Transactions */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Acceptable Pi Transactions</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-6">
                    <h3 className="font-bold text-lg mb-3">✓ Allowed Transactions:</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li>
                        <strong>Digital Products:</strong>
                        <p className="text-sm mt-1">eBooks, courses, templates, music, art, software, digital downloads</p>
                      </li>
                      <li>
                        <strong>Services:</strong>
                        <p className="text-sm mt-1">Consulting, coaching, design work, writing, programming, tutoring</p>
                      </li>
                      <li>
                        <strong>Physical Goods:</strong>
                        <p className="text-sm mt-1">Merchandise, handmade items, retail products (with proper shipping)</p>
                      </li>
                      <li>
                        <strong>Subscriptions:</strong>
                        <p className="text-sm mt-1">Recurring access to content, services, or communities</p>
                      </li>
                      <li>
                        <strong>Event Tickets:</strong>
                        <p className="text-sm mt-1">Virtual or physical event access</p>
                      </li>
                      <li>
                        <strong>Tips & Donations:</strong>
                        <p className="text-sm mt-1">Voluntary payments to support creators</p>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded">
                    <p className="font-semibold mb-2">Requirements for All Transactions:</p>
                    <ul className="text-sm space-y-1">
                      <li>• Clear product/service descriptions</li>
                      <li>• Accurate pricing in Pi</li>
                      <li>• Transparent terms and conditions</li>
                      <li>• Prompt delivery of goods/services</li>
                      <li>• Professional communication with buyers</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Prohibited Transactions */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <XCircle className="w-6 h-6 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Prohibited Pi Transactions</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-6">
                    <h3 className="font-bold text-lg mb-3 text-red-600">✗ Strictly Forbidden:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>
                        <strong>🚫 Currency Trading:</strong> Exchanging Pi for fiat currency or other cryptocurrencies
                      </li>
                      <li>
                        <strong>🚫 Speculative Activities:</strong> Treating Pi as an investment or trading commodity
                      </li>
                      <li>
                        <strong>🚫 Illegal Goods/Services:</strong> Drugs, weapons, stolen items, counterfeit products
                      </li>
                      <li>
                        <strong>🚫 Adult Services:</strong> Pornography, escort services, or adult content
                      </li>
                      <li>
                        <strong>🚫 Gambling:</strong> Lotteries, betting, games of chance for Pi
                      </li>
                      <li>
                        <strong>🚫 Pyramid Schemes:</strong> MLM schemes, get-rich-quick programs
                      </li>
                      <li>
                        <strong>🚫 Fake Products:</strong> Non-existent items, vaporware, or fraudulent services
                      </li>
                      <li>
                        <strong>🚫 Pi Sales:</strong> Selling Pi itself or Pi mining spots
                      </li>
                      <li>
                        <strong>🚫 Money Laundering:</strong> Using Pi to launder money or hide transactions
                      </li>
                      <li>
                        <strong>🚫 Price Manipulation:</strong> Artificially inflating or deflating Pi prices
                      </li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 p-4 rounded">
                    <p className="font-bold text-red-800 mb-2">⚠️ Violation Consequences:</p>
                    <ul className="text-sm space-y-1 text-red-700">
                      <li>• Immediate account suspension or termination</li>
                      <li>• Forfeiture of Pi balance on platform</li>
                      <li>• Report to Pi Network Core Team</li>
                      <li>• Potential legal action for serious violations</li>
                      <li>• Permanent ban from Droplink ecosystem</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Seller Responsibilities */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Seller Responsibilities</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">As a Pi Seller, You Must:</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border p-4 rounded">
                        <h4 className="font-semibold mb-2">📝 Product Listings</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Provide accurate descriptions</li>
                          <li>• Use clear product images</li>
                          <li>• Set fair prices in Pi</li>
                          <li>• Disclose any limitations</li>
                          <li>• Include delivery timeframes</li>
                        </ul>
                      </div>

                      <div className="border p-4 rounded">
                        <h4 className="font-semibold mb-2">🚚 Fulfillment</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Deliver as promised</li>
                          <li>• Respond to buyer inquiries</li>
                          <li>• Provide order updates</li>
                          <li>• Handle issues promptly</li>
                          <li>• Maintain quality standards</li>
                        </ul>
                      </div>

                      <div className="border p-4 rounded">
                        <h4 className="font-semibold mb-2">💬 Communication</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Be professional and courteous</li>
                          <li>• Respond within 24-48 hours</li>
                          <li>• Clarify expectations upfront</li>
                          <li>• Keep buyers informed</li>
                          <li>• Address complaints fairly</li>
                        </ul>
                      </div>

                      <div className="border p-4 rounded">
                        <h4 className="font-semibold mb-2">⚖️ Compliance</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Follow all Droplink rules</li>
                          <li>• Adhere to Pi Network policies</li>
                          <li>• Comply with local laws</li>
                          <li>• Report suspicious activities</li>
                          <li>• Maintain transaction records</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded">
                    <p className="font-semibold mb-2">🏆 Good Seller Practices:</p>
                    <ul className="text-sm space-y-1">
                      <li>• Over-deliver on promises</li>
                      <li>• Build positive reputation through reviews</li>
                      <li>• Offer excellent customer service</li>
                      <li>• Be transparent about any issues</li>
                      <li>• Honor refund policies when applicable</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Buyer Responsibilities */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <Scale className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Buyer Responsibilities</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">As a Pi Buyer, You Must:</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li>
                        <strong>Due Diligence:</strong> Research sellers and products before purchasing
                      </li>
                      <li>
                        <strong>Read Descriptions:</strong> Fully understand what you're buying
                      </li>
                      <li>
                        <strong>Verify Legitimacy:</strong> Check seller ratings and reviews
                      </li>
                      <li>
                        <strong>Communicate:</strong> Ask questions if anything is unclear
                      </li>
                      <li>
                        <strong>Complete Transactions:</strong> Don't request reversals without valid reason
                      </li>
                      <li>
                        <strong>Leave Reviews:</strong> Provide honest feedback about your experience
                      </li>
                      <li>
                        <strong>Report Issues:</strong> Contact Droplink if you encounter problems
                      </li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded">
                    <p className="font-semibold mb-2">🛡️ Protect Yourself:</p>
                    <ul className="text-sm space-y-1">
                      <li>• Be wary of deals that seem too good to be true</li>
                      <li>• Don't share personal information unnecessarily</li>
                      <li>• Keep records of all transactions</li>
                      <li>• Use Droplink's reporting system if something's wrong</li>
                      <li>• Don't engage in off-platform transactions</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pricing Guidelines */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing Guidelines</h2>
                
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold mb-3">Fair Pricing Principles:</h3>
                    <ul className="space-y-2">
                      <li>
                        <strong>Market-Based:</strong> Prices should reflect fair market value for goods/services
                      </li>
                      <li>
                        <strong>Transparent:</strong> No hidden fees or surprise charges
                      </li>
                      <li>
                        <strong>Consistent:</strong> Don't dramatically change prices to manipulate Pi value
                      </li>
                      <li>
                        <strong>Reasonable:</strong> Avoid price gouging or predatory pricing
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                    <p className="font-semibold text-yellow-800 mb-2">⚠️ Pricing Violations:</p>
                    <p className="text-sm text-yellow-700 mb-2">
                      The following pricing practices are prohibited:
                    </p>
                    <ul className="text-sm space-y-1 text-yellow-700">
                      <li>• Artificially inflating prices to drain buyer Pi</li>
                      <li>• Bait-and-switch pricing tactics</li>
                      <li>• Charging for non-existent value</li>
                      <li>• Colluding with others to fix prices</li>
                      <li>• Using deceptive pricing displays</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Dispute Resolution */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Dispute Resolution</h2>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-700">
                    If you have an issue with a Pi transaction:
                  </p>

                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold mb-1">Step 1: Contact the Other Party</h3>
                      <p className="text-sm text-gray-600">
                        Try to resolve the issue directly with the buyer/seller through messages
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-semibold mb-1">Step 2: Document Everything</h3>
                      <p className="text-sm text-gray-600">
                        Save screenshots, messages, and transaction details
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="font-semibold mb-1">Step 3: Contact Droplink Support</h3>
                      <p className="text-sm text-gray-600">
                        If unresolved after 48 hours, email{' '}
                        <a href="mailto:pi-support@droplink.space" className="text-primary hover:underline">
                          pi-support@droplink.space
                        </a>
                      </p>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h3 className="font-semibold mb-1">Step 4: Mediation</h3>
                      <p className="text-sm text-gray-600">
                        Droplink team will review evidence and mediate fairly
                      </p>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded text-sm">
                    <p className="font-semibold mb-2">Important Notes:</p>
                    <ul className="space-y-1">
                      <li>• Pi transactions are final and cannot be reversed</li>
                      <li>• Droplink does not hold funds in escrow</li>
                      <li>• Resolution may include refunds, replacements, or compensation</li>
                      <li>• Repeated disputes may result in account review</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pi Network Compliance */}
              <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Pi Network Compliance</h2>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Droplink is committed to full compliance with Pi Network's mainnet policies:
                  </p>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3">We Follow Pi Network Rules:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>✓ No fiat currency conversion or exchange</li>
                      <li>✓ Only real utility transactions allowed</li>
                      <li>✓ Full KYC compliance for high-value transactions</li>
                      <li>✓ Transparent transaction records</li>
                      <li>✓ Anti-money laundering (AML) measures</li>
                      <li>✓ Cooperation with Pi Core Team investigations</li>
                      <li>✓ Regular audits and reporting</li>
                    </ul>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p className="font-semibold mb-1">For Pi Network Policies:</p>
                    <p>
                      Visit{' '}
                      <a 
                        href="https://minepi.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline"
                      >
                        minepi.com
                      </a>{' '}
                      for official Pi Network terms and conditions
                    </p>
                  </div>
                </div>
              </div>

              {/* Reporting Violations */}
              <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Report Pi Economy Violations</h2>
                <p className="text-gray-700 mb-4">
                  Help us maintain a fair Pi economy by reporting violations:
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-1">Pi Transaction Issues:</p>
                    <a href="mailto:pi-support@droplink.space" className="text-primary hover:underline">
                      pi-support@droplink.space
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Fraud & Scams:</p>
                    <a href="mailto:fraud@droplink.space" className="text-primary hover:underline">
                      fraud@droplink.space
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Policy Violations:</p>
                    <a href="mailto:report@droplink.space" className="text-primary hover:underline">
                      report@droplink.space
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">General Support:</p>
                    <a href="mailto:support@droplink.space" className="text-primary hover:underline">
                      support@droplink.space
                    </a>
                  </div>
                </div>
              </div>

              {/* Related Policies */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Related Policies</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link to="/user-rules" className="text-primary hover:underline">
                    → User Rules
                  </Link>
                  <Link to="/terms" className="text-primary hover:underline">
                    → Terms of Service
                  </Link>
                  <Link to="/safety-guidelines" className="text-primary hover:underline">
                    → Safety Guidelines
                  </Link>
                  <Link to="/moderation-policy" className="text-primary hover:underline">
                    → Moderation Policy
                  </Link>
                  <Link to="/privacy" className="text-primary hover:underline">
                    → Privacy Policy
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

export default PiEconomyRules;
