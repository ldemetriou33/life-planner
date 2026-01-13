'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import ScoreShareCard from '../components/ScoreShareCard'

function SharePageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const score = parseInt(searchParams.get('score') || '0')
  const verdict = decodeURIComponent(searchParams.get('verdict') || 'Unknown')
  const university = decodeURIComponent(searchParams.get('university') || 'Unknown University')
  const major = decodeURIComponent(searchParams.get('major') || 'Unknown Major')
  const zone = (searchParams.get('zone') || 'Caution Zone') as 'Safe Zone' | 'Caution Zone' | 'Danger Zone'

  const handleTakeAssessment = () => {
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
            Someone Shared Their Score
          </h1>
          <p className="text-lg text-gray-600">
            See how they scored, then take your own assessment to see if you can beat them.
          </p>
        </motion.div>

        {/* Shared Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 flex justify-center"
        >
          <div className="scale-75 origin-center">
            <ScoreShareCard
              score={score}
              verdict={verdict}
              university={university}
              major={major}
              zone={zone}
            />
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Think you can beat this score?
            </h2>
            <p className="text-gray-700 mb-6">
              Take the Singularity Survival Assessment to see how your career path stacks up against AI automation.
            </p>
            <motion.button
              onClick={handleTakeAssessment}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 py-4 px-8 bg-gradient-to-r from-electric-blue to-neon-purple text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Take Your Assessment
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared score...</p>
        </div>
      </main>
    }>
      <SharePageContent />
    </Suspense>
  )
}

