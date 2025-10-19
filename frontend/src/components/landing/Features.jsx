import { Card } from '@/components/ui/card'
import { Users, Building2, BarChart3, Bell, Map, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Users,
    title: 'Citizen Reporting',
    description: 'Report potholes, cracks, and road hazards with photos and GPS location in seconds.',
    color: 'text-blue-600',
  },
  {
    icon: Building2,
    title: 'Government Dashboard',
    description: 'Centralized system to track, prioritize, and assign maintenance tasks efficiently.',
    color: 'text-green-600',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Data-driven insights for budget planning and resource allocation decisions.',
    color: 'text-purple-600',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Models',
    description: 'ML-powered seasonal forecasting to prevent road deterioration proactively.',
    color: 'text-orange-600',
  },
  {
    icon: Map,
    title: 'Interactive Maps',
    description: 'Visualize road conditions with heat maps and filter by severity or location.',
    color: 'text-cyan-600',
  },
  {
    icon: Bell,
    title: 'Status Updates',
    description: 'Automatic notifications keep citizens informed about their report progress.',
    color: 'text-pink-600',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Built for All Stakeholders
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Comprehensive features designed for citizens, government officials, and administrators
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <feature.icon className={`mb-4 h-10 w-10 ${feature.color}`} />
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
