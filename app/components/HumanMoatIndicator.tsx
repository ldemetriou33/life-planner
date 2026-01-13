'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ShieldAlert, ShieldCheck, Info } from 'lucide-react'

interface HumanMoatIndicatorProps {
  level: 'High' | 'Medium' | 'Low'
}

export default function HumanMoatIndicator({ level }: HumanMoatIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const levels: Array<{ value: 'High' | 'Medium' | 'Low'; label: string; icon: any; color: string }> = [
    {
      value: 'High',
      label: 'High',
      icon: ShieldCheck,
      color: 'from-cyan-400 to-cyan-500 border-cyan-400/50 bg-cyan-400/20',
    },
    {
      value: 'Medium',
      label: 'Medium',
      icon: Shield,
      color: 'from-amber-400 to-amber-500 border-amber-400/50 bg-amber-400/20',
    },
    {
      value: 'Low',
      label: 'Low',
      icon: ShieldAlert,
      color: 'from-red-500 to-red-600 border-red-500/50 bg-red-500/20',
    },
  ]

  const activeIndex = levels.findIndex(l => l.value === level)
  const activeLevel = levels[activeIndex]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-4 sm:p-5 md:p-6 relative"
      style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
          Human Moat Level
        </h3>
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="w-5 h-5 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Info className="w-full h-full" />
          </button>
          
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 p-4 bg-white border border-gray-300 rounded-lg shadow-xl z-50 pointer-events-none"
              >
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">Moravec's Paradox:</strong> AI excels at logic, mathematics, and pattern recognition, but struggles with physical dexterity, emotional empathy, and chaotic real-world agency. Your human moat represents how protected your career is from AI automation based on these principles.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Animated Bar Chart for Human Moat */}
      <div className="mb-6">
        <div className="relative h-8 bg-gray-100 rounded-full border border-gray-300 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((activeIndex + 1) / 3) * 100}%` }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
            className={`absolute left-0 top-0 h-full rounded-full ${
              level === 'High'
                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500'
                : level === 'Medium'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}
            style={{
              boxShadow: level === 'High'
                ? '0 0 20px rgba(34, 211, 238, 0.6)'
                : level === 'Medium'
                ? '0 0 20px rgba(251, 191, 36, 0.6)'
                : '0 0 20px rgba(239, 68, 68, 0.6)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-600">
            {level} Moat Level
          </div>
        </div>
      </div>

      {/* Vertical stack of blocks */}
      <div className="space-y-3">
        {levels.map((item, index) => {
          const isActive = item.value === level
          const Icon = item.icon
          
          return (
            <motion.div
              key={item.value}
              initial={{ opacity: 0, x: -20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: '100%' }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ x: 4 }}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-300
                ${isActive 
                  ? `${item.color} border-opacity-100 shadow-lg` 
                  : 'bg-gray-50 border-gray-200 opacity-50'
                }
              `}
              style={{
                boxShadow: isActive
                  ? `0 0 20px ${item.value === 'High' ? 'rgba(34, 211, 238, 0.4)' : item.value === 'Medium' ? 'rgba(251, 191, 36, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
                  : undefined,
              }}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-6 h-6 ${
                    isActive
                      ? item.value === 'High'
                        ? 'text-cyan-400'
                        : item.value === 'Medium'
                        ? 'text-amber-400'
                        : 'text-red-500'
                      : 'text-gray-500'
                  }`}
                />
                <div className="flex-1">
                  <div className={`font-semibold ${
                    isActive
                      ? item.value === 'High'
                        ? 'text-cyan-400'
                        : item.value === 'Medium'
                        ? 'text-amber-400'
                        : 'text-red-500'
                      : 'text-gray-600'
                  }`}>
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {item.value === 'High'
                      ? 'Physical/Emotional barriers protect your role'
                      : item.value === 'Medium'
                      ? 'Mixed: Some tasks protected, others vulnerable'
                      : 'Pure cognitive tasks highly vulnerable to AI'}
                  </div>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-current"
                    style={{
                      color:
                        item.value === 'High'
                          ? '#22d3ee'
                          : item.value === 'Medium'
                          ? '#fbbf24'
                          : '#ef4444',
                    }}
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

