import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Bot, Smartphone, Globe, Bell, Rocket, TrendingUp } from 'lucide-react'

export default function FutureImplementations() {
  const futureFeatures = [
    {
      icon: Bot,
      title: 'AI-Powered Image Recognition',
      description: 'Automatic pothole detection and severity classification using computer vision models.',
      timeline: 'Q2 2026',
      status: 'In Development',
    },
    {
      icon: Smartphone,
      title: 'Native Mobile Apps',
      description: 'Dedicated iOS and Android applications with offline reporting capabilities.',
      timeline: 'Q3 2026',
      status: 'Planned',
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Platform localization for regional languages to improve accessibility across diverse communities.',
      timeline: 'Q4 2026',
      status: 'Planned',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Intelligent alert system with customizable notification preferences and escalation rules.',
      timeline: 'Q1 2026',
      status: 'Planned',
    },
    {
      icon: Rocket,
      title: 'API Integration',
      description: 'Public API for third-party integrations with municipal management systems.',
      timeline: 'Q2 2026',
      status: 'Planned',
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics Dashboard',
      description: 'Enhanced visualization tools with custom report generation and export capabilities.',
      timeline: 'Q3 2026',
      status: 'In Progress',
    },
  ]

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4">
            Roadmap
          </Badge>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Future Implementations
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Continuous innovation to enhance functionality, accessibility, and impact
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {futureFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group relative h-full overflow-hidden p-6 transition-all hover:shadow-lg">
                <div className="absolute right-0 top-0 rounded-bl-lg bg-primary/10 px-3 py-1">
                  <span className="text-xs font-medium text-primary">{feature.timeline}</span>
                </div>
                
                <feature.icon className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{feature.description}</p>
                
                <Badge 
                  variant={feature.status === 'In Development' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {feature.status}
                </Badge>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}