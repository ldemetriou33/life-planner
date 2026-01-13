'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Stats {
  averageScore: number | null
  mostVulnerable: string | null
  mostProtected: string | null
  message?: string
}

export default function GlobalScoreboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/api/stats')
        
        if (!response.ok) {
          throw new Error('Failed to fetch statistics')
        }
        
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError('Failed to load statistics')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mb-6 sm:mb-8"
      >
        <div className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-4 sm:p-6 text-center">
          <p className="text-sm text-gray-600">Loading statistics...</p>
        </div>
      </motion.div>
    )
  }

  if (error || !stats || stats.message) {
    return null // Don't show anything if there's an error or no data
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto mb-6 sm:mb-8"
    >
      <div className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3 bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent text-center">
          Global Scoreboard
        </h2>
        <p className="text-sm sm:text-base text-gray-700 text-center leading-relaxed">
          Average Survival Score this week: <span className="font-semibold text-gray-900">{stats.averageScore}</span>.
          {' '}Most Vulnerable Industry: <span className="font-semibold text-gray-900">{stats.mostVulnerable}</span>.
          {' '}Most Protected: <span className="font-semibold text-gray-900">{stats.mostProtected}</span>.
        </p>
      </div>
    </motion.div>
  )
}

