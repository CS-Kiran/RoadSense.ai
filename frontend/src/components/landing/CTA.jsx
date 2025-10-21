// src/components/landing/CTA.jsx
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-50"></div>
      <div className="absolute inset-0 bg-grid-slate-100 bg-[size:40px_40px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          {/* Main Card */}
          <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-3xl p-12 lg:p-16 shadow-2xl relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

            <div className="relative z-10 text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 mb-6"
              >
                <Sparkles className="text-yellow-300 animate-pulse" size={18} />
                <span className="text-sm font-semibold text-white">Join the Movement</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Ready to Make a<br />
                <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  Real Difference?
                </span>
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium"
              >
                Join thousands of citizens working together to improve road infrastructure and create safer communities
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 justify-center mb-12"
              >
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 px-10 py-7 text-lg group"
                  >
                    <Users className="mr-2 group-hover:scale-110 transition-transform" size={22} />
                    <span>Get Started as Citizen</span>
                  </Button>
                </Link>
                <Link to="/register/official">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 px-10 py-7 text-lg group"
                  >
                    <Shield className="mr-2 group-hover:scale-110 transition-transform" size={22} />
                    <span>Register as Official</span>
                  </Button>
                </Link>
              </motion.div>            
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
