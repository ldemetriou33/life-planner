'use client'

import { motion } from 'framer-motion'

interface VerdictBannerProps {
  verdict: string
}

export default function VerdictBanner({ verdict }: VerdictBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="glass-panel-strong p-6 relative overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/10 via-neon-purple/10 to-electric-blue/10 animate-pulse" />
      
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
          Verdict
        </h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-2xl font-semibold leading-relaxed bg-gradient-to-r from-electric-blue via-neon-purple to-electric-blue bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
        >
          {verdict}
        </motion.p>
      </div>
    </motion.div>
  )
}

