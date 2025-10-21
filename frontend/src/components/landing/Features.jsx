// src/components/landing/Features.jsx
import { Card } from '@/components/ui/card';
import { Users, Building2, BarChart3, Bell, Map, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Users,
    title: 'Citizen Reporting',
    description: 'Report potholes, cracks, and road hazards with photos and GPS location in seconds.',
    color: 'from-blue-500 to-blue-600',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Building2,
    title: 'Government Dashboard',
    description: 'Centralized system to track, prioritize, and assign maintenance tasks efficiently.',
    color: 'from-green-500 to-green-600',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Data-driven insights for budget planning and resource allocation decisions.',
    color: 'from-purple-500 to-purple-600',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Models',
    description: 'ML-powered seasonal forecasting to prevent road deterioration proactively.',
    color: 'from-orange-500 to-orange-600',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    icon: Map,
    title: 'Interactive Maps',
    description: 'Visualize road conditions with heat maps and filter by severity or location.',
    color: 'from-cyan-500 to-cyan-600',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
  },
  {
    icon: Bell,
    title: 'Status Updates',
    description: 'Automatic notifications keep citizens informed about their report progress.',
    color: 'from-pink-500 to-pink-600',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            Built for All Stakeholders
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Comprehensive Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Designed for citizens, government officials, and administrators
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer">
                  {/* Icon */}
                  <div className={`${feature.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md`}>
                    <Icon className={feature.iconColor} size={32} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Bottom Gradient Bar */}
                  <div className={`mt-6 h-1 bg-gradient-to-r ${feature.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
