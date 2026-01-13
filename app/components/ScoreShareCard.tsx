'use client'

import { forwardRef } from 'react'

interface ScoreShareCardProps {
  score: number
  verdict: string
  university: string
  major: string
  zone: 'Safe Zone' | 'Caution Zone' | 'Danger Zone'
}

const ScoreShareCard = forwardRef<HTMLDivElement, ScoreShareCardProps>(
  ({ score, verdict, university, major, zone }, ref) => {

  // Get zone colors
  const getZoneStyle = () => {
    if (score >= 80) {
      return {
        gradient: 'from-cyan-400 to-cyan-500',
        textColor: 'text-cyan-400',
        bgColor: 'bg-cyan-400/10',
        borderColor: 'border-cyan-400/30',
      }
    } else if (score >= 50) {
      return {
        gradient: 'from-amber-400 to-amber-500',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-400/10',
        borderColor: 'border-amber-400/30',
      }
    } else {
      return {
        gradient: 'from-red-500 to-red-600',
        textColor: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
      }
    }
  }

  const zoneStyle = getZoneStyle()

  return (
    <div
      ref={ref}
      className="w-[800px] h-[600px] bg-white rounded-lg p-12 flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${zoneStyle.gradient} opacity-5`} />
      
      {/* Header */}
      <div className="text-center mb-8 z-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Singularity Survival Score
        </h1>
        <p className="text-lg text-gray-600">
          Will AI replace you?
        </p>
      </div>

      {/* Score Circle */}
      <div className="relative w-64 h-64 mb-8 z-10">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="rgba(0, 0, 0, 0.1)"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke={score >= 80 ? '#22d3ee' : score >= 50 ? '#fbbf24' : '#ef4444'}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 90}
            strokeDashoffset={2 * Math.PI * 90 * (1 - score / 100)}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-8xl font-bold ${zoneStyle.textColor}`}>
            {score}
          </span>
        </div>
      </div>

      {/* Verdict */}
      <div className={`text-center mb-6 px-8 py-4 rounded-lg border-2 ${zoneStyle.borderColor} ${zoneStyle.bgColor} z-10`}>
        <p className="text-2xl font-bold text-gray-900 mb-1">Verdict</p>
        <p className={`text-3xl font-extrabold ${zoneStyle.textColor} uppercase tracking-wider`}>
          {verdict}
        </p>
      </div>

      {/* Zone Badge */}
      <div className={`inline-block px-6 py-3 rounded-full border-2 ${zoneStyle.borderColor} ${zoneStyle.bgColor} mb-6 z-10`}>
        <span className={`text-lg font-bold ${zoneStyle.textColor}`}>
          {zone}
        </span>
      </div>

      {/* University and Major */}
      <div className="text-center z-10">
        <p className="text-xl font-semibold text-gray-700 mb-1">{university}</p>
        <p className="text-lg text-gray-600">{major}</p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-10">
        <p className="text-sm text-gray-500">
          Take your assessment at: singularity-survival.com
        </p>
      </div>
    </div>
  )
})

ScoreShareCard.displayName = 'ScoreShareCard'

export default ScoreShareCard

