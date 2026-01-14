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
  const [paymentError, setPaymentError] = useState<string | null>(null)

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

  if (isRejected) {
    return (
      <div className="text-red-500 text-sm text-center p-4 min-h-[50px] flex flex-col items-center justify-center gap-2">
        <p>Failed to load PayPal. Please refresh the page.</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Refresh Page
        </button>
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
    setHasError(false) // Reset error state
    setPaymentError(null) // Clear previous error message
    
    try {
      // Validate actions and order object exist (critical for mobile)
      if (!actions || !actions.order) {
        console.error('PayPal actions or order object is missing')
        throw new Error('Payment system error. Please refresh and try again.')
      }

      // For mobile, get order details first to verify it exists
      let orderDetails
      try {
        if (actions.order.get) {
          orderDetails = await actions.order.get()
          console.log('Order details retrieved:', orderDetails?.id)
        }
      } catch (getError: any) {
        console.warn('Failed to get order details (non-critical):', getError)
        // Continue anyway - capture might still work
      }

      // Capture order with retry logic for mobile network issues
      let order
      let retries = 0
      const maxRetries = 3 // Increased to 3 attempts
      const timeout = isMobile ? 15000 : 10000 // Longer timeout for mobile
      
      while (retries < maxRetries) {
        try {
          // Add timeout wrapper for mobile
          const capturePromise = actions.order.capture()
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Capture timeout')), timeout)
          )
          
          order = await Promise.race([capturePromise, timeoutPromise]) as any
          
          console.log(`✅ Payment captured successfully on attempt ${retries + 1}`)
          break // Success, exit retry loop
        } catch (captureError: any) {
          const errorMsg = captureError?.message || String(captureError)
          const errorCode = captureError?.code || ''
          
          console.warn(`PayPal capture attempt ${retries + 1}/${maxRetries} failed:`, {
            message: errorMsg,
            code: errorCode,
            error: captureError
          })
          
          // Check for retryable errors
          const isRetryable = 
            errorMsg.toLowerCase().includes('network') ||
            errorMsg.toLowerCase().includes('timeout') ||
            errorMsg.toLowerCase().includes('connection') ||
            errorCode === 'NETWORK_ERROR' ||
            errorCode === 'TIMEOUT'
          
          if (isRetryable && retries < maxRetries - 1) {
            retries++
            const backoffDelay = 1000 * retries // Exponential backoff: 1s, 2s, 3s
            console.log(`Retrying in ${backoffDelay}ms...`)
            await new Promise(resolve => setTimeout(resolve, backoffDelay))
            continue
          }
          
          // If not retryable or max retries reached, throw
          throw captureError
        }
      }
      
      if (!order) {
        throw new Error('Failed to capture order after all retry attempts')
      }
      
      // Payment successful
      if (order.status === 'COMPLETED') {
        console.log('✅ Payment completed successfully:', order.id)
        
        // Store payment in localStorage (only on client side)
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('premium_unlocked', 'true')
            localStorage.setItem('payment_id', order.id)
            localStorage.setItem('payment_timestamp', Date.now().toString())
          } catch (storageError) {
            console.warn('Failed to save payment to localStorage:', storageError)
            // Don't fail payment if localStorage fails
          }
        }
        
        onSuccess()
      } else {
        console.error('Payment not completed. Status:', order.status)
        throw new Error(`Payment status: ${order.status}`)
      }
    } catch (error: any) {
      console.error('PayPal payment error:', {
        message: error?.message,
        code: error?.code,
        error: error,
        isMobile,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
      })
      
      // Provide more specific error messages for mobile
      let errorMessage = 'Payment failed. Please try again.'
      if (isMobile) {
        const errorMsg = error?.message?.toLowerCase() || ''
        if (errorMsg.includes('network') || errorMsg.includes('timeout') || errorMsg.includes('connection')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (errorMsg.includes('cancel')) {
          errorMessage = 'Payment was cancelled.'
        } else if (errorMsg.includes('timeout')) {
          errorMessage = 'Payment timed out. Please try again with a better connection.'
        } else {
          errorMessage = 'Payment failed. Please try again or use a different payment method.'
        }
      }
      
      // Set error state but allow retry (buttons will still be shown)
      setPaymentError(errorMessage)
      setHasError(true) // Set error to show retry message, but buttons remain
      onError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const onErrorHandler = (err: any) => {
    const errorMsg = err?.message || String(err)
    const errorCode = err?.code || ''
    
    console.error('PayPal error handler:', {
      message: errorMsg,
      code: errorCode,
      error: err,
      isMobile,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    })
    
    // Don't immediately set hasError for recoverable errors - allow retry
    const isRecoverable = 
      errorMsg.toLowerCase().includes('network') ||
      errorMsg.toLowerCase().includes('timeout') ||
      errorMsg.toLowerCase().includes('connection') ||
      errorCode === 'NETWORK_ERROR'
    
    if (!isRecoverable) {
      setHasError(true)
    }
    
    // Provide more specific error messages
    let errorMessage = 'An error occurred with PayPal. Please try again.'
    if (isMobile) {
      if (errorMsg.toLowerCase().includes('network') || errorMsg.toLowerCase().includes('timeout') || errorMsg.toLowerCase().includes('connection')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      } else if (errorMsg.toLowerCase().includes('popup') || errorMsg.toLowerCase().includes('blocked')) {
        errorMessage = 'Popup blocked. Please allow popups and try again.'
      } else if (errorMsg.toLowerCase().includes('cancel')) {
        errorMessage = 'Payment was cancelled.'
        // Don't show as error for cancelled payments
        setIsProcessing(false)
        return
      } else {
        errorMessage = 'Payment error. Please try again or use a different payment method.'
      }
    }
    
    onError?.(errorMessage)
    setIsProcessing(false)
  }

  const onCancel = () => {
    console.log('Payment cancelled by user')
    setIsProcessing(false)
    setHasError(false) // Reset error state on cancel
    // Don't call onError for cancellations - it's user-initiated
  }

  // Removed logging useEffect to prevent potential errors and improve performance

  // Mobile-optimized button height (minimum 50px for Apple Pay)
  // Use safe default with fallback
  const buttonHeight = isMobile ? 55 : 50

  // Safe button height with fallback
  const safeButtonHeight = typeof buttonHeight === 'number' && buttonHeight > 0 ? buttonHeight : 50

  return (
    <div 
      className="w-full min-h-[50px]" 
      data-namespace="paypal-buttons"
      style={{ 
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
      
      {/* Show error message with retry option if payment failed */}
      {hasError && paymentError && (
        <div className="mb-2">
          <div className="text-red-500 text-xs text-center p-2 bg-red-50 rounded mb-1">
            {paymentError}
          </div>
          <div 
            onClick={() => {
              setHasError(false)
              setPaymentError(null)
            }}
            className="text-xs text-center text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Click to try again
          </div>
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
        forceReRender={[amount, currency, hasError]}
      />
    </div>
  )
})

// Default export removed to prevent provider conflicts
// Use PayPalButtonContent within an existing PayPalScriptProvider instead
// If you need a standalone button with its own provider, create a new component

