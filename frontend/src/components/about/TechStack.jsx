// src/components/about/TechStack.jsx
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function TechStack() {
  const techCategories = [
    {
      category: 'Frontend',
      icon: '⚛️',
      gradient: 'from-blue-500 to-cyan-600',
      technologies: [
        { name: 'React.js', description: 'Modern UI library' },
        { name: 'Vite', description: 'Fast build tool' },
        { name: 'Tailwind CSS', description: 'Utility-first styling' },
        { name: 'shadcn/ui', description: 'Component library' },
      ],
    },
    {
      category: 'Backend',
      icon: '🚀',
      gradient: 'from-green-500 to-emerald-600',
      technologies: [
        { name: 'FastAPI', description: 'High-performance Python framework' },
        { name: 'Python', description: 'Core backend language' },
      ],
    },
    {
      category: 'Database',
      icon: '🗄️',
      gradient: 'from-purple-500 to-indigo-600',
      technologies: [
        { name: 'PostgreSQL', description: 'Relational database' },
        { name: 'PostGIS', description: 'Geospatial extension' },
      ],
    },
    {
      category: 'Machine Learning',
      icon: '🤖',
      gradient: 'from-orange-500 to-red-600',
      technologies: [
        { name: 'TensorFlow', description: 'Deep learning models' },
        { name: 'scikit-learn', description: 'ML algorithms' },
        { name: 'Pandas', description: 'Data processing' },
      ],
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-purple-100 text-purple-600 border-purple-200 px-4 py-2">
            Technology Stack
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Built with Modern Technology
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leveraging cutting-edge tools and frameworks to deliver a robust, scalable, and intelligent platform
          </p>
        </motion.div>

        {/* Tech Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {techCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                {/* Category Header */}
                <div className="mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {category.category}
                  </h3>
                </div>

                {/* Technologies List */}
                <div className="space-y-3">
                  {category.technologies.map((tech, techIndex) => (
                    <div key={techIndex} className="group/tech">
                      <p className="font-semibold text-gray-900 text-sm group-hover/tech:text-blue-600 transition-colors">
                        {tech.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {tech.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
