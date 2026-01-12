'use client'

import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react'

interface Job {
  title: string
  obsolescence_year: string
  risk_level: 'High' | 'Med' | 'Low'
}

interface JobsListProps {
  jobs: Job[]
}

export default function JobsList({ jobs }: JobsListProps) {
  const getRiskColor = (risk: 'High' | 'Med' | 'Low') => {
    switch (risk) {
      case 'High':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'Med':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Low':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
    }
  }

  const getRiskIcon = (risk: 'High' | 'Med' | 'Low') => {
    switch (risk) {
      case 'High':
        return <AlertTriangle className="w-4 h-4" />
      case 'Med':
        return <TrendingDown className="w-4 h-4" />
      case 'Low':
        return <TrendingUp className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
        Job Market Outlook
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="glass-panel p-5 hover:border-electric-blue/30 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-lg font-semibold text-white group-hover:text-electric-blue transition-colors">
                {job.title}
              </h4>
              <motion.div
                whileHover={{ rotate: 5 }}
                className={`flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium ${getRiskColor(job.risk_level)}`}
              >
                {getRiskIcon(job.risk_level)}
                <span>{job.risk_level}</span>
              </motion.div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Obsolescence forecast:</span>
              <span className="font-semibold text-white">{job.obsolescence_year}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

