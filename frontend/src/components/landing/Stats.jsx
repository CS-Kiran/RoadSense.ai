// src/components/landing/Stats.jsx
import { motion } from 'framer-motion';
import { TrendingUp, Award, Globe, Zap } from 'lucide-react';

const stats = [
  { 
    value: '10K+', 
    label: 'Reports Submitted',
    icon: TrendingUp,
    color: 'from-blue-500 to-blue-600',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  { 
    value: '85%', 
    label: 'Resolution Rate',
    icon: Award,
    color: 'from-green-500 to-green-600',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  { 
    value: '50+', 
    label: 'Cities Covered',
    icon: Globe,
    color: 'from-purple-500 to-purple-600',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  { 
    value: '24/7', 
    label: 'Real-time Tracking',
    icon: Zap,
    color: 'from-orange-500 to-orange-600',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
];

export default function Stats() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            Our Impact
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Making a Real Difference
          </h2>
          <p className="text-xl text-gray-600">
            Real numbers, measurable results
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative group"
              >
                {/* Card */}
                <div className="relative bg-white border-2 border-gray-100 rounded-3xl p-8 text-center transform group-hover:scale-105 group-hover:border-gray-200 transition-all duration-300 shadow-lg group-hover:shadow-2xl">
                  {/* Icon */}
                  <div className={`${stat.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className={stat.iconColor} size={32} />
                  </div>

                  {/* Value */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <p className={`text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                      {stat.value}
                    </p>
                    <p className="text-gray-600 font-semibold">
                      {stat.label}
                    </p>
                  </motion.div>

                  {/* Bottom Accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center`}></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
