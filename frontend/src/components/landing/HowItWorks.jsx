// src/components/landing/HowItWorks.jsx
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, CheckCircle, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: MapPin,
    step: '01',
    title: 'Spot the Issue',
    description: 'Identify a road problem in your area—pothole, crack, or damaged signage.',
    color: 'from-blue-500 to-blue-600',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Camera,
    step: '02',
    title: 'Report Instantly',
    description: 'Upload photos, add location, and describe the issue through our simple form.',
    color: 'from-purple-500 to-purple-600',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: CheckCircle,
    step: '03',
    title: 'Track Progress',
    description: 'Government officials review, prioritize, and assign your report to maintenance teams.',
    color: 'from-green-500 to-green-600',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    icon: Bell,
    step: '04',
    title: 'Get Updates',
    description: 'Receive real-time notifications as your report moves from pending to resolved.',
    color: 'from-orange-500 to-orange-600',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
            Simple Process
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How RoadSense.ai Works
          </h2>
          <p className="text-xl text-gray-600">
            From reporting to resolution in four simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Step Card */}
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-500 group">
                    {/* Step Number Badge */}
                    <div className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {step.step}
                    </div>

                    {/* Icon */}
                    <div className={`${step.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md`}>
                      <Icon className={step.iconColor} size={32} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Connecting Arrow (Desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M8 16H24M24 16L18 10M24 16L18 22" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
