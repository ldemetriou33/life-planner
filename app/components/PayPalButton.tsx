'use client'

import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { useState, memo, useEffect } from 'react'

interface PayPalButtonProps {
  amount: number
  currency: 'USD' | 'GBP'
  onSuccess: () => void
  onError?: (error: string) => void
}

// Inner component to access PayPal script state
// This component must be used within a PayPalScriptProvider
// Memoized to prevent unnecessary re-renders that could cause buttons to disappear
export const PayPalButtonContent = memo(function PayPalButtonContent({ amount, currency, onSuccess, onError }: PayPalButtonProps) {
  const [{ isResolved, isPending, isRejected }] = usePayPalScriptReducer()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device for optimized button rendering
  // Only run on client side with proper guards
  useEffect(() => {
    // Guard: Only run if window is available (client-side)
    if (typeof window === 'undefined') return

    const checkMobile = () => {
      try {
        // Safely access navigator and window
        const nav = typeof navigator !== 'undefined' ? navigator : null
        const win = typeof window !== 'undefined' ? window : null
        
        if (!nav || !win) {
          setIsMobile(false)
          return
        }

        const userAgent = nav.userAgent || nav.vendor || (win as any).opera || ''
        const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
        const isSmallScreen = win.innerWidth < 768
        setIsMobile(isMobileDevice || isSmallScreen)
      } catch (error) {
        // Fallback: assume desktop if detection fails
        console.warn('Mobile detection failed, defaulting to desktop:', error)
        setIsMobile(false)
      }
    }
    
    checkMobile()
    
    // Only add event listener if window is available
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile)
      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('resize', checkMobile)
        }
      }
    }
  }, [])

  if (isRejected) {
    return (
      <div className="text-red-500 text-sm text-center p-4 min-h-[50px] flex items-center justify-center">
        Failed to load PayPal. Please refresh the page.
      </div>
    )
  }

  // Show loading state while pending, but keep container height stable
  if (isPending || !isResolved) {
    return (
      <div className="text-center p-4 min-h-[50px] flex flex-col items-center justify-center">
        <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-2"></div>
        <p className="text-sm text-gray-600">Loading payment options...</p>
      </div>
    )
  }

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toString(),
            currency_code: currency,
          },
          description: 'Unlock Premium Career Assessment Report',
        },
      ],
    })
  }

  const onApprove = async (data: any, actions: any) => {
    setIsProcessing(true)
    try {
      const order = await actions.order.capture()
      
      // Payment successful
      if (order.status === 'COMPLETED') {
        // Store payment in localStorage
        localStorage.setItem('premium_unlocked', 'true')
        localStorage.setItem('payment_id', order.id)
        localStorage.setItem('payment_timestamp', Date.now().toString())
        
        onSuccess()
      } else {
        throw new Error('Payment not completed')
      }
    } catch (error) {
      console.error('PayPal payment error:', error)
      onError?.('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const onErrorHandler = (err: any) => {
    console.error('PayPal error:', err)
    onError?.('An error occurred with PayPal. Please try again.')
    setIsProcessing(false)
  }

  const onCancel = () => {
    setIsProcessing(false)
  }

  // Log payment method availability for debugging (only in development)
  // Only run on client side with proper guards
  useEffect(() => {
    // Guard: Only run if window is available and in development
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return
    if (!isResolved) return

    try {
      const nav = typeof navigator !== 'undefined' ? navigator : null
      const win = typeof window !== 'undefined' ? window : null
      
      if (!nav || !win) return

      console.log('💳 PayPal SDK loaded successfully')
      console.log('📱 Mobile device detected:', isMobile)
      console.log('🌐 User agent:', nav.userAgent || 'unknown')
      console.log('🔒 HTTPS:', win.location?.protocol === 'https:')
      console.log('💵 Currency:', currency)
      console.log('💰 Amount:', amount)
      
      // Check if Apple Pay is potentially available
      if (isMobile && nav.userAgent && /iphone|ipad|ipod/i.test(nav.userAgent)) {
        console.log('🍎 Apple device detected - Apple Pay should be available if merchant is approved')
      }
    } catch (error) {
      // Silently fail logging - don't break the app
      console.warn('Payment method logging failed:', error)
    }
  }, [isResolved, isMobile, currency, amount])

  // Mobile-optimized button height (minimum 50px for Apple Pay)
  // Use safe default with fallback
  const buttonHeight = isMobile ? 55 : 50

  // Safe button height with fallback
  const safeButtonHeight = typeof buttonHeight === 'number' && buttonHeight > 0 ? buttonHeight : 50

  return (
    <div className="w-full min-h-[50px]" style={{ 
      minHeight: `${safeButtonHeight}px`,
      // Ensure no CSS transforms interfere with iframe rendering
      transform: 'none',
      willChange: 'auto'
    }}>
      {isProcessing && (
        <div className="mb-2 text-center text-sm text-gray-600">
          Processing payment...
        </div>
      )}
      
      {/* Single PayPal Buttons component - PayPal automatically shows Apple Pay when available */}
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onErrorHandler}
        onCancel={onCancel}
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay',
          height: safeButtonHeight,
          tagline: false,
        }}
        forceReRender={[amount, currency]}
      />
    </div>
  )
})

export default function PayPalButton({ amount, currency, onSuccess, onError }: PayPalButtonProps) {
  // Get client ID from environment variable or use fallback
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'ARN5klFaEsIMllSuqWN-fxKKuB1i-mk9TvKWW0hB6WVFAK05soxvKRNyJnFrhkGUox1Ib0-RLtkFvNvm'

  if (!clientId) {
    return (
      <div className="text-red-500 text-sm text-center p-4">
        PayPal client ID not configured. Please restart the development server or add the environment variable.
      </div>
    )
  }

  return (
    <PayPalScriptProvider 
      options={{ 
        clientId, 
        currency,
        intent: 'capture',
        enableFunding: 'paypal,card,applepay,venmo',
        components: 'buttons',
      }}
    >
      <PayPalButtonContent 
        amount={amount} 
        currency={currency} 
        onSuccess={onSuccess} 
        onError={onError} 
      />
    </PayPalScriptProvider>
  )
}

