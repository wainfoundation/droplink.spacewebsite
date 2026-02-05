import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShoppingBag, BookOpen, Globe, Users, Zap, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <ShoppingBag className="w-8 h-8 text-primary" />,
    title: 'Digital Storefront',
    description: 'Create your own online store to sell digital products, services, or physical goods with ease.'
  },
  {
    icon: <Globe className="w-8 h-8 text-blue-500" />,
    title: 'Global & Decentralized',
    description: 'Powered by blockchain and Pi Network for secure, borderless transactions.'
  },
  {
    icon: <Zap className="w-8 h-8 text-yellow-500" />,
    title: 'Instant Payments',
    description: 'Accept Pi, DROP tokens, and more with seamless, instant payments.'
  },
  {
    icon: <Shield className="w-8 h-8 text-green-500" />,
    title: 'Secure & Private',
    description: 'Your store and customer data are protected with advanced blockchain security.'
  },
  {
    icon: <Users className="w-8 h-8 text-purple-500" />,
    title: 'Community Driven',
    description: 'Join a growing network of creators, businesses, and entrepreneurs.'
  },
  {
    icon: <BookOpen className="w-8 h-8 text-orange-500" />,
    title: 'Easy to Use',
    description: 'Launch your store in minutes with intuitive tools and templates.'
  }
];

const benefits = [
  {
    title: 'Why Choose Dropstore?',
    items: [
      'No coding required – anyone can launch a store',
      'Customizable storefronts to match your brand',
      'Low fees and instant global payments',
      'Decentralized, secure, and privacy-focused',
      'Community support and resources',
    ],
  },
  {
    title: 'What You Get',
    items: [
      'A beautiful, customizable storefront',
      'Access to Pi Network and DROP token payments',
      'Easy product management and analytics',
      'Marketing tools and integrations',
      'A growing network of buyers and sellers',
    ],
  },
];


export default function LearnMoreDropstore() {
  return (
    <div>
      <Helmet>
        <title>Learn More About Dropstore</title>
      </Helmet>
      <Navbar />
      <main>
        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">Learn More About Dropstore</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <Card key={idx} className="shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-center mb-2">{feature.icon}</div>
                    <CardTitle className="text-lg font-semibold text-center">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, idx) => (
                <Card key={idx} className="shadow">
                  <CardHeader>
                    <CardTitle>{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {benefit.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-lg text-gray-700 mb-6">
              Join the future of digital commerce. Launch your Dropstore today and reach a global audience with Pi Network.
            </p>
            <a href="https://www.dropshops.space/" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Get Started with Dropstore
              </Button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
