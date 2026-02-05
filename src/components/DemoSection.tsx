
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Users, Globe, Zap } from "lucide-react";
import YouTubePlayer from "./YouTubePlayer";

const DemoSection = () => {
  return (
    <section className="py-20 md:py-32 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Professional background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-purple-100/20"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="w-full relative z-10 px-4 md:px-8 lg:px-12">
        {/* Professional Header Section */}
        <div className="text-center space-y-8 mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Live Demo Available
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
            <span className="block mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                See Droplink
              </span>
            </span>
            <span className="block">
              <span className="text-gray-900">in </span>
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
                Action
              </span>
            </span>
          </h2>
          
          {/* Professional Description */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Watch how creators are transforming their{" "}
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              .pi domains
            </span>{" "}
            into{" "}
            <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              powerful business hubs
            </span>{" "}
            with professional profiles and seamless Pi payments
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="group text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Profiles</h3>
              <p className="text-sm text-gray-600">Real-time profile updates and analytics</p>
            </div>
            
            <div className="group text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Globe className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pi Integration</h3>
              <p className="text-sm text-gray-600">Seamless Pi Network payments and features</p>
            </div>
            
            <div className="group text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real Results</h3>
              <p className="text-sm text-gray-600">Proven success with measurable outcomes</p>
            </div>
          </div>
        </div>

        {/* Professional Video Section - Full Width */}
        <div className="mb-16 -mx-4 md:-mx-8 lg:-mx-12">
          <YouTubePlayer />
        </div>

        {/* Enhanced Stats Section */}
        <div className="text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/50 shadow-xl">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Join the Pi Creator Revolution
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Thousands of creators are already using Droplink to monetize their Pi Network presence and build professional profiles.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent mb-2">2,000+</div>
                <div className="text-sm md:text-base text-gray-600 font-medium">Active Creators</div>
                <div className="text-xs text-gray-500 mt-1">Growing daily</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent mb-2">50,000+</div>
                <div className="text-sm md:text-base text-gray-600 font-medium">Links Created</div>
                <div className="text-xs text-gray-500 mt-1">Professional profiles</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent mb-2">100π+</div>
                <div className="text-sm md:text-base text-gray-600 font-medium">Earned by Creators</div>
                <div className="text-xs text-gray-500 mt-1">Real Pi payments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
