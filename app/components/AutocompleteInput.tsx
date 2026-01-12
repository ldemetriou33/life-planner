'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AutocompleteInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: string[]
  disabled?: boolean
  error?: string
  icon?: React.ReactNode
}

export default function AutocompleteInput({
  id,
  value,
  onChange,
  placeholder,
  options,
  disabled = false,
  error,
  icon,
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter options based on input
  const filteredOptions = value
    ? options
        .filter((option) =>
          option.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 8) // Limit to 8 suggestions
    : options.slice(0, 8) // Show top 8 when empty

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: string) => {
    onChange(option)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredOptions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setIsOpen(true)
            setHighlightedIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={`w-full px-4 py-3 ${
            icon ? 'pl-10' : ''
          } bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all duration-300`}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
        />
      </div>

      <AnimatePresence>
        {isOpen && filteredOptions.length > 0 && !disabled && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 glass-panel border border-white/20 max-h-64 overflow-y-auto"
          >
            {filteredOptions.map((option, index) => (
              <motion.div
                key={option}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  highlightedIndex === index
                    ? 'bg-electric-blue/20 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {option}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-400 mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

