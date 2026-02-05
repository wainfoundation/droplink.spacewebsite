
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShoppingBag, BookOpen, Globe, Users, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GoToTop from '@/components/GoToTop';

const productCards = [
  {
    title: 'Ultimate Social Media Guide (eBook)',
    description: 'A comprehensive digital guide to mastering social media marketing for your business. Includes actionable tips, strategies, and templates for all major platforms.\n\nNote: This is an example eBook product.',
    price: '12 Pi',
    image: 'https://i.ibb.co/hRnQLnTg/il-1140x-N-7471592514-1zt3.jpg',
    url: 'https://www.dropshops.space/',
    rating: 5,
    feedback: '“This eBook transformed my business! The strategies are easy to follow and really work.”',
    user: '— Priya S.',
    story: 'Priya used the guide to grow her Instagram following from 500 to 5,000 in just 3 months.'
  },
  {
    title: 'Canva Social Media Templates',
    description: 'A bundle of 30+ professionally designed Canva templates for Instagram, Facebook, and Twitter. Perfect for boosting your brand’s online presence.\n\nNote: This is an example digital product.',
    price: '15 Pi',
    image: 'https://i.ibb.co/r2DZ0W37/il-794x-N-7118214085-oik3.webp',
    url: 'https://www.dropshops.space/',
    rating: 5,
    feedback: '“The templates saved me hours of design time and my posts look so professional now!”',
    user: '— Alex T.',
    story: 'Alex launched a new product line and doubled engagement using these templates.'
  },
  {
    title: 'Startup Business Plan PDF',
    description: 'A downloadable, editable business plan template for startups and entrepreneurs. Includes financial projections, market analysis, and pitch deck slides.\n\nNote: This is an example digital product.',
    price: '20 Pi',
    image: 'https://i.ibb.co/fdKbkRPW/il-794x-N-7486568594-rgq7.webp',
    url: 'https://www.dropshops.space/',
    rating: 5,
    feedback: '“The business plan template made my investor pitch a breeze. Highly recommended!”',
    user: '— Samuel K.',
    story: 'Samuel secured his first round of funding after using this business plan.'
  }
];

export default function DropstoreShowcase() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Dropstore - The Future Digital Marketplace</title>
        <meta name="description" content="Dropstore is your next-generation digital storefront for creators, businesses, and entrepreneurs. Powered by Pi Network and blockchain." />
      </Helmet>
      <Navbar />
      <main className="flex-grow">
        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">Dropstore: Your Digital Storefront</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Features from LearnMoreDropstore */}
              {[
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
              ].map((feature, idx) => (
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

        {/* Product Cards Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productCards.map((product, idx) => (
                <div key={idx} className="rounded-lg shadow-md overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                    <div className="flex items-center mb-2">
                      {[...Array(product.rating)].map((_, i) => (
                        <span key={i} aria-label="star" className="text-yellow-400 text-lg">★</span>
                      ))}
                      <span className="ml-2 text-sm text-gray-500">5.0</span>
                    </div>
                    <p className="text-gray-600 mb-2">{product.description}</p>
                    <div className="mb-2 italic text-gray-700">{product.feedback} <span className="not-italic font-medium">{product.user}</span></div>
                    <div className="mb-4 text-xs text-gray-500">{product.story}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{product.price}</span>
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-4 rounded block text-center"
                      >
                        Buy Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
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
              ].map((benefit, idx) => (
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
      <GoToTop />
    </div>
  );
}

