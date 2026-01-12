'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface SurvivalGaugeProps {
  score: number
}

export default function SurvivalGauge({ score }: SurvivalGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    // Animate score count-up
    const duration = 2000 // 2 seconds
    const startTime = Date.now()
    const startScore = 0
    const endScore = score

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease out function
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentScore = Math.round(startScore + (endScore - startScore) * easeOut)
      
      setDisplayScore(currentScore)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [score])

  // Calculate colors based on score zones - Cyber-Minimalist colors
  const getZoneColor = () => {
    if (score >= 80) return 'from-cyan-400 to-cyan-500'
    if (score >= 50) return 'from-amber-400 to-amber-500'
    return 'from-red-500 to-red-600'
  }

  const getGlowColor = () => {
    if (score >= 80) return 'rgba(34, 211, 238, 0.6)' // Cyan
    if (score >= 50) return 'rgba(251, 191, 36, 0.6)' // Amber
    return 'rgba(239, 68, 68, 0.6)' // Red
  }

  const getTextColor = () => {
    if (score >= 80) return 'text-cyan-400'
    if (score >= 50) return 'text-amber-400'
    return 'text-red-500'
  }

  const getShadowColor = () => {
    if (score >= 80) return 'shadow-cyan-400/50'
    if (score >= 50) return 'shadow-amber-400/50'
    return 'shadow-red-500/50'
  }

  // Calculate progress for circular indicator (full circle like old design)
  const circumference = 2 * Math.PI * 90 // radius = 90
  const offset = circumference - (score / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-xl bg-black/50 border border-white/10 rounded-lg p-8 relative overflow-hidden"
      style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }}
    >
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
          Singularity Survival Score
        </h3>
        
        <div className="relative w-48 h-48 mx-auto mb-4">
          {/* Circular progress background - using full circle like old design */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Circular progress background */}
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              stroke={`url(#scoreGradient)`}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />

            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={score >= 80 ? '#22d3ee' : score >= 50 ? '#fbbf24' : '#ef4444'} />
                <stop offset="100%" stopColor={score >= 80 ? '#06b6d4' : score >= 50 ? '#f59e0b' : '#dc2626'} />
              </linearGradient>
            </defs>
          </svg>

          {/* Score number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              <span
                className={`text-6xl font-bold ${getTextColor()} ${getShadowColor()}`}
                style={{ 
                  filter: `drop-shadow(0 0 20px ${getGlowColor()})`,
                  textShadow: `0 0 30px ${getGlowColor()}`,
                }}
              >
                {displayScore}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Score label */}
        <div className="text-center mt-4">
          <div className={`inline-block px-4 py-2 rounded-full ${
            score >= 80 
              ? 'bg-cyan-400/20 border-cyan-400/50' 
              : score >= 50 
              ? 'bg-amber-400/30 border-amber-400/70' 
              : 'bg-red-500/20 border-red-500/50'
          } border-2`}>
            <span className={`text-sm font-bold ${
              score >= 80 
                ? 'text-cyan-400' 
                : score >= 50 
                ? 'text-amber-300' 
                : 'text-red-500'
            }`} style={{
              textShadow: score >= 50 && score < 80 
                ? '0 0 10px rgba(251, 191, 36, 0.8), 0 0 20px rgba(251, 191, 36, 0.4)'
                : undefined
            }}>
              {score >= 80 ? 'Safe Zone' : score >= 50 ? 'Caution Zone' : 'Danger Zone'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

