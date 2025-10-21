// src/components/landing/Hero.jsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Sparkles, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
      {/* Subtle Animated Background */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Minimal Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white space-y-8"
            >
              {/* Minimal Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
              >
                <Sparkles className="text-yellow-300" size={16} />
                <span className="text-sm font-medium text-white">AI-Powered Infrastructure</span>
              </motion.div>

              {/* Main Heading - Reduced Size */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                  <span className="text-white">Report Issues</span>
                  <br />
                  <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                    Drive Change
                  </span>
                </h1>
              </motion.div>

              {/* Description - Concise */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/80 max-w-xl leading-relaxed"
              >
                Real-time road reporting platform connecting citizens with government for faster infrastructure solutions.
              </motion.p>

              {/* CTA Buttons - Simplified */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/register/citizen">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-6 text-base w-full sm:w-auto group"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                  </Button>
                </Link>
                <Link to="/map">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-6 text-base w-full sm:w-auto group"
                  >
                    <MapPin className="mr-2" size={18} />
                    <span>View Map</span>
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Stats - Minimal & Inline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-6 pt-4"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-300" size={20} />
                  <span className="text-white/90 text-sm font-medium">10,000+ Users</span>
                </div>
                <div className="h-4 w-px bg-white/30"></div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-300" size={20} />
                  <span className="text-white/90 text-sm font-medium">85% Resolution</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Illustration - Cleaner Design */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden lg:block relative"
            >
              {/* Main Visual Card */}
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl">
                  {/* Map Preview */}
                  <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 h-80 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    {/* Subtle pattern */}
                    <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>
                    
                    {/* Icon */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <MapPin className="text-white relative z-10" size={80} />
                    </motion.div>
                  </div>
                </div>

                {/* Floating Stat Cards - Minimal */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-white rounded-2xl px-6 py-3 shadow-2xl"
                >
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">85%</p>
                  <p className="text-xs text-gray-600 font-medium">Resolved</p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-6 py-3 shadow-2xl"
                >
                  <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">24/7</p>
                  <p className="text-xs text-gray-600 font-medium">Support</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}