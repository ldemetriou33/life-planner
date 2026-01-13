'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Share2, Linkedin, Twitter, Download, Copy, Check } from 'lucide-react'
import { toPng } from 'html-to-image'
import ScoreShareCard from './ScoreShareCard'

interface ShareScoreButtonProps {
  score: number
  verdict: string
  university: string
  major: string
  zone: 'Safe Zone' | 'Caution Zone' | 'Danger Zone'
}

export default function ShareScoreButton({ score, verdict, university, major, zone }: ShareScoreButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareCardRef = useRef<HTMLDivElement>(null)

  // Generate shareable URL
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/share?score=${score}&verdict=${encodeURIComponent(verdict)}&university=${encodeURIComponent(university)}&major=${encodeURIComponent(major)}&zone=${encodeURIComponent(zone)}`
    : ''

  // Share text for social media
  const shareText = `I scored ${score}/100 on the Singularity Survival Score. ${verdict} - Think you can beat me? Take the assessment: ${shareUrl}`

  // Generate share image
  const generateShareImage = async () => {
    if (!shareCardRef.current) return

    setIsGenerating(true)
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      })

      // Create download link
      const link = document.createElement('a')
      link.download = `singularity-survival-score-${score}.png`
      link.href = dataUrl
      link.click()

      setIsGenerating(false)
    } catch (error) {
      console.error('Error generating image:', error)
      setIsGenerating(false)
    }
  }

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying link:', error)
    }
  }

  // LinkedIn share
  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  // Twitter share
  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  return (
    <>
      {/* Hidden share card for image generation */}
      <div className="fixed -left-[9999px] -top-[9999px]">
        <ScoreShareCard
          ref={shareCardRef}
          score={score}
          verdict={verdict}
          university={university}
          major={major}
          zone={zone}
        />
      </div>

      {/* Share Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full"
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-electric-blue to-neon-purple text-white rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
        >
          <Share2 className="w-5 h-5" />
          Think your friends are safer? Challenge them.
        </motion.button>

        {/* Share Options Panel */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 sm:mt-4 backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-4 sm:p-5 md:p-6"
            style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }}
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 text-center">
              Share Your Score
            </h3>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
              {/* LinkedIn */}
              <motion.button
                onClick={shareLinkedIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-3 md:px-4 bg-[#0077b5] text-white rounded-lg font-medium text-sm sm:text-base hover:bg-[#006399] transition-colors"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">LinkedIn</span>
                <span className="sm:hidden">LI</span>
              </motion.button>

              {/* Twitter */}
              <motion.button
                onClick={shareTwitter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-3 md:px-4 bg-[#1DA1F2] text-white rounded-lg font-medium text-sm sm:text-base hover:bg-[#1a8cd8] transition-colors"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Twitter</span>
                <span className="sm:hidden">TW</span>
              </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              {/* Download Image */}
              <motion.button
                onClick={generateShareImage}
                disabled={isGenerating}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-3 md:px-4 bg-gray-700 text-white rounded-lg font-medium text-xs sm:text-sm md:text-base hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Generating...</span>
                    <span className="sm:hidden">Gen...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Download Image</span>
                    <span className="sm:hidden">Image</span>
                  </>
                )}
              </motion.button>

              {/* Copy Link */}
              <motion.button
                onClick={copyLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-3 md:px-4 bg-gray-700 text-white rounded-lg font-medium text-xs sm:text-sm md:text-base hover:bg-gray-600 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Copied!</span>
                    <span className="sm:hidden">✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Copy Link</span>
                    <span className="sm:hidden">Copy</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  )
}

