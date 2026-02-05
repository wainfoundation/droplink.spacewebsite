import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import PiDomainFeatures from "@/components/PiDomainFeatures";
import PiDomainSetup from "@/components/PiDomainSetup";
import PiDomainShowcase from "@/components/PiDomainShowcase";
import Features from "@/components/Features";
import PiDomainTestimonials from "@/components/PiDomainTestimonials";
import HowItWorks from "@/components/HowItWorks";
import DemoSection from "@/components/DemoSection";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import CommunityLove from "@/components/CommunityLove";
import TemplatesShowcase from "@/components/TemplatesShowcase";
import CustomerSuccessStories from "@/components/CustomerSuccessStories";
import AppInfo from "@/components/AppInfo";
import GoToTop from "@/components/GoToTop";
import WorkflowShowcase from "@/components/WorkflowShowcase";
import { Helmet } from "react-helmet-async";

const Home = () => {
    // State to track if mobile preview is working
    const [isMobilePreviewWorking, setIsMobilePreviewWorking] = useState(true);
  return (
    <>
      <Helmet>
        <title>Connect Your .pi Domain to Droplink - Pi Network Link Hub</title>
        <meta name="description" content="Transform your .pi domain into a powerful business hub. Connect to Droplink for Pi payments, professional profiles, and seamless Pi Browser integration." />
        <meta name="keywords" content="pi domain, pi network, droplink, link in bio, pi payments, pi browser" />
        <meta property="og:title" content="Connect Your .pi Domain to Droplink - Pi Network Link Hub" />
        <meta property="og:description" content="Transform your .pi domain into a powerful business hub. Connect to Droplink for Pi payments, professional profiles, and seamless Pi Browser integration." />
        <meta property="og:url" content="https://droplinkspace" />
      </Helmet>
      
      <div className="min-h-screen w-full bg-gradient-to-br from-background via-muted/20 to-primary/10">
        <Navbar />
        <main className="w-full overflow-x-hidden">
          <Hero />
          
          {/* Enhanced mobile spacing and layout */}
          <div className="relative w-full">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent pointer-events-none" />
            
            {/* Mobile-optimized sections with better spacing */}
            <div className="w-full space-y-8 sm:space-y-12 md:space-y-16">
              <PiDomainFeatures />
              <PiDomainShowcase />
              <CustomerSuccessStories />
              {/* Dropstore Learn More Showcase */}
              <section className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 my-8">
                <h2 className="text-2xl font-bold mb-4">Discover Dropstore</h2>
                <p className="text-lg text-gray-700 mb-4">
                  Dropstore is the next-generation digital storefront platform for creators, businesses, and entrepreneurs. Learn how you can launch your own store and accept Pi payments globally.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/dropstore">
                    <button className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-6 rounded text-lg transition">Learn More About Dropstore</button>
                  </a>
                  <a href="https://www.dropshops.space/" target="_blank" rel="noopener noreferrer">
                    <button className="bg-secondary hover:bg-secondary/80 text-white font-bold py-2 px-6 rounded text-lg transition">Visit Dropstore</button>
                  </a>
                </div>
              </section>

              {/* DropPay Showcase */}
              <section className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg shadow-lg p-6 my-8">
                <h2 className="text-2xl font-bold mb-4">Experience DropPay</h2>
                <p className="text-lg text-gray-700 mb-4">
                  DropPay is your secure, instant payment solution for Pi Network. Send, receive, and manage Pi payments with ease. Built for creators, businesses, and the entire Pi community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/droppay">
                    <button className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-6 rounded text-lg transition">Learn More About DropPay</button>
                  </a>
                  <a href="https://droppay.space/" target="_blank" rel="noopener noreferrer">
                    <button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold py-2 px-6 rounded text-lg transition">Launch DropPay</button>
                  </a>
                </div>
              </section>
              <WorkflowShowcase />
              <PiDomainSetup />
              <HowItWorks />
              <DemoSection />
              <Features />
              <TemplatesShowcase />
              <PiDomainTestimonials />
              <CommunityLove />
              <FAQ />
              <AppInfo />
            </div>
          </div>
          <CTA />
        </main>
        <Footer />
        <GoToTop />
      </div>
    </>
  );
};

export default Home;
