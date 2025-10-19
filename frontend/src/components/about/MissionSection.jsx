import { Card } from '@/components/ui/card'
import { Target, Heart, Lightbulb } from 'lucide-react'
import { motion } from 'framer-motion'

export default function MissionSection() {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To empower citizens and government officials with a centralized, data-driven platform that transforms how road infrastructure is reported, managed, and maintained across urban and rural areas.',
      color: 'text-blue-600',
    },
    {
      icon: Heart,
      title: 'Our Vision',
      description: 'A future where every pothole, crack, and road hazard is reported, tracked, and resolved efficiently—creating safer roads and stronger communities through technology and collaboration.',
      color: 'text-red-600',
    },
    {
      icon: Lightbulb,
      title: 'Our Values',
      description: 'Transparency, accountability, and innovation drive everything we do. We believe in the power of community-driven solutions and data-informed decision making for public infrastructure.',
      color: 'text-yellow-600',
    },
  ]

  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-6 transition-all hover:shadow-lg">
                <value.icon className={`mb-4 h-12 w-12 ${value.color}`} />
                <h3 className="mb-3 text-xl font-bold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}