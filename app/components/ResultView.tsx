'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import SurvivalGauge from './SurvivalGauge'
import SaturationTimeline from './SaturationTimeline'
import HumanMoatIndicator from './HumanMoatIndicator'
import { findUniversity } from '../data/universities'
import { Lock, Unlock } from 'lucide-react'
import { PayPalButtonContent } from './PayPalButton'
import ShareScoreButton from './ShareScoreButton'

// Sticky Payment Box Component for Mobile
function StickyPaymentBox({ 
  triggerRef,
  isImmediateThreat, 
  isMidTermThreat, 
  isUK, 
  paymentError, 
  onSuccess, 
  onError,
  onPasswordSubmit,
  password,
  setPassword,
  passwordError
}: {
  triggerRef: React.RefObject<HTMLDivElement>
  isImmediateThreat: boolean
  isMidTermThreat: boolean
  isUK: boolean
  paymentError: string | null
  onSuccess: () => void
  onError: (error: string) => void
  onPasswordSubmit: (e: React.FormEvent) => void
  password: string
  setPassword: (value: string) => void
  passwordError: string | null
}) {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!triggerRef.current) return
      
      const triggerRect = triggerRef.current.getBoundingClientRect()
      // Make sticky when payment trigger is scrolled past
      setIsSticky(triggerRect.bottom < 0)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [triggerRef])

  if (!isSticky) return null

  return (
    <div className="hidden lg:block fixed bottom-0 left-0 right-0 z-50 px-4 py-3 bg-white border-t border-gray-200 shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-lg p-3 border-2 shadow-xl max-w-md mx-auto"
        style={{
          borderColor: isImmediateThreat ? 'rgba(239, 68, 68, 0.8)' : isMidTermThreat ? 'rgba(251, 146, 60, 0.8)' : 'rgba(251, 146, 60, 0.8)',
          boxShadow: isImmediateThreat 
            ? '0 0 20px rgba(239, 68, 68, 0.4), 0 10px 30px rgba(0, 0, 0, 0.2)' 
            : '0 0 20px rgba(251, 146, 60, 0.4), 0 10px 30px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Password field for free access */}
        <form onSubmit={onPasswordSubmit} className="mb-2">
          <div className="flex gap-1.5 items-center">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              placeholder="Password"
              className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Unlock
            </button>
          </div>
          {passwordError && (
            <p className="text-xs text-red-600 mt-1 text-center">{passwordError}</p>
          )}
        </form>

          <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-900">
              Unlock Full Report
            </h3>
            <p className="text-xs text-gray-600">
              {isUK ? '£4' : '$4'}
            </p>
          </div>
          <div className="w-full min-w-[150px] max-w-[200px] min-h-[50px]">
            <PayPalButtonContent
              key="sticky-payment-button"
              amount={4}
              currency={isUK ? 'GBP' : 'USD'}
              onSuccess={onSuccess}
              onError={onError}
            />
          </div>
        </div>
        {paymentError && (
          <p className="text-xs text-red-600 text-center mt-2">{paymentError}</p>
        )}
      </motion.div>
    </div>
  )
}

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

interface ResultViewProps {
  result: SingularityResult
  university: string
  major: string
}

// Password for free access
const FREE_ACCESS_PASSWORD = process.env.NEXT_PUBLIC_FREE_ACCESS_PASSWORD || 'demo2024'

export default function ResultView({ result, university, major }: ResultViewProps) {
  const [isPremium, setIsPremium] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isUK, setIsUK] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const foundUniversity = findUniversity(university)
  const triggerRef = useRef<HTMLDivElement>(null)

  // Check localStorage for existing payment on mount
  useEffect(() => {
    const premiumUnlocked = localStorage.getItem('premium_unlocked')
    if (premiumUnlocked === 'true') {
      setIsPremium(true)
    }
  }, [])

  // Detect if user is in UK
  useEffect(() => {
    // Check browser locale
    const locale = navigator.language || (navigator as any).userLanguage
    const isUKLocale = locale.toLowerCase().includes('gb') || locale.toLowerCase().includes('uk')
    
    // Also check timezone as fallback
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const isUKTimezone = timezone.includes('London') || timezone.includes('Europe/London')
    
    setIsUK(isUKLocale || isUKTimezone)
  }, [])
  
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
        text: 'text-orange-600',
        border: 'border-orange-500/40',
        bg: 'bg-orange-50',
        shadowColor: 'rgba(234, 88, 12, 0.4)',
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

  // PayPal payment success handler
  const handlePaymentSuccess = () => {
    setIsPremium(true)
    setIsProcessingPayment(false)
    setPaymentError(null)
    // Scroll to premium content
    setTimeout(() => {
      document.getElementById('premium-content')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // PayPal payment error handler
  const handlePaymentError = (error: string) => {
    setPaymentError(error)
    setIsProcessingPayment(false)
  }

  // Handle password submission for free access
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    
    if (password === FREE_ACCESS_PASSWORD) {
      setIsPremium(true)
      localStorage.setItem('premium_unlocked', 'true')
      setPassword('')
    } else {
      setPasswordError('Incorrect password')
    }
  }

  // Determine threat level for locked section styling
  const isImmediateThreat = result.saturation_year < 2030
  const isMidTermThreat = result.saturation_year >= 2030 && result.saturation_year <= 2038

  // Get client ID from environment variable or use fallback
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'ARN5klFaEsIMllSuqWN-fxKKuB1i-mk9TvKWW0hB6WVFAK05soxvKRNyJnFrhkGUox1Ib0-RLtkFvNvm'

  // Memoize PayPal provider options to prevent re-initialization
  const paypalOptions = useMemo(() => ({
    clientId,
    currency: isUK ? 'GBP' : 'USD',
    intent: 'capture' as const,
    enableFunding: 'paypal,card,applepay,venmo' as const,
    components: 'buttons' as const,
  }), [isUK, clientId])

  return (
    <PayPalScriptProvider options={paypalOptions}>
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 mt-4 sm:mt-6 md:mt-8 lg:mt-12 backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 lg:p-8"
      style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }}
    >
      {/* University and Major Display */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0 },
        }}
        className="text-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
          {university}
        </h2>
        <p className="text-base sm:text-lg text-gray-700">
          {major}
        </p>
      </motion.div>

      {/* Header: Survival Gauge and Verdict Banner - matching old layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <div className="lg:col-span-1">
          <SurvivalGauge score={result.singularity_score} />
        </div>
        <div className="lg:col-span-2">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className={`backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-3 sm:p-4 h-full flex flex-col justify-center border-2 ${verdictStyle.border} ${verdictStyle.bg}`}
            style={{ boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.1), 0 0 20px ${verdictStyle.shadowColor}` }}
          >
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-600 mb-1 sm:mb-2 uppercase tracking-wider">
              Verdict
            </h3>
            <motion.h2
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold ${verdictStyle.text} leading-tight tracking-wider`}
              style={{
                filter: result.singularity_score >= 50 && result.singularity_score < 80 
                  ? `drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))`
                  : `drop-shadow(0 0 4px ${verdictStyle.shadowColor})`,
                textShadow: result.singularity_score >= 50 && result.singularity_score < 80
                  ? `0 2px 4px rgba(0, 0, 0, 0.3), 0 0 8px ${verdictStyle.shadowColor}`
                  : `0 0 8px ${verdictStyle.shadowColor}, 0 2px 4px rgba(0, 0, 0, 0.2)`,
                letterSpacing: '0.05em',
              }}
            >
              {result.verdict.toUpperCase()}
            </motion.h2>
          </motion.div>
        </div>
      </div>

      {/* Share Your Score Button - Before Payment Box */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        className="w-full"
      >
        <ShareScoreButton
          score={result.singularity_score}
          verdict={result.verdict}
          university={university}
          major={major}
          zone={result.singularity_score >= 80 ? 'Safe Zone' : result.singularity_score >= 50 ? 'Caution Zone' : 'Danger Zone'}
        />
      </motion.div>

      {/* MOBILE PAYMENT BOX - Appears after share section, sticky after scroll */}
      {!isPremium && (
        <div 
          ref={triggerRef}
          id="mobile-payment-trigger"
          className="lg:hidden"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/95 backdrop-blur-xl rounded-lg p-4 border-2 shadow-xl mb-4"
            style={{
              borderColor: isImmediateThreat ? 'rgba(239, 68, 68, 0.8)' : isMidTermThreat ? 'rgba(251, 146, 60, 0.8)' : 'rgba(251, 146, 60, 0.8)',
              boxShadow: isImmediateThreat 
                ? '0 0 20px rgba(239, 68, 68, 0.4), 0 10px 30px rgba(0, 0, 0, 0.2)' 
                : '0 0 20px rgba(251, 146, 60, 0.4), 0 10px 30px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div className="text-center mb-3">
              <Lock className="w-6 h-6 mx-auto mb-2 text-gray-700" />
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Unlock Full Report
              </h3>
              <p className="text-xs text-gray-700 mb-1">
                Pivot Strategies & Upskilling Roadmap
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {isUK ? '£4' : '$4'}
              </p>
            </div>
            
            {/* Password field for free access */}
            <form onSubmit={handlePasswordSubmit} className="mb-3">
              <div className="flex gap-2 items-center">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError(null)
                  }}
                  placeholder="Enter password"
                  className="flex-1 text-xs px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Unlock
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-red-600 mt-1 text-center">{passwordError}</p>
              )}
            </form>

            <div className="text-center text-xs text-gray-500 mb-3">or</div>
            
            {paymentError && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-600 text-center">{paymentError}</p>
              </div>
            )}
            
            <div className="w-full min-h-[50px]">
              <PayPalButtonContent
                key="mobile-payment-button"
                amount={4}
                currency={isUK ? 'GBP' : 'USD'}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Sticky payment box - Hidden on mobile, only show on desktop */}
      {!isPremium && (
        <StickyPaymentBox
          triggerRef={triggerRef}
          isImmediateThreat={isImmediateThreat}
          isMidTermThreat={isMidTermThreat}
          isUK={isUK}
          paymentError={paymentError}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onPasswordSubmit={handlePasswordSubmit}
          password={password}
          setPassword={setPassword}
          passwordError={passwordError}
        />
      )}

      {/* PREMIUM CONTENT - Everything except Verdict and Score */}
      <div id="premium-content" className="relative">
        {/* All Premium Content - Blurred when locked */}
        <div className={`space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 ${!isPremium ? 'filter blur-[6px] lg:blur-[2px] pointer-events-none' : ''}`}>
          {/* Human Moat and Timeline - Show full content so users can see there's a lot locked */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 ${!isPremium ? 'lg:block' : ''}`}>
            <HumanMoatIndicator level={result.human_moat} />
            <SaturationTimeline saturationYear={result.saturation_year} showOnlyPhase1={!isPremium} />
          </div>

          {/* Premium Timeline (Full) - Only show if premium */}
          {isPremium && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SaturationTimeline saturationYear={result.saturation_year} showOnlyPhase1={false} />
            </motion.div>
          )}

          {/* Timeline Context and Pivot Strategy - Show on mobile so users see locked content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-3 sm:p-4 md:p-5 lg:p-6"
              style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }}
            >
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
                Timeline Context
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{result.timeline_context}</p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 border-2 border-electric-blue/30 bg-blue-50"
              style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }}
            >
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
                Pivot Strategy
              </h3>
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed">{result.pivot_strategy}</p>
            </motion.div>
          </div>

          {/* University Impact Analysis - Show on mobile so users see locked content */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className={`backdrop-blur-xl bg-white/90 border rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 ${
              universityImpact.impact === 'positive' 
                ? 'border-cyan-400/30 bg-cyan-50' 
                : universityImpact.impact === 'neutral'
                ? 'border-orange-400/40 bg-orange-50'
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
                    ? 'bg-cyan-400/20 text-cyan-700 border border-cyan-400/50'
                    : 'bg-orange-100 text-orange-700 border border-orange-500/50'
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
                          ? 'bg-orange-500'
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

          {/* Premium Sections: Upskilling Roadmap, Human Moat Triggers, Recommended Tools - Show on mobile so users see locked content */}
          {result.upskillingRoadmap && result.upskillingRoadmap.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {/* Upskilling Roadmap */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-4 sm:p-5 md:p-6 border-2 border-electric-blue/30"
                style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
                    Upskilling Roadmap
                  </h3>
                </div>
                <ul className="space-y-3">
                  {result.upskillingRoadmap.map((skill, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-electric-blue flex-shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">{skill}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Human Moat Triggers */}
              {result.humanMoatTriggers && result.humanMoatTriggers.length > 0 && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-4 sm:p-5 md:p-6 border-2 border-cyan-400/30"
                  style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">
                      Human Moat Triggers
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {result.humanMoatTriggers.map((trigger, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                        <span className="text-gray-700 text-sm leading-relaxed">{trigger}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Recommended Tools */}
              {result.recommendedTools && result.recommendedTools.length > 0 && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-4 sm:p-5 md:p-6 border-2 border-neon-purple/30"
                  style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-neon-purple to-purple-500 bg-clip-text text-transparent">
                      Recommended Tools
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {result.recommendedTools.map((tool, index) => (
                      <li key={index} className="border-l-2 border-neon-purple/50 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-1">{tool.name}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{tool.description}</p>
                        {tool.url && (
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-electric-blue text-xs hover:underline mt-1 inline-block"
                          >
                            Learn more →
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Locked Overlay - Only show on desktop when not premium */}
        {!isPremium && (
          <div className="hidden lg:block">
            {/* Dark Overlay - Lighter so text is visible but not readable */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 rounded-lg" />

            {/* Warning Border */}
            <div className={`absolute inset-0 border-2 rounded-lg z-50 pointer-events-none ${
              isImmediateThreat 
                ? 'border-red-500/50' 
                : isMidTermThreat 
                ? 'border-amber-500/50' 
                : 'border-orange-500/50'
            }`} />

            {/* CTA Card Overlay - Centered */}
            <div className="absolute inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white/95 backdrop-blur-xl rounded-lg p-6 md:p-8 max-w-md w-full border-2 shadow-2xl"
                style={{
                  borderColor: isImmediateThreat ? 'rgba(239, 68, 68, 0.8)' : isMidTermThreat ? 'rgba(251, 146, 60, 0.8)' : 'rgba(251, 146, 60, 0.8)',
                  boxShadow: isImmediateThreat 
                    ? '0 0 30px rgba(239, 68, 68, 0.6), 0 20px 60px rgba(0, 0, 0, 0.3)' 
                    : '0 0 30px rgba(251, 146, 60, 0.6), 0 20px 60px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div className="text-center mb-6">
                  <Lock className="w-12 h-12 mx-auto mb-4 text-gray-700" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Unlock Your Full Survival Blueprint
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed mb-2">
                    More Information on your Score, Pivot Strategies, Upskilling Roadmap, and AI-Resistant Niche Identification.
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {isUK ? '£4' : '$4'}
                  </p>
                </div>
                
                {paymentError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 text-center">{paymentError}</p>
                  </div>
                )}
                
                <div className="w-full min-h-[50px]">
                  <PayPalButtonContent
                    key="desktop-overlay-payment-button"
                    amount={4}
                    currency={isUK ? 'GBP' : 'USD'}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Research Project Note */}
      <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
        <p className="text-xs sm:text-sm text-gray-500 text-center max-w-2xl mx-auto">
          This is an independent research project. All proceeds go toward hosting costs and further development of the datasets.
        </p>
      </div>
    </motion.div>
    </PayPalScriptProvider>
  )
}

