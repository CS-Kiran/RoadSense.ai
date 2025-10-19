import { motion } from 'framer-motion'

const stats = [
  { value: '10K+', label: 'Reports Submitted' },
  { value: '85%', label: 'Resolution Rate' },
  { value: '50+', label: 'Cities Covered' },
  { value: '24/7', label: 'Real-time Tracking' },
]

export default function Stats() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <motion.div
        className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative text-center"
            >
              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-blue-200/50 to-purple-200/30 opacity-0 blur-xl group-hover:opacity-100"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Card content */}
              <motion.div
                className="relative rounded-2xl border border-gray-300/60 bg-white/60 p-6 backdrop-blur-sm shadow-sm"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(99, 102, 241, 0.5)",
                  boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.2)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="mb-2 text-4xl font-bold text-gray-900 sm:text-5xl"
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(99, 102, 241, 0.3)",
                      "0 0 30px rgba(99, 102, 241, 0.5)",
                      "0 0 20px rgba(99, 102, 241, 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-gray-700 sm:text-base">
                  {stat.label}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}