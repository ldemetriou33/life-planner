'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface CookedAnimationProps {
  isOpen: boolean
  onClose: () => void
}

export default function CookedAnimation({ isOpen, onClose }: CookedAnimationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          
          {/* Animation Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
              className="relative pointer-events-auto"
            >
              {/* Main COOKED Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <motion.h1
                  className="text-8xl md:text-9xl font-black tracking-tighter"
                  style={{
                    background: 'linear-gradient(45deg, #ef4444, #f97316, #ef4444)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.8)) drop-shadow(0 0 60px rgba(239, 68, 68, 0.4))',
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  COOKED
                </motion.h1>
                
                {/* Rotating Glow Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-red-500/50"
                  style={{
                    boxShadow: '0 0 40px rgba(239, 68, 68, 0.6), 0 0 80px rgba(239, 68, 68, 0.4), inset 0 0 40px rgba(239, 68, 68, 0.2)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.div>
              
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-6 text-xl text-gray-400"
              >
                University not found in database
              </motion.p>
              
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.8 }}
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

