'use client'

import { motion } from 'framer-motion'
import SurvivalGauge from './SurvivalGauge'
import SaturationTimeline from './SaturationTimeline'
import HumanMoatIndicator from './HumanMoatIndicator'
import { findUniversity } from '../data/universities'

interface SingularityResult {
  singularity_score: number
  human_moat: 'High' | 'Medium' | 'Low'
  saturation_year: number
  verdict: string
  pivot_strategy: string
  timeline_context: string
}

interface ResultViewProps {
  result: SingularityResult
  university: string
  major: string
}

export default function ResultView({ result, university, major }: ResultViewProps) {
  const foundUniversity = findUniversity(university)
  
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
  
  // Get university impact explanation
  const getUniversityImpact = () => {
    if (!foundUniversity) {
      return {
        title: "University Impact: Unknown",
        description: "The selected university was not found in our database. The assessment is based primarily on your degree choice. University prestige can affect networking opportunities, career trajectory, and initial job placement, which may influence your long-term survival in the Singularity Era.",
        impact: "neutral",
        scoreImpact: undefined,
        benefits: undefined
      }
    }
    
    const prestigeDescriptions = {
      'Top': {
        title: "University Impact: Elite Tier",
        description: `Attending ${foundUniversity.name} (${foundUniversity.country === 'US' ? 'US' : 'UK'}) provides significant advantages in the Singularity Era. Top-tier universities offer:`,
        benefits: [
          "Strong alumni networks that open doors to high-agency roles",
          "Prestige that signals strategic thinking to employers",
          "Access to cutting-edge research and AI collaboration opportunities",
          "Higher initial placement in roles requiring human judgment",
          "Better positioning for leadership positions that AI cannot replace"
        ],
        impact: "positive",
        scoreImpact: "+5 points to survival score"
      },
      'High': {
        title: "University Impact: Strong Tier",
        description: `${foundUniversity.name} (${foundUniversity.country === 'US' ? 'US' : 'UK'}) is a well-regarded institution that provides:`,
        benefits: [
          "Solid professional networks and career support",
          "Good reputation that enhances your marketability",
          "Access to quality education and industry connections",
          "Moderate advantage in competitive job markets"
        ],
        impact: "positive",
        scoreImpact: "+2 points to survival score"
      },
      'Medium': {
        title: "University Impact: Standard Tier",
        description: `${foundUniversity.name} (${foundUniversity.country === 'US' ? 'US' : 'UK'}) provides a standard foundation. In the Singularity Era:`,
        benefits: [
          "Your degree and skills matter more than university name",
          "Focus on building practical, AI-resistant skills",
          "Network actively to compensate for brand recognition",
          "Consider specialized certifications to stand out"
        ],
        impact: "neutral",
        scoreImpact: "No score adjustment"
      },
      'Standard': {
        title: "University Impact: Developing Tier",
        description: `While ${foundUniversity.name} (${foundUniversity.country === 'US' ? 'US' : 'UK'}) may not have the same brand recognition, your success depends on:`,
        benefits: [
          "Building exceptional, AI-resistant skills",
          "Creating a strong personal brand and portfolio",
          "Networking strategically in your target industry",
          "Pursuing specialized training and certifications",
          "Focusing on roles requiring human judgment and creativity"
        ],
        impact: "neutral",
        scoreImpact: "-2 points to survival score (compensate with skills)"
      }
    }
    
    return prestigeDescriptions[foundUniversity.prestige]
  }
  
  const universityImpact = getUniversityImpact()

  // Verdict styling based on score - Cyber-Minimalist colors
  const getVerdictStyle = () => {
    if (result.singularity_score >= 80) {
      return {
        text: 'text-cyan-400',
        border: 'border-cyan-400/30',
        bg: 'bg-cyan-400/10',
        shadowColor: 'rgba(34, 211, 238, 0.5)',
      }
    } else if (result.singularity_score >= 50) {
      return {
        text: 'text-amber-400',
        border: 'border-amber-400/30',
        bg: 'bg-amber-400/10',
        shadowColor: 'rgba(251, 191, 36, 0.5)',
      }
    } else {
      return {
        text: 'text-red-500',
        border: 'border-red-500/30',
        bg: 'bg-red-500/10',
        shadowColor: 'rgba(239, 68, 68, 0.5)',
      }
    }
  }

  const verdictStyle = getVerdictStyle()

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto space-y-8 mt-12 backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-8"
      style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }}
    >
      {/* University and Major Display */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0 },
        }}
        className="text-center mb-6 pb-6 border-b border-gray-200"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
          {university}
        </h2>
        <p className="text-lg text-gray-700">
          {major}
        </p>
      </motion.div>

      {/* Header: Survival Gauge and Verdict Banner - matching old layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <SurvivalGauge score={result.singularity_score} />
        </div>
        <div className="lg:col-span-2">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className={`backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-6 h-full flex flex-col justify-center border-2 ${verdictStyle.border} ${verdictStyle.bg}`}
            style={{ boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.1), 0 0 20px ${verdictStyle.shadowColor}` }}
          >
            <h3 className="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
              Verdict
            </h3>
            <motion.h2
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`text-2xl md:text-3xl font-bold ${verdictStyle.text} leading-relaxed`}
              style={{
                filter: `drop-shadow(0 0 10px ${verdictStyle.shadowColor})`,
                textShadow: `0 0 20px ${verdictStyle.shadowColor}`,
                animation: 'glitch 0.3s infinite',
              }}
            >
              {result.verdict.toUpperCase()}
            </motion.h2>
          </motion.div>
        </div>
      </div>

      {/* Human Moat and Timeline side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <HumanMoatIndicator level={result.human_moat} />
        <SaturationTimeline saturationYear={result.saturation_year} />
      </div>

      {/* Timeline Context and Pivot Strategy side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-6"
          style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }}
        >
          <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
            Timeline Context
          </h3>
          <p className="text-gray-700 leading-relaxed">{result.timeline_context}</p>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-6 border-2 border-electric-blue/30 bg-blue-50"
          style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }}
        >
          <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
            Pivot Strategy
          </h3>
          <p className="text-gray-800 leading-relaxed">{result.pivot_strategy}</p>
        </motion.div>
      </div>

      {/* University Impact Analysis - New Section */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        className={`backdrop-blur-xl bg-white/90 border rounded-lg p-6 ${
          universityImpact.impact === 'positive' 
            ? 'border-cyan-400/30 bg-cyan-50' 
            : universityImpact.impact === 'neutral'
            ? 'border-amber-400/30 bg-amber-50'
            : 'border-gray-200'
        }`}
        style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
            {universityImpact.title}
          </h3>
          {universityImpact.scoreImpact !== undefined && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              universityImpact.impact === 'positive'
                ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                : 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
            }`}>
              {universityImpact.scoreImpact}
            </span>
          )}
        </div>
        
        <p className="text-gray-700 leading-relaxed mb-4">
          {universityImpact.description}
        </p>
        
        {universityImpact.benefits && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
              Key Factors:
            </h4>
            <ul className="space-y-2">
              {universityImpact.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    universityImpact.impact === 'positive'
                      ? 'bg-cyan-400'
                      : universityImpact.impact === 'neutral'
                      ? 'bg-amber-400'
                      : 'bg-gray-500'
                  }`} />
                  <span className="text-sm leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong className="text-gray-700">Note:</strong> While university prestige affects initial opportunities and networking, 
            your long-term survival in the Singularity Era depends more on developing AI-resistant skills, 
            building human relationships, and focusing on roles requiring judgment, creativity, and emotional intelligence. 
            The degree you chose ({major}) is the primary factor in determining your AI vulnerability timeline.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

