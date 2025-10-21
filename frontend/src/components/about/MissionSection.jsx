// src/components/about/MissionSection.jsx
import { Card } from '@/components/ui/card';
import { Target, Heart, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MissionSection() {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To empower citizens and government officials with a centralized, data-driven platform that transforms how road infrastructure is reported, managed, and maintained across urban and rural areas.',
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Heart,
      title: 'Our Vision',
      description: 'A future where every pothole, crack, and road hazard is reported, tracked, and resolved efficiently—creating safer roads and stronger communities through technology and collaboration.',
      gradient: 'from-red-500 to-rose-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      icon: Lightbulb,
      title: 'Our Values',
      description: 'Transparency, accountability, and innovation drive everything we do. We believe in the power of community-driven solutions and data-informed decision making for public infrastructure.',
      gradient: 'from-amber-500 to-yellow-600',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  {/* Icon */}
                  <div className={`${value.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md`}>
                    <Icon className={value.iconColor} size={32} />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>

                  {/* Bottom Accent */}
                  <div className={`mt-6 h-1 bg-gradient-to-r ${value.gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}