'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Link2 } from 'lucide-react'

interface Resource {
  name: string
  url: string
}

interface ResourceLinksProps {
  resources: Resource[]
}

export default function ResourceLinks({ resources }: ResourceLinksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-6"
    >
      <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent flex items-center gap-2">
        <Link2 className="w-5 h-5" />
        Resources
      </h3>
      <div className="space-y-3">
        {resources.map((resource, index) => (
          <motion.a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ x: 4, scale: 1.02 }}
            className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-electric-blue/50 hover:bg-white/10 transition-all duration-300 group"
          >
            <span className="text-gray-300 group-hover:text-white transition-colors font-medium">
              {resource.name}
            </span>
            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-electric-blue transition-colors" />
          </motion.a>
        ))}
      </div>
    </motion.div>
  )
}

