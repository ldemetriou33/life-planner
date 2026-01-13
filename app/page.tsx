'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AssessmentForm from './components/AssessmentForm'
import ResultView from './components/ResultView'
import CookedAnimation from './components/CookedAnimation'

interface SingularityResult {
  singularity_score: number
  human_moat: 'High' | 'Medium' | 'Low'
  saturation_year: number
  verdict: string
  pivot_strategy: string
  timeline_context: string
  // Premium fields
  upskillingRoadmap?: string[]
  humanMoatTriggers?: string[]
  recommendedTools?: Array<{ name: string; description: string; url?: string }>
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SingularityResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showCooked, setShowCooked] = useState(false)
  const [degreeMessage, setDegreeMessage] = useState<string | null>(null)
  const [submittedUniversity, setSubmittedUniversity] = useState<string>('')
  const [submittedMajor, setSubmittedMajor] = useState<string>('')

  const handleSubmit = async (email: string, university: string, major: string) => {
    setIsLoading(true)
    setError(null)
    setResults(null)
    setShowCooked(false)
    setDegreeMessage(null)
    setSubmittedUniversity(university)
    setSubmittedMajor(major)

    // Store email in localStorage
    localStorage.setItem('user_email', email)

    try {
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, university, major }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Handle unknown university - show cooked animation
        if (errorData.error === 'unknown_university') {
          setShowCooked(true)
          setIsLoading(false)
          return
        }
        
        // Handle unknown degree - show friendly message
        if (errorData.error === 'unknown_degree') {
          setDegreeMessage(errorData.message || 'Degree will be added soon')
          setIsLoading(false)
          return
        }
        
        // Handle other errors
        throw new Error(errorData.message || 'Failed to get assessment')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    setResults(null)
    setShowCooked(false)
    setDegreeMessage(null)
  }

  const handleCloseCooked = () => {
    setShowCooked(false)
  }

  return (
    <main className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-electric-blue via-neon-purple to-electric-blue bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Reality Check
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Singularity Era career assessment based on Moravec's Paradox - Will AI replace you?
          </p>
        </div>

        {/* Form Section */}
        {!results && !error && !degreeMessage && !isLoading && (
          <div>
            <AssessmentForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600">Analyzing singularity risk...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unknown Degree Message */}
        <AnimatePresence>
          {degreeMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="glass-panel p-6 border-yellow-500/30">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                  Degree Not Found
                </h3>
                <p className="text-gray-700 mb-4">{degreeMessage}</p>
                <motion.button
                  onClick={handleRetry}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-electric-blue to-neon-purple text-white rounded-lg font-medium"
                >
                  Try Another Degree
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="glass-panel p-6 border-red-500/30">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Error</h3>
                <p className="text-gray-700 mb-4">{error}</p>
                <motion.button
                  onClick={handleRetry}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-electric-blue to-neon-purple text-white rounded-lg font-medium"
                >
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cooked Animation */}
        <CookedAnimation isOpen={showCooked} onClose={handleCloseCooked} />

        {/* Results Section */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ResultView result={results} university={submittedUniversity} major={submittedMajor} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

