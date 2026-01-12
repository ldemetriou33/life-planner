'use client'

import { motion } from 'framer-motion'
import { Skull } from 'lucide-react'

interface SaturationTimelineProps {
  saturationYear: number
}

export default function SaturationTimeline({ saturationYear }: SaturationTimelineProps) {
  const currentYear = 2026
  const endYear = 2050
  const totalYears = endYear - currentYear
  const yearsUntilSaturation = saturationYear - currentYear
  const progressPercentage = Math.min(100, Math.max(0, (yearsUntilSaturation / totalYears) * 100))
  
  // Color logic based on year ranges
  const isImmediateThreat = saturationYear < 2030
  const isMidTermThreat = saturationYear >= 2030 && saturationYear <= 2038
  const isLongTermSafe = saturationYear > 2040
  
  // Phase markers: Phase 1-6 at key years
  const phases = [
    { year: 2028, label: 'Phase 1', name: 'Laptop Purge' },
    { year: 2031, label: 'Phase 2', name: 'Middleman Massacre' },
    { year: 2034, label: 'Phase 3', name: 'Expert Eclipse' },
    { year: 2037, label: 'Phase 4', name: 'Physical Breach' },
    { year: 2040, label: 'Phase 5', name: 'Deep Moat Decay' },
    { year: 2050, label: 'Phase 6', name: 'Human Premium' },
  ]

  // Calculate marker positions
  const years = []
  for (let year = currentYear; year <= endYear; year += 4) {
    years.push(year)
  }

  // Get color based on threat level
  const getColorClass = () => {
    if (isImmediateThreat) {
      return {
        gradient: 'bg-gradient-to-r from-red-500 via-red-600 to-red-700',
        glow: '0 0 20px rgba(239, 68, 68, 0.8), inset 0 0 20px rgba(239, 68, 68, 0.4)',
        text: 'text-red-300',
        bg: 'bg-red-500/20',
        border: 'border-red-500/50',
        animate: 'animate-pulse'
      }
    } else if (isMidTermThreat) {
      return {
        gradient: 'bg-gradient-to-r from-orange-500 via-orange-600 to-red-500',
        glow: '0 0 15px rgba(251, 146, 60, 0.6)',
        text: 'text-orange-300',
        bg: 'bg-orange-500/20',
        border: 'border-orange-500/50',
        animate: ''
      }
    } else {
      return {
        gradient: 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600',
        glow: '0 0 15px rgba(34, 197, 94, 0.6)',
        text: 'text-green-300',
        bg: 'bg-green-500/20',
        border: 'border-green-500/50',
        animate: ''
      }
    }
  }

  const colorClass = getColorClass()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-xl bg-black/50 border border-white/10 rounded-lg p-6"
      style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }}
    >
      <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
        Extinction Timeline (2026-2050)
      </h3>

      <div className="relative">
        {/* Timeline bar container */}
        <div className="relative h-20 bg-white/5 rounded-full border border-white/10 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
          
          {/* Progress fill */}
          <motion.div
            className={`absolute left-0 top-0 h-full rounded-full ${colorClass.gradient} ${colorClass.animate}`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            style={{
              boxShadow: colorClass.glow,
            }}
          />

          {/* Phase markers */}
          {phases.map((phase) => {
            const phasePosition = ((phase.year - currentYear) / totalYears) * 100
            return (
              <div
                key={phase.year}
                className="absolute top-1/2 -translate-y-1/2 z-15"
                style={{ left: `${phasePosition}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-1 h-6 bg-white/30" />
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 font-medium whitespace-nowrap">
                  {phase.label}
                </div>
              </div>
            )
          })}

          {/* Death Skull at saturation year */}
          <motion.div
            className="absolute z-20"
            style={{ 
              left: `${progressPercentage}%`, 
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200 }}
          >
            <Skull 
              className={`w-8 h-8 ${colorClass.text}`} 
              style={{ 
                filter: isImmediateThreat 
                  ? 'drop-shadow(0 0 15px rgba(239, 68, 68, 1))' 
                  : isMidTermThreat
                  ? 'drop-shadow(0 0 15px rgba(251, 146, 60, 1))'
                  : 'drop-shadow(0 0 15px rgba(34, 197, 94, 1))'
              }} 
            />
          </motion.div>

          {/* Current year marker */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-electric-blue rounded-full border-2 border-white z-10" />
          <div className="absolute left-0 top-full mt-2 text-xs text-gray-400 font-medium">
            {currentYear} (Now)
          </div>

          {/* Saturation year label - positioned above the bar */}
          <motion.div
            className="absolute z-20"
            style={{ 
              left: `${progressPercentage}%`, 
              transform: 'translateX(-50%)', 
              top: '-60px'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200 }}
          >
            <div className={`text-base font-extrabold whitespace-nowrap px-3 py-1 rounded-md border-2 ${colorClass.text} ${colorClass.bg} ${colorClass.border}`} style={{
              textShadow: isImmediateThreat
                ? '0 0 20px rgba(252, 165, 165, 1), 0 0 30px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.5)'
                : isMidTermThreat
                ? '0 0 20px rgba(254, 243, 199, 1), 0 0 30px rgba(251, 146, 60, 0.8), 0 0 40px rgba(251, 146, 60, 0.5)'
                : '0 0 20px rgba(187, 247, 208, 1), 0 0 30px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.5)',
              boxShadow: isImmediateThreat
                ? '0 0 15px rgba(239, 68, 68, 0.6), inset 0 0 10px rgba(239, 68, 68, 0.2)'
                : isMidTermThreat
                ? '0 0 15px rgba(251, 146, 60, 0.6), inset 0 0 10px rgba(251, 146, 60, 0.2)'
                : '0 0 15px rgba(34, 197, 94, 0.6), inset 0 0 10px rgba(34, 197, 94, 0.2)',
            }}>
              {saturationYear}
            </div>
          </motion.div>

          {/* Year interval markers */}
          {years.map((year, index) => {
            if (year === currentYear) return null
            const yearPosition = ((year - currentYear) / totalYears) * 100
            return (
              <div
                key={year}
                className="absolute top-1/2 -translate-y-1/2 w-px h-4 bg-white/20"
                style={{ left: `${yearPosition}%` }}
              />
            )
          })}
        </div>

        {/* Year labels at bottom */}
        <div className="relative mt-12 h-8">
          {years.map((year) => {
            const yearPosition = ((year - currentYear) / totalYears) * 100
            return (
              <div
                key={year}
                className="absolute text-xs text-gray-500 font-medium"
                style={{ left: `${yearPosition}%`, transform: 'translateX(-50%)' }}
              >
                {year}
              </div>
            )
          })}
        </div>

        {/* Threat warning */}
        {isImmediateThreat && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <p className="text-sm text-red-400 font-medium text-center">
              ⚠️ Immediate Threat: AI saturation expected in {yearsUntilSaturation} years
            </p>
          </motion.div>
        )}
        {isMidTermThreat && !isImmediateThreat && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg"
          >
            <p className="text-sm text-orange-400 font-medium text-center">
              ⚠️ Mid-Term Threat: AI saturation expected in {yearsUntilSaturation} years
            </p>
          </motion.div>
        )}
        {isLongTermSafe && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
          >
            <p className="text-sm text-green-400 font-medium text-center">
              ✓ Long-Term Safe: AI saturation expected in {yearsUntilSaturation} years
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

