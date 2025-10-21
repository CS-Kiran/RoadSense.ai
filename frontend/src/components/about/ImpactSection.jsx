// src/components/about/ImpactSection.jsx
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Shield, Zap } from 'lucide-react';

export default function ImpactSection() {
  const impacts = [
    {
      icon: Users,
      title: 'Citizen Empowerment',
      description: 'Give citizens a voice in infrastructure management with real-time reporting capabilities and transparent status tracking.',
      stats: '10K+ active users',
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: TrendingUp,
      title: 'Data-Driven Decisions',
      description: 'Enable government officials to prioritize maintenance based on severity, location patterns, and predictive analytics.',
      stats: '85% faster response',
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: Shield,
      title: 'Improved Safety',
      description: 'Proactive identification and resolution of road hazards reduces accidents and improves public safety.',
      stats: '40% fewer incidents',
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: Zap,
      title: 'Resource Optimization',
      description: 'Predictive models help allocate budgets efficiently by forecasting seasonal deterioration patterns.',
      stats: '30% cost savings',
      gradient: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-600 border-blue-200 px-4 py-2">
            Our Impact
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Making a Real Difference
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transforming road infrastructure management through technology and community engagement
          </p>
        </motion.div>

        {/* Impact Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {impacts.map((impact, index) => {
            const Icon = impact.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white">
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div className={`${impact.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md`}>
                      <Icon className={impact.iconColor} size={28} />
                    </div>

                    <div className="flex-1">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {impact.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {impact.description}
                      </p>

                      {/* Stats Badge */}
                      <Badge className={`bg-gradient-to-r ${impact.gradient} text-white border-0 px-3 py-1`}>
                        {impact.stats}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}