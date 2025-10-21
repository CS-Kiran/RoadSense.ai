// src/pages/NotFound.jsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home, MapPin, ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 404 Number - Large and Bold */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-9xl lg:text-[12rem] font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent leading-none">
                404
              </h1>
            </motion.div>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Compass className="text-white" size={48} />
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Road Not Found
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
            >
              We couldn't find the page you're looking for. Let's get you back on track.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-6 text-base w-full sm:w-auto group"
                >
                  <Home className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                  <span>Back to Home</span>
                </Button>
              </Link>
              <Link to="/map">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 backdrop-blur-sm font-medium px-8 py-6 text-base w-full sm:w-auto transition-all duration-300"
                >
                  <MapPin className="mr-2" size={20} />
                  <span>View Map</span>
                </Button>
              </Link>
            </motion.div>

            {/* Help Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10"
            >
              <Link to="/help" className="text-white/80 hover:text-white text-sm inline-flex items-center gap-2 transition-colors">
                Need help? Visit our Help Center
                <ArrowLeft className="rotate-180" size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}