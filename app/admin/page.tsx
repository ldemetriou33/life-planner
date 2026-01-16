'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Download, RefreshCw, Lock } from 'lucide-react'

interface EmailEntry {
  email: string
  university: string
  major: string
  timestamp: string
}

// Admin password from environment variable
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

export default function AdminPage() {
  const [emails, setEmails] = useState<EmailEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const fetchEmails = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/emails')
      const data = await response.json()
      if (data.error) {
        setError(data.error)
        setEmails([])
      } else {
        setEmails(data.emails || [])
      }
    } catch (err) {
      setError('Failed to load emails')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Check authentication on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = sessionStorage.getItem('admin_authenticated')
      if (savedAuth === 'true' && ADMIN_PASSWORD) {
        setIsAuthenticated(true)
        fetchEmails()
      } else {
        setIsLoading(false)
      }
    }
  }, [])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    
    if (!ADMIN_PASSWORD) {
      setPasswordError('Admin access is not configured')
      return
    }
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('admin_authenticated', 'true')
      }
      setPassword('')
      fetchEmails()
    } else {
      setPasswordError('Incorrect password')
    }
  }

  const downloadCSV = () => {
    const headers = ['Email', 'University', 'Major', 'Timestamp']
    const rows = emails.map(e => [
      e.email,
      e.university,
      e.major,
      e.timestamp
    ])
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `emails-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Show password prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-8"
          >
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
              <p className="text-gray-600">Enter password to access admin panel</p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError(null)
                  }}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/30 focus:border-electric-blue"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-sm text-red-500 mt-2">{passwordError}</p>
                )}
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-electric-blue to-neon-purple text-white rounded-lg font-semibold"
              >
                Access Admin Panel
              </motion.button>
            </form>
            {!ADMIN_PASSWORD && (
              <p className="text-xs text-gray-500 text-center mt-4">
                Admin password not configured. Set NEXT_PUBLIC_ADMIN_PASSWORD environment variable.
              </p>
            )}
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
                Email Collection Admin
              </h1>
              <p className="text-gray-600">
                View all collected email addresses from assessments
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                onClick={fetchEmails}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
              {emails.length > 0 && (
                <motion.button
                  onClick={downloadCSV}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </motion.button>
              )}
            </div>
          </div>
          
          <div className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-electric-blue" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{emails.length}</p>
                <p className="text-sm text-gray-600">Total emails collected</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-600">{error}</p>
            <p className="text-sm text-red-500 mt-2">
              Note: In production (Vercel), file storage doesn't persist. Consider using a database or check server logs.
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading emails...</p>
          </div>
        )}

        {/* Email List */}
        {!isLoading && emails.length === 0 && !error && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No emails collected yet.</p>
          </div>
        )}

        {!isLoading && emails.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      University
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Major
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emails.map((entry, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {entry.university}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {entry.major}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}

