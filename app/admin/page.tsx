'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Download, RefreshCw } from 'lucide-react'

interface EmailEntry {
  email: string
  university: string
  major: string
  timestamp: string
}

export default function AdminPage() {
  const [emails, setEmails] = useState<EmailEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    fetchEmails()
  }, [])

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

