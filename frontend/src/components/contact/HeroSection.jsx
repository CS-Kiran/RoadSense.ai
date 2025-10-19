import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge variant="outline" className="mb-4">
            Get in Touch
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
            We're Here to Help
          </h1>
          <p className="text-lg text-muted-foreground">
            Have questions about RoadSense.ai? Need support with reporting? Want to partner with us? 
            We'd love to hear from you.
          </p>
        </motion.div>
      </div>
    </section>
  )
}