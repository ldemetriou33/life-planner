'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

interface ActionPlanProps {
  steps: string[]
}

export default function ActionPlan({ steps }: ActionPlanProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-6"
    >
      <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
        Action Plan
      </h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="flex items-start gap-4 group"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.15 + 0.2, type: 'spring', stiffness: 200 }}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple flex items-center justify-center text-white font-bold text-sm mt-0.5"
            >
              {index + 1}
            </motion.div>
            <motion.p
              className="text-gray-300 leading-relaxed flex-1 group-hover:text-white transition-colors"
            >
              {step}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

