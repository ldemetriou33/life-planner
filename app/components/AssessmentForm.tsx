'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Loader2, GraduationCap, BookOpen, Mail } from 'lucide-react'
import AutocompleteInput from './AutocompleteInput'
import { ALL_UNIVERSITIES } from '../data/universities'
import { DEGREES } from '../data/degrees'

interface AssessmentFormProps {
  onSubmit: (email: string, university: string, major: string) => Promise<void>
  isLoading: boolean
}

export default function AssessmentForm({ onSubmit, isLoading }: AssessmentFormProps) {
  const [email, setEmail] = useState('')
  const [university, setUniversity] = useState('')
  const [major, setMajor] = useState('')
  const [errors, setErrors] = useState<{ email?: string; university?: string; major?: string }>({})

  // Get university and degree options for autocomplete
  const universityOptions = useMemo(() => {
    // Sort by prestige (Top first) then alphabetically
    return [...ALL_UNIVERSITIES]
      .sort((a, b) => {
        const prestigeOrder = { Top: 0, High: 1, Medium: 2, Standard: 3 }
        const prestigeDiff = prestigeOrder[a.prestige] - prestigeOrder[b.prestige]
        if (prestigeDiff !== 0) return prestigeDiff
        return a.name.localeCompare(b.name)
      })
      .map((uni) => uni.name)
  }, [])

  const degreeOptions = useMemo(() => {
    // Sort by market value (High first) then alphabetically
    return [...DEGREES]
      .sort((a, b) => {
        const valueOrder = { High: 0, Medium: 1, Standard: 2 }
        const valueDiff = valueOrder[a.marketValue] - valueOrder[b.marketValue]
        if (valueDiff !== 0) return valueDiff
        return a.name.localeCompare(b.name)
      })
      .map((degree) => degree.name)
  }, [])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validate = () => {
    const newErrors: { email?: string; university?: string; major?: string } = {}
    
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!university.trim()) {
      newErrors.university = 'University is required'
    }
    if (!major.trim()) {
      newErrors.major = 'Major is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    await onSubmit(email.trim(), university.trim(), major.trim())
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="glass-panel p-8 space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Mail className="w-4 h-4 text-electric-blue" />
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors({ ...errors, email: undefined })
            }}
            placeholder="your.email@example.com"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg border-2 transition-all ${
              errors.email
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 bg-gray-100 focus:border-electric-blue focus:bg-white'
            } text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue/20`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="university" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <GraduationCap className="w-4 h-4 text-electric-blue" />
            University
          </label>
          <AutocompleteInput
            id="university"
            value={university}
            onChange={(value) => {
              setUniversity(value)
              if (errors.university) setErrors({ ...errors, university: undefined })
            }}
            placeholder="e.g., Stanford University"
            options={universityOptions}
            disabled={isLoading}
            error={errors.university}
            icon={<GraduationCap className="w-4 h-4 text-electric-blue" />}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="major" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <BookOpen className="w-4 h-4 text-neon-purple" />
            Major
          </label>
          <AutocompleteInput
            id="major"
            value={major}
            onChange={(value) => {
              setMajor(value)
              if (errors.major) setErrors({ ...errors, major: undefined })
            }}
            placeholder="e.g., Computer Science"
            options={degreeOptions}
            disabled={isLoading}
            error={errors.major}
            icon={<BookOpen className="w-4 h-4 text-neon-purple" />}
          />
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="w-full py-3 px-6 bg-gradient-to-r from-electric-blue to-neon-purple text-white font-semibold rounded-lg neon-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Get Reality Check'
          )}
        </motion.button>
      </div>
    </motion.form>
  )
}

