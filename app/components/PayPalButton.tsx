'use client'

import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { useState, memo, useEffect } from 'react'

interface PayPalButtonProps {
  amount: number
  currency: 'USD' | 'GBP'
  onSuccess: () => void
  onError?: (error: string) => void
}

/**
 * PayPalButtonContent - Use this component within a PayPalScriptProvider.
 * 
 * IMPORTANT: This component MUST be used within a PayPalScriptProvider.
 * The default export has been removed to prevent provider conflicts.
 * 
 * Memoized to prevent unnecessary re-renders that could cause buttons to disappear.
 */
export const PayPalButtonContent = memo(function PayPalButtonContent({ amount, currency, onSuccess, onError }: PayPalButtonProps) {
  const [{ isResolved, isPending, isRejected }] = usePayPalScriptReducer()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Ensure component is mounted before accessing browser APIs
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Simplified mobile detection - only run once after mount
  // Removed resize listener to reduce re-renders and potential race conditions
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return

    try {
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
      setIsMobile(false)
    }
  }, [isMounted])

  // Don't render until mounted to prevent SSR/client mismatches
  if (!isMounted) {
    return (
      <div className="text-center p-4 min-h-[50px] flex flex-col items-center justify-center">
        <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-2"></div>
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    )
  }

  if (isRejected || hasError) {
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
        // Store payment in localStorage (only on client side)
        if (typeof window !== 'undefined') {
          localStorage.setItem('premium_unlocked', 'true')
          localStorage.setItem('payment_id', order.id)
          localStorage.setItem('payment_timestamp', Date.now().toString())
        }
        
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
    setHasError(true)
    onError?.('An error occurred with PayPal. Please try again.')
    setIsProcessing(false)
  }

  const onCancel = () => {
    setIsProcessing(false)
  }

  // Removed logging useEffect to prevent potential errors and improve performance

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
      {!hasError && (
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
      )}
    </div>
  )
})

// Default export removed to prevent provider conflicts
// Use PayPalButtonContent within an existing PayPalScriptProvider instead
// If you need a standalone button with its own provider, create a new component

