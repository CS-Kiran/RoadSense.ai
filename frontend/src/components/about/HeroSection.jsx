import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge variant="outline" className="mb-4">
            About RoadSense.ai
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Building Better Roads,
            <span className="block text-primary">One Report at a Time</span>
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            RoadSense.ai is a civic engagement platform that bridges the gap between citizens and government authorities for proactive road infrastructure management through crowdsourced reporting and predictive analytics.
          </p>
        </motion.div>
      </div>
    </section>
  )
}