'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface ScoreCardProps {
  score: number
}

export default function ScoreCard({ score }: ScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const spring = useSpring(0, { stiffness: 50, damping: 30 })
  const display = useTransform(spring, (value) => Math.round(value))

  useEffect(() => {
    spring.set(score)
    const unsubscribe = display.onChange((value) => {
      setDisplayScore(value)
    })
    return () => unsubscribe()
  }, [score, spring, display])

  // Color based on score
  const getScoreColor = () => {
    if (score >= 80) return 'from-green-500 to-emerald-500'
    if (score >= 60) return 'from-yellow-500 to-orange-500'
    if (score >= 40) return 'from-orange-500 to-red-500'
    return 'from-red-500 to-red-700'
  }

  const getGlowColor = () => {
    if (score >= 80) return '0 0 30px rgba(34, 197, 94, 0.4), 0 0 60px rgba(34, 197, 94, 0.2)'
    if (score >= 60) return '0 0 30px rgba(234, 179, 8, 0.4), 0 0 60px rgba(234, 179, 8, 0.2)'
    if (score >= 40) return '0 0 30px rgba(249, 115, 22, 0.4), 0 0 60px rgba(249, 115, 22, 0.2)'
    return '0 0 30px rgba(239, 68, 68, 0.4), 0 0 60px rgba(239, 68, 68, 0.2)'
  }

  // Calculate progress for circular indicator
  const circumference = 2 * Math.PI * 90 // radius = 90
  const offset = circumference - (score / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel-strong p-8 relative overflow-hidden"
    >
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
          Career Score
        </h3>
        
        <div className="relative w-48 h-48 mx-auto mb-4">
          {/* Circular progress background */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
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
                <stop offset="0%" stopColor={score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : score >= 40 ? '#f97316' : '#ef4444'} />
                <stop offset="100%" stopColor={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : score >= 40 ? '#ea580c' : '#dc2626'} />
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
                className={`text-6xl font-bold bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent`}
                style={{ boxShadow: getGlowColor() }}
              >
                {displayScore}
              </span>
            </motion.div>
          </div>
        </div>

        <div className="text-center">
          <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${getScoreColor()} bg-opacity-20 border border-opacity-30`}>
            <span className={`text-sm font-semibold bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent`}>
              {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Work'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

