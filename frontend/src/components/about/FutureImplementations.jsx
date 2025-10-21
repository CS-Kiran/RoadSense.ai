// src/components/about/FutureImplementations.jsx
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Bot, Smartphone, Globe, Bell, Rocket, TrendingUp } from 'lucide-react';

export default function FutureImplementations() {
  const futureFeatures = [
    {
      icon: Bot,
      title: 'AI-Powered Image Recognition',
      description: 'Automatic pothole detection and severity classification using computer vision models.',
      timeline: 'Q2 2026',
      status: 'In Development',
      statusColor: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    {
      icon: Smartphone,
      title: 'Native Mobile Apps',
      description: 'Dedicated iOS and Android applications with offline reporting capabilities.',
      timeline: 'Q3 2026',
      status: 'Planned',
      statusColor: 'bg-gray-100 text-gray-700 border-gray-200',
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Platform localization for regional languages to improve accessibility across diverse communities.',
      timeline: 'Q4 2026',
      status: 'Planned',
      statusColor: 'bg-gray-100 text-gray-700 border-gray-200',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Intelligent alert system with customizable notification preferences and escalation rules.',
      timeline: 'Q1 2026',
      status: 'Planned',
      statusColor: 'bg-gray-100 text-gray-700 border-gray-200',
    },
    {
      icon: Rocket,
      title: 'API Integration',
      description: 'Public API for third-party integrations with municipal management systems.',
      timeline: 'Q2 2026',
      status: 'Planned',
      statusColor: 'bg-gray-100 text-gray-700 border-gray-200',
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics Dashboard',
      description: 'Enhanced visualization tools with custom report generation and export capabilities.',
      timeline: 'Q3 2026',
      status: 'In Progress',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-indigo-100 text-indigo-600 border-indigo-200 px-4 py-2">
            Roadmap
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Future Implementations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Continuous innovation to enhance functionality, accessibility, and impact
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {futureFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white">
                  {/* Timeline Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-xs font-semibold">
                      {feature.timeline}
                    </Badge>
                    <Badge className={`text-xs border ${feature.statusColor}`}>
                      {feature.status}
                    </Badge>
                  </div>

                  {/* Icon */}
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                    <Icon className="text-blue-600" size={24} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
