import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Play, BookOpen, Globe, Users, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PiDomainDetails = () => {
  const [selectedVideo, setSelectedVideo] = useState(0);

  const videos = [
    {
      id: 'IBWhF2OU3Ew',
      title: 'Getting Started with .pi Domains',
      shortUrl: 'https://youtube.com/shorts/IBWhF2OU3Ew?si=-YMKFl6YRsiN2Tqg',
      description: 'Learn the basics of .pi domains and how to get started with your Pi Network presence.'
    },
    {
      id: '4JDbLzXHGFE',
      title: 'Advanced .pi Domain Features',
      shortUrl: 'https://youtube.com/shorts/4JDbLzXHGFE?si=zVv8zJo0wugZwvMl',
      description: 'Explore advanced features and customization options for your .pi domain.'
    },
    {
      id: 'MfOVBHbgDK8',
      title: 'Building Your Pi Business Hub',
      shortUrl: 'https://youtube.com/shorts/MfOVBHbgDK8?si=dKUAt32TJl8dtzvn',
      description: 'Create a complete business hub using your .pi domain with Droplink.'
    }
  ];

  const features = [
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: 'Decentralized Domain',
      description: 'Own your .pi domain on the Pi Network blockchain with full control and ownership.'
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      title: 'Lightning Fast',
      description: 'Experience instant loading times and seamless integration with Pi Network.'
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: 'Secure & Private',
      description: 'Your data is protected with Pi Network\'s blockchain security protocols.'
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: 'Community Driven',
      description: 'Join thousands of Pi pioneers building their digital presence.'
    },
    {
      icon: <BookOpen className="w-8 h-8 text-orange-500" />,
      title: 'Easy to Learn',
      description: 'Intuitive setup process with comprehensive guides and support.'
    },
    {
      icon: <Play className="w-8 h-8 text-red-500" />,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides to help you master .pi domains.'
    }
  ];

  const benefits = [
    {
      title: 'Professional Identity',
      items: [
        'Establish credibility in the Pi Network ecosystem',
        'Create a memorable, branded web presence',
        'Stand out from regular web addresses'
      ]
    },
    {
      title: 'Business Opportunities',
      items: [
        'Accept payments in Pi cryptocurrency',
        'Sell digital and physical products',
        'Monetize your audience with multiple revenue streams'
      ]
    },
    {
      title: 'Community Connection',
      items: [
        'Connect with other Pi Network members',
        'Build your fanbase and community',
        'Access exclusive Pi Network features'
      ]
    },
    {
      title: 'Technical Advantages',
      items: [
        'Decentralized domain ownership',
        'Built-in blockchain integration',
        'Future-proof technology stack'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>.pi Domain Details - Learn More About Pi Network Domains | Droplink</title>
        <meta name="description" content="Learn everything about .pi domains, how to set them up, and how to use them with Droplink to build your Pi Network business hub." />
        <meta name="keywords" content=".pi domain, pi network, blockchain, decentralized domain, pi browser, droplink" />
        <meta property="og:title" content=".pi Domain Details - Learn More About Pi Network Domains" />
        <meta property="og:description" content="Learn everything about .pi domains and build your Pi Network presence with Droplink." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen w-full bg-gradient-to-br from-background via-muted/20 to-primary/10">
        <Navbar />
        
        <main className="w-full overflow-x-hidden">
          {/* Hero Section */}
          <section className="relative py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent mb-6">
                  .pi Domain Details
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                  Discover everything about .pi domains, the decentralized web addresses built for the Pi Network ecosystem. Learn how to get started and build your digital presence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="https://domains.pinet.com/" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 w-full">
                      <Globe className="mr-2 h-5 w-5" />
                      Get Your .pi Domain
                    </Button>
                  </a>
                  <Button size="lg" variant="outline">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Read the Guide
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Video Learning Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Learn with Video Tutorials</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Watch our comprehensive video guides to master .pi domains
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Video Player */}
                <div className="lg:col-span-2">
                  <div className="bg-black rounded-lg overflow-hidden shadow-2xl aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videos[selectedVideo].id}?autoplay=1&controls=1`}
                      title={videos[selectedVideo].title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <div className="mt-6">
                    <h3 className="text-2xl font-bold mb-2">{videos[selectedVideo].title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      {videos[selectedVideo].description}
                    </p>
                    <a
                      href={videos[selectedVideo].shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80 transition-colors"
                    >
                      <Play className="h-4 w-4" />
                      Watch on YouTube
                    </a>
                  </div>
                </div>

                {/* Video Playlist Sidebar */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold mb-4">Video Series</h3>
                  {videos.map((video, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVideo(index)}
                      className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                        selectedVideo === index
                          ? 'bg-primary text-white shadow-lg'
                          : 'bg-muted hover:bg-muted/80 text-foreground border border-transparent hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Play className={`h-5 w-5 flex-shrink-0 mt-0.5 ${selectedVideo === index ? 'text-white' : 'text-primary'}`} />
                        <div>
                          <p className="font-semibold">{video.title}</p>
                          <p className={`text-sm ${selectedVideo === index ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                            {video.description.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Key Features</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Discover what makes .pi domains the future of digital identity
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="mb-4">{feature.icon}</div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose .pi Domains?</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Unlock powerful benefits for your Pi Network journey
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {benefits.map((benefit, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {benefit.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3">
                            <span className="text-primary font-bold mt-1">✓</span>
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Where to Get Your .pi Domain Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-blue-500/5 border-2 border-primary/20">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    <Globe className="inline-block mr-3 h-8 w-8 text-primary" />
                    Where to Get Your .pi Domain
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Ready to claim your .pi domain? Visit the official Pi Network domains marketplace:
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-primary p-6 bg-primary/5 rounded-r-lg">
                    <h3 className="text-2xl font-bold mb-2">Pi Network Domains</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Visit the official Pi Network domains marketplace to register and manage your .pi domain.
                    </p>
                    <a 
                      href="https://domains.pinet.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors"
                    >
                      <span className="text-lg">domains.pinet.com</span>
                      <Globe className="h-5 w-5" />
                    </a>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm font-semibold text-primary mb-2">✓ Official Source</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Direct from Pi Network</p>
                    </div>
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm font-semibold text-primary mb-2">✓ Secure</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Blockchain verified</p>
                    </div>
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm font-semibold text-primary mb-2">✓ Easy Setup</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Quick registration</p>
                    </div>
                  </div>

                  <a 
                    href="https://domains.pinet.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                      <Globe className="mr-2 h-5 w-5" />
                      Go to domains.pinet.com
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Getting Started Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Getting Started</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Follow these simple steps to launch your .pi domain
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    step: '1',
                    title: 'Sign Up',
                    description: 'Create your Droplink account using your Pi Network credentials.'
                  },
                  {
                    step: '2',
                    title: 'Claim Your Domain',
                    description: 'Choose and claim your unique .pi domain name.'
                  },
                  {
                    step: '3',
                    title: 'Customize Your Profile',
                    description: 'Add your content, links, and branding to your profile.'
                  },
                  {
                    step: '4',
                    title: 'Go Live',
                    description: 'Launch your .pi domain and start connecting with your audience.'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <a href="https://domains.pinet.com/" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Globe className="mr-2 h-5 w-5" />
                    Start Your .pi Domain Journey
                  </Button>
                </a>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    q: 'What exactly is a .pi domain?',
                    a: 'A .pi domain is a decentralized web address built on the Pi Network blockchain. It represents your unique identity in the Pi ecosystem and gives you a memorable way for others to find your profile.'
                  },
                  {
                    q: 'How is a .pi domain different from a regular domain?',
                    a: '.pi domains are decentralized and stored on the Pi Network blockchain, giving you full ownership and control. Regular domains require annual renewals from centralized providers.'
                  },
                  {
                    q: 'Can I use my .pi domain with Droplink?',
                    a: 'Absolutely! Droplink is built to seamlessly integrate with .pi domains, allowing you to create a complete business hub with payments, content, and community features.'
                  },
                  {
                    q: 'What can I do with a .pi domain?',
                    a: 'You can create a professional profile, sell digital products, accept Pi payments, build a community, share content, and establish your presence in the Pi Network ecosystem.'
                  }
                ].map((item, index) => (
                  <div key={index} className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-bold mb-3">{item.q}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-blue-500/10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Build Your .pi Domain?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of Pi pioneers creating their digital presence with .pi domains and Droplink.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://domains.pinet.com/" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 w-full">
                    Get Started Now
                  </Button>
                </a>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PiDomainDetails;
