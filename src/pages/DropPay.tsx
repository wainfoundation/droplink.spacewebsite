import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Wallet, Send, ArrowRightLeft, Shield, Zap, Globe, 
  Link, BarChart3, Code, ShoppingCart, Bell, TrendingUp, 
  Users, Lock, CreditCard, Smartphone, FileText, Webhook
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GoToTop from '@/components/GoToTop';

export default function DropPay() {
  const [isEUUK, setIsEUUK] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const EU_COUNTRIES = new Set([
      'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',
      'IS','LI','NO','GB','UK'
    ]);
    (async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const code = (data?.country_code || '').toUpperCase();
        if (!cancelled) setIsEUUK(EU_COUNTRIES.has(code));
      } catch {
        if (!cancelled) setIsEUUK(null);
      }
    })();
    return () => { cancelled = true; };
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>DropPay - Accept Pi Payments Everywhere | Secure Payment Solution</title>
        <meta name="description" content="The simplest way to accept Pi cryptocurrency payments. Create payment links, embed checkout widgets, and manage transactions seamlessly with enterprise-grade security." />
      </Helmet>
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-primary/5">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Accept Pi Payments Everywhere</h1>
            <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
              The simplest way to accept Pi cryptocurrency in your apps and websites. Create payment links, embed checkout widgets, and manage transactions seamlessly.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span>Instant Setup - Start in minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span>Secure - Enterprise-grade security</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <span>Global - Accept Pi worldwide</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
                onClick={() => window.open('https://droppay.space/', '_blank')}
              >
                Start Accepting Pi
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-6 text-lg"
                onClick={() => window.open('https://droppay.space/', '_blank')}
              >
                View API Docs
              </Button>
            </div>
          </div>
        </section>

        {/* Performance Stats */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-y">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">&lt;100ms</div>
                <div className="text-gray-600">Response Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                <div className="text-gray-600">Active Merchants</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-center">Everything you need to accept Pi</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Powerful features designed for businesses of all sizes
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Link className="w-10 h-10 text-primary" />,
                  title: 'Payment Links',
                  description: 'Create shareable payment links in seconds. No coding required. Perfect for social media and email.'
                },
                {
                  icon: <BarChart3 className="w-10 h-10 text-blue-500" />,
                  title: 'Merchant Dashboard',
                  description: 'Monitor your payments, track revenue, and manage your business all in one place.'
                },
                {
                  icon: <Code className="w-10 h-10 text-green-500" />,
                  title: 'Developer API',
                  description: 'Powerful REST API with webhooks for seamless integration into any application.'
                },
                {
                  icon: <ShoppingCart className="w-10 h-10 text-purple-500" />,
                  title: 'Embeddable Checkout',
                  description: 'Add a beautiful checkout widget to your website with just a few lines of code.'
                },
                {
                  icon: <FileText className="w-10 h-10 text-orange-500" />,
                  title: 'Transaction History',
                  description: 'Complete visibility into all your transactions with search, filter, and export.'
                },
                {
                  icon: <Bell className="w-10 h-10 text-red-500" />,
                  title: 'Webhook Notifications',
                  description: 'Get instant notifications when payments are completed via webhooks.'
                }
              ].map((feature, idx) => (
                <Card key={idx} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-primary">
                  <CardHeader>
                    <div className="flex items-center justify-center mb-3">{feature.icon}</div>
                    <CardTitle className="text-xl font-semibold text-center">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Methods Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-center">Build once, share everywhere</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Every builder outputs link + embed + QR code for maximum flexibility
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Payment Links & Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Generate shareable Pi checkout links with the invoice preset baked in. Every link ships with a redirect, QR, and embed snippet ready to drop anywhere.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Invoice preset included</li>
                    <li>✓ Link + embed + QR</li>
                    <li>✓ Dashboard + API creation</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Buttons, Cart, Donate, Subscribe</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Use the builders to create buttons that output the same trio: shareable link, iframe embed, and QR. Each flow includes 3-step helper guidance.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Cart, donate, subscribe presets</li>
                    <li>✓ Absolute URLs for sharing</li>
                    <li>✓ Inline "how it works" guidance</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Merchant Pay Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Spin up product pages with variants and images, then share one code. Customers get clean checkout, and you get analytics plus QR + embed.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Multi-item with images</li>
                    <li>✓ Share or embed instantly</li>
                    <li>✓ Tracks conversions + redirects</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-center">How DropPay Works</h2>
            <p className="text-center text-gray-600 mb-12">Start accepting Pi payments in three simple steps</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Sign Up & Get Your API Key',
                  description: 'Create your free account in seconds. Get instant access to your dashboard and API credentials. No credit card required to start.',
                  features: ['Instant account activation', 'Secure API key generation', 'Full dashboard access']
                },
                {
                  step: '2',
                  title: 'Create Payment Links',
                  description: 'Generate payment links through our dashboard or API. Customize the amount, description, and success URL. Share anywhere - social media, email, or embed in your app.',
                  features: ['Create links via dashboard or API', 'Customizable checkout pages', 'QR codes for easy sharing']
                },
                {
                  step: '3',
                  title: 'Get Paid Instantly',
                  description: 'When customers pay, you\'re notified instantly via webhooks. Funds are verified on the Pi blockchain and credited to your wallet. Track everything in real-time.',
                  features: ['Real-time webhook notifications', 'Blockchain verification', 'Automatic withdrawal to Pi wallet']
                }
              ].map((step, idx) => (
                <Card key={idx} className="shadow-lg">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <CardTitle className="text-xl font-semibold text-center">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 text-center">{step.description}</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {step.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-center">Enterprise-Grade Features</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Everything you need to scale your Pi payment infrastructure
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <Webhook className="w-8 h-8 text-primary" />, title: 'Powerful Webhooks', description: 'Real-time notifications with retry logic' },
                { icon: <BarChart3 className="w-8 h-8 text-blue-500" />, title: 'Advanced Analytics', description: 'Deep insights into payment data' },
                { icon: <Lock className="w-8 h-8 text-red-500" />, title: 'Enterprise Security', description: 'Bank-level encryption & blockchain verified' },
                { icon: <Globe className="w-8 h-8 text-green-500" />, title: 'Global Coverage', description: 'Accept Pi from anywhere worldwide' },
                { icon: <Zap className="w-8 h-8 text-yellow-500" />, title: 'Lightning Fast', description: 'Sub-100ms response time' },
                { icon: <Users className="w-8 h-8 text-purple-500" />, title: 'Customer Management', description: 'Built-in customer database' },
                { icon: <Code className="w-8 h-8 text-orange-500" />, title: 'Developer Tools', description: 'SDKs for all major languages' },
                { icon: <TrendingUp className="w-8 h-8 text-pink-500" />, title: 'Revenue Optimization', description: 'Maximize conversion rates' },
                { icon: <CreditCard className="w-8 h-8 text-indigo-500" />, title: 'Multiple Payment Methods', description: 'Links, widgets, QR codes, API' },
                { icon: <Shield className="w-8 h-8 text-cyan-500" />, title: 'Fraud Prevention', description: 'ML-powered fraud detection' },
                { icon: <FileText className="w-8 h-8 text-teal-500" />, title: 'Automated Invoicing', description: 'Generate and track invoices' },
                { icon: <Smartphone className="w-8 h-8 text-rose-500" />, title: 'Mobile Optimized', description: 'Perfect on iOS and Android' }
              ].map((feature, idx) => (
                <Card key={idx} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-center mb-2">{feature.icon}</div>
                    <CardTitle className="text-base font-semibold text-center">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-center">Built for Every Business</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              From startups to enterprises, DropPay scales with your needs
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: '🛍️ E-Commerce',
                  description: 'Perfect for online stores selling digital or physical products. Accept Pi payments seamlessly with automatic order fulfillment.',
                  features: ['Automatic inventory sync', 'Order management', 'Customer notifications', 'Refund handling']
                },
                {
                  title: '💼 SaaS & Subscriptions',
                  description: 'Ideal for subscription-based services. Automate recurring billing, trial periods, and upgrade flows.',
                  features: ['Recurring payments', 'Usage-based billing', 'Plan management', 'Dunning automation']
                },
                {
                  title: '🏪 Marketplaces',
                  description: 'Build multi-vendor marketplaces with split payments. Manage seller payouts and platform fees effortlessly.',
                  features: ['Split payments', 'Seller dashboards', 'Commission management', 'Escrow support']
                },
                {
                  title: '💝 Donations & Crowdfunding',
                  description: 'Accept donations for your cause or crowdfund your project. Track donors and send automated thank-you messages.',
                  features: ['One-time & recurring', 'Donor management', 'Campaign tracking', 'Tax receipts']
                },
                {
                  title: '🎮 Gaming & NFTs',
                  description: 'Monetize your game or sell digital collectibles. Perfect for in-game purchases and NFT marketplaces.',
                  features: ['In-game purchases', 'NFT payments', 'Virtual goods', 'Instant delivery']
                },
                {
                  title: '📚 Education & Courses',
                  description: 'Sell online courses, tutorials, and educational content. Manage student access and course enrollment.',
                  features: ['Course payments', 'Student management', 'Certificate delivery', 'Lifetime access']
                }
              ].map((useCase, idx) => (
                <Card key={idx} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{useCase.description}</p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {useCase.features.map((feature, i) => (
                        <li key={i}>✓ {feature}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mrwain Ecosystem Integration */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-center">Seamless Integration with Mrwain Ecosystem</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              DropPay works perfectly with Droplink and Dropstore, creating a complete business solution
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="shadow-xl border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <span className="bg-primary text-white px-3 py-1 rounded">DL</span>
                    Droplink
                  </CardTitle>
                  <p className="text-gray-600">Link Management Platform</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Monetize your shortened links with Pi payments. Create payment gates, track clicks, and earn from your shared content - all integrated with DropPay.
                  </p>
                  <ul className="space-y-2 mb-4 text-sm text-gray-600">
                    <li>✓ Monetize shortened links with Pi</li>
                    <li>✓ Payment-gated content access</li>
                    <li>✓ Real-time analytics & earnings</li>
                    <li>✓ Automatic payment processing</li>
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open('https://droplink.space/', '_blank')}
                  >
                    Visit Droplink
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <span className="bg-primary text-white px-3 py-1 rounded">DS</span>
                    Dropstore
                  </CardTitle>
                  <p className="text-gray-600">E-Commerce Platform</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Build your online store and accept Pi payments seamlessly. Sell digital and physical products with automatic order fulfillment powered by DropPay.
                  </p>
                  <ul className="space-y-2 mb-4 text-sm text-gray-600">
                    <li>✓ Complete e-commerce solution</li>
                    <li>✓ Inventory & order management</li>
                    <li>✓ Secure Pi payment checkout</li>
                    <li>✓ Multi-vendor marketplace support</li>
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open('https://dropshops.space/', '_blank')}
                  >
                    Visit Dropstore
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">The Complete Mrwain Ecosystem</CardTitle>
                <p className="text-center text-gray-600">Three powerful platforms working together to grow your business</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-primary text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      DL
                    </div>
                    <h4 className="font-semibold mb-1">Droplink</h4>
                    <p className="text-sm text-gray-600">Link monetization & management</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      DP
                    </div>
                    <h4 className="font-semibold mb-1">DropPay</h4>
                    <p className="text-sm text-gray-600">Payment processing infrastructure</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      DS
                    </div>
                    <h4 className="font-semibold mb-1">Dropstore</h4>
                    <p className="text-sm text-gray-600">E-commerce & marketplace platform</p>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-6">
                  Powered by Mrwain Organization • Building the future of Pi Network commerce
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-center">Simple, Transparent Pricing</h2>
            <p className="text-center text-gray-600 mb-12">Choose the plan that fits your business. All plans include Pi Network integration.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: 'Free',
                  price: 'π 0',
                  period: '/monthly',
                  description: 'Perfect for getting started',
                  features: ['1 Payment Link', 'Basic analytics', '1% platform fee', 'Community support'],
                  cta: 'Get Started Free'
                },
                {
                  name: 'Basic',
                  price: 'π 10',
                  period: '/monthly',
                  description: 'For small businesses',
                  features: ['5 Payment Links', 'Basic analytics', '0.75% platform fee', 'Email support'],
                  cta: 'Subscribe for π10/mo'
                },
                {
                  name: 'Pro',
                  price: 'π 20',
                  period: '/monthly',
                  description: 'Best for growing businesses',
                  features: ['10 Payment Links', 'Advanced analytics', '0.5% platform fee', 'Priority support', 'Custom branding', 'Tracking links'],
                  cta: 'Subscribe for π20/mo',
                  popular: true
                },
                {
                  name: 'Enterprise',
                  price: 'π 50',
                  period: '/monthly',
                  description: 'For large scale operations',
                  features: ['Unlimited Payment Links', 'Full analytics suite', '0% platform fee', '24/7 Priority support', 'Custom integrations', 'Dedicated account manager'],
                  cta: 'Subscribe for π50/mo'
                }
              ].map((plan, idx) => (
                <Card key={idx} className={`shadow-lg ${plan.popular ? 'border-2 border-primary ring-2 ring-primary/20' : ''} relative`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => window.open('https://droppay.space/', '_blank')}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* GDPR / Data Requests (EU/UK) */}
        {isEUUK && (
          <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-t">
            <div className="max-w-5xl mx-auto">
              <Card className="shadow-sm border">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" /> Privacy & Data Requests (GDPR)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    If you are located in the UK or the EU, you can submit a GDPR data subject request regarding your personal data related to Pi Network.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      className="w-full sm:w-auto"
                      onClick={() => window.open('https://app.prighter.com/portal/16457313501', '_blank')}
                    >
                      Request Your Data via Prighter
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => window.open('/gdpr', '_self')}
                    >
                      Learn About GDPR on DropPay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary to-primary/80 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Accept Pi Payments?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of merchants already using DropPay to process secure, instant Pi Network transactions. Start accepting Pi in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-gray-100 px-10 py-6 text-lg font-semibold"
                onClick={() => window.open('https://droppay.space/', '_blank')}
              >
                Get Started with DropPay
              </Button>
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-6 text-lg font-semibold"
                onClick={() => window.open('https://droppay.space/', '_blank')}
              >
                Read Documentation
              </Button>
            </div>
            <p className="text-sm mt-6 opacity-75">
              No credit card required • Instant setup • Free plan available
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <GoToTop />
    </div>
  );
}
