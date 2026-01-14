import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Reality Check - Career Strategy',
  description: 'Get an honest assessment of your career path based on your university and major',
  themeColor: '#ffffff',
  metadataBase: new URL('https://universitycheck.xyz'),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Reality Check - Career Strategy',
    description: 'Get an honest assessment of your career path based on your university and major',
    url: 'https://universitycheck.xyz',
    siteName: 'University Check',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reality Check - Career Strategy',
    description: 'Get an honest assessment of your career path based on your university and major',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} font-sans`}>{children}</body>
    </html>
  )
}

