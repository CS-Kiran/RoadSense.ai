import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export default function TechStack() {
  const techCategories = [
    {
      category: 'Frontend',
      icon: '⚛️',
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
      technologies: [
        { name: 'FastAPI', description: 'High-performance Python framework' },
        { name: 'Python', description: 'Core backend language' },
      ],
    },
    {
      category: 'Database',
      icon: '🗄️',
      technologies: [
        { name: 'PostgreSQL', description: 'Primary database' },
      ],
    },
    {
      category: 'Machine Learning',
      icon: '🤖',
      technologies: [
        { name: 'TensorFlow', description: 'Deep learning models' },
        { name: 'scikit-learn', description: 'ML algorithms' },
        { name: 'Pandas', description: 'Data processing' },
      ],
    },
  ]

  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4">
            Technology Stack
          </Badge>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Built with Modern Technology
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Leveraging cutting-edge tools and frameworks to deliver a robust, scalable, and intelligent civic engagement platform
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {techCategories.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  <h3 className="text-xl font-bold">{category.category}</h3>
                </div>
                <div className="space-y-3">
                  {category.technologies.map((tech) => (
                    <div key={tech.name} className="border-l-2 border-primary/30 pl-3">
                      <div className="font-semibold text-sm">{tech.name}</div>
                      <div className="text-xs text-muted-foreground">{tech.description}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
