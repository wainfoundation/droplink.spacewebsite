import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet, CheckCircle, Shield, Users, TrendingUp, Lock, Eye, FileText } from 'lucide-react';
import GoToTop from '@/components/GoToTop';

const Transparency = () => {
  return (
    <>
      <Helmet>
        <title>Transparency - Droplink</title>
        <meta name="description" content="Droplink operates with full transparency on the Pi Network blockchain. Learn about our commitment to openness and accountability." />
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-center mb-6">
              <Droplet className="w-16 h-16 text-white/80" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
              Transparency & Trust
            </h1>
            <p className="text-xl text-center text-blue-100 max-w-3xl mx-auto">
              Last updated: December 7, 2025
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg mb-12">
              <p className="text-lg text-gray-800">
                Droplink operates on the Pi Network blockchain. These rules govern all Pi-based transactions, payments, and economic activities on our platform to ensure fairness, security, and compliance.
              </p>
            </div>

            {/* Pi Network Integration */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <Droplet className="w-8 h-8 text-primary" />
                  Pi Network Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-gray-700">
                  Droplink is an official Pi Network app operating on the Pi Mainnet. All transactions are conducted using Pi cryptocurrency in accordance with Pi Network's policies.
                </p>

                <div className="bg-blue-50 rounded-lg p-6 mt-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                    Key Principles:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>All Pi transactions are final and irreversible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Transactions must be transparent and legitimate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Users must comply with Pi Network's terms of service</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Only real goods/services can be exchanged for Pi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>No speculative or fraudulent activities allowed</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Acceptable Pi Transactions */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                  Acceptable Pi Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-blue-600" />
                    Allowed Transactions:
                  </h4>
                  <ul className="space-y-2 pl-6">
                    <li className="list-disc">Digital products (templates, graphics, software)</li>
                    <li className="list-disc">Services (consulting, design, development)</li>
                    <li className="list-disc">Educational content (courses, tutorials)</li>
                    <li className="list-disc">Subscriptions for ongoing value</li>
                    <li className="list-disc">Tips and donations for content creators</li>
                    <li className="list-disc">Legitimate business transactions</li>
                  </ul>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <h4 className="text-lg font-bold mb-3 text-red-800">
                    Prohibited Transactions:
                  </h4>
                  <ul className="space-y-2 pl-6 text-red-700">
                    <li className="list-disc">Speculative investments or Ponzi schemes</li>
                    <li className="list-disc">Money laundering or fraudulent activities</li>
                    <li className="list-disc">Fake products or services</li>
                    <li className="list-disc">Manipulation of Pi value or markets</li>
                    <li className="list-disc">Illegal goods or services</li>
                    <li className="list-disc">Circumventing Pi Network policies</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Security */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Shield className="w-7 h-7 text-blue-600" />
                  Transaction Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  All Pi transactions on Droplink are secured through:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <Lock className="w-6 h-6 text-blue-600 mb-2" />
                    <h4 className="font-bold mb-2">Blockchain Security</h4>
                    <p className="text-sm text-gray-600">Pi Network's blockchain ensures all transactions are immutable and verifiable</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-600 mb-2" />
                    <h4 className="font-bold mb-2">Transaction Monitoring</h4>
                    <p className="text-sm text-gray-600">We actively monitor for suspicious activity and fraud prevention</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600 mb-2" />
                    <h4 className="font-bold mb-2">User Verification</h4>
                    <p className="text-sm text-gray-600">KYC verification through Pi Network ensures authentic users</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600 mb-2" />
                    <h4 className="font-bold mb-2">Dispute Resolution</h4>
                    <p className="text-sm text-gray-600">Fair process for handling transaction disputes and issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Users className="w-7 h-7 text-purple-600" />
                  User Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 mb-4">
                  As a Droplink user conducting Pi transactions, you agree to:
                </p>
                <ol className="space-y-3 pl-6 list-decimal">
                  <li><strong>Provide accurate information</strong> about products and services</li>
                  <li><strong>Deliver promised goods/services</strong> in a timely manner</li>
                  <li><strong>Respond to customer inquiries</strong> and support requests</li>
                  <li><strong>Comply with all applicable laws</strong> and regulations</li>
                  <li><strong>Maintain honest pricing</strong> and transparent business practices</li>
                  <li><strong>Report suspicious activity</strong> to Droplink support</li>
                  <li><strong>Respect intellectual property</strong> and copyright laws</li>
                  <li><strong>Follow Pi Network's ecosystem rules</strong> at all times</li>
                </ol>
              </CardContent>
            </Card>

            {/* Enforcement */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Shield className="w-7 h-7 text-red-600" />
                  Enforcement & Consequences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Violations of these Pi Economy Rules may result in:
                </p>
                <ul className="space-y-2 pl-6 list-disc">
                  <li>Account suspension or permanent ban</li>
                  <li>Transaction reversals where possible</li>
                  <li>Removal of products or services from the platform</li>
                  <li>Reporting to Pi Network for ecosystem-level action</li>
                  <li>Legal action in cases of fraud or criminal activity</li>
                  <li>Forfeiture of earnings from prohibited activities</li>
                </ul>

                <div className="bg-blue-50 p-4 rounded-lg mt-6">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> We reserve the right to investigate any transaction or user activity that appears to violate these rules. Your cooperation with investigations is required as a condition of using Droplink.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reporting */}
            <Card className="mb-12 border-primary">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Droplet className="w-7 h-7 text-primary" />
                  Report Violations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">
                  Help us maintain a safe and fair Pi economy. If you observe suspicious activity or violations of these rules:
                </p>
                <div className="bg-slate-50 p-6 rounded-lg text-center">
                  <p className="text-lg font-semibold mb-2">Contact Us</p>
                  <p className="text-gray-600 mb-4">Email: compliance@droplink.space</p>
                  <p className="text-sm text-gray-500">
                    All reports are confidential and taken seriously. Include as much detail as possible to help us investigate.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Updates to These Rules</h3>
              <p className="text-gray-700">
                We may update these Pi Economy Rules as the Pi Network ecosystem evolves and regulations change. Continued use of Droplink constitutes acceptance of any updates. Major changes will be communicated via email and platform notifications.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
      <GoToTop />
    </>
  );
};

export default Transparency;
