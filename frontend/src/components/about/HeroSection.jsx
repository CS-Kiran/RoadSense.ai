// src/components/about/HeroSection.jsx
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <Badge className="mb-6 bg-white/10 backdrop-blur-sm text-white border-white/20 px-4 py-2 text-sm">
              About RoadSense.ai
            </Badge>

            {/* Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Building Better Roads,
              <span className="block mt-2 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                One Report at a Time
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              RoadSense.ai is a civic engagement platform that bridges the gap between citizens and government authorities for proactive road infrastructure management through crowdsourced reporting and predictive analytics.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
