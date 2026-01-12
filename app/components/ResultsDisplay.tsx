'use client'

import { motion } from 'framer-motion'
import ScoreCard from './ScoreCard'
import VerdictBanner from './VerdictBanner'
import JobsList from './JobsList'
import ActionPlan from './ActionPlan'
import ResourceLinks from './ResourceLinks'

interface Job {
  title: string
  obsolescence_year: string
  risk_level: 'High' | 'Med' | 'Low'
}

interface AssessmentResult {
  score: number
  verdict: string
  jobs: Job[]
  uni_analysis: string
  action_plan: string[]
  resources: Array<{ name: string; url: string }>
}

interface ResultsDisplayProps {
  result: AssessmentResult
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto space-y-8 mt-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ScoreCard score={result.score} />
        </div>
        <div className="lg:col-span-2">
          <VerdictBanner verdict={result.verdict} />
        </div>
      </div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        className="glass-panel p-6"
      >
        <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
          University Analysis
        </h3>
        <p className="text-gray-300 leading-relaxed">{result.uni_analysis}</p>
      </motion.div>

      <JobsList jobs={result.jobs} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ActionPlan steps={result.action_plan} />
        <ResourceLinks resources={result.resources} />
      </div>
    </motion.div>
  )
}

