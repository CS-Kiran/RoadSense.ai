import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { 
  Users, 
  TrendingUp, 
  Shield, 
  Zap
} from 'lucide-react'

export default function ImpactSection() {
  const impacts = [
    {
      icon: Users,
      title: 'Citizen Empowerment',
      description: 'Give citizens a voice in infrastructure management with real-time reporting capabilities and transparent status tracking.',
      stats: '10K+ active users',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: TrendingUp,
      title: 'Data-Driven Decisions',
      description: 'Enable government officials to prioritize maintenance based on severity, location patterns, and predictive analytics.',
      stats: '85% faster response',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Shield,
      title: 'Improved Safety',
      description: 'Proactive identification and resolution of road hazards reduces accidents and improves public safety.',
      stats: '40% fewer incidents',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: Zap,
      title: 'Resource Optimization',
      description: 'Predictive models help allocate budgets efficiently by forecasting seasonal deterioration patterns.',
      stats: '30% cost savings',
      color: 'bg-orange-50 text-orange-600',
    },
  ]

  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4">
            Our Impact
          </Badge>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Making a Real Difference
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Transforming road infrastructure management through technology and community engagement
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {impacts.map((impact, index) => (
            <motion.div
              key={impact.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${impact.color}`}>
                  <impact.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{impact.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{impact.description}</p>
                <div className="text-sm font-semibold text-primary">{impact.stats}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
