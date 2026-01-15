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
  const [sdkReady, setSdkReady] = useState(false)

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

  // Ensure SDK is fully ready on mobile before allowing interactions
  useEffect(() => {
    if (isResolved && !isPending && !isRejected) {
      // On mobile, add a small delay to ensure SDK is completely initialized
      if (isMobile) {
        const timer = setTimeout(() => {
          setSdkReady(true)
          console.log('✅ PayPal SDK ready on mobile')
        }, 500) // 500ms delay for mobile to ensure full initialization
        return () => clearTimeout(timer)
      } else {
        setSdkReady(true)
      }
    } else {
      setSdkReady(false)
    }
  }, [isResolved, isPending, isRejected, isMobile])

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
  // On mobile, ensure SDK is fully resolved AND ready before showing buttons
  if (isPending || !isResolved || (isMobile && !sdkReady)) {
    // On mobile, wait a bit longer to ensure SDK is fully ready
    if (isMobile && (isPending || !sdkReady)) {
      return (
        <div className="text-center p-4 min-h-[50px] flex flex-col items-center justify-center">
          <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-2"></div>
          <p className="text-sm text-gray-600">Loading payment options...</p>
          <p className="text-xs text-gray-500 mt-1">Please wait...</p>
        </div>
      )
    }
    
    return (
      <div className="text-center p-4 min-h-[50px] flex flex-col items-center justify-center">
        <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-2"></div>
        <p className="text-sm text-gray-600">Loading payment options...</p>
      </div>
    )
  }

  const createOrder = (data: any, actions: any) => {
    console.log('🔵 createOrder called', {
      amount,
      currency,
      isMobile,
      sdkReady,
      isResolved,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    })
    
    try {
      // Validate actions and order object exist (critical for mobile)
      if (!actions) {
        console.error('❌ PayPal actions object is missing in createOrder')
        throw new Error('Payment system error. Please refresh and try again.')
      }

      if (!actions.order) {
        console.error('❌ PayPal actions.order is missing in createOrder')
        throw new Error('Payment system error. Please refresh and try again.')
      }

      if (!actions.order.create) {
        console.error('❌ PayPal actions.order.create is missing')
        throw new Error('Payment system error. Please refresh and try again.')
      }

      console.log('✅ All validations passed, creating order...', {
        amount,
        currency,
        isMobile
      })

      // Create order with proper error handling
      const orderPromise = actions.order.create({
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

      // Add timeout for mobile to catch hanging requests
      if (isMobile) {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Order creation timeout')), 10000)
        )
        
        return Promise.race([orderPromise, timeoutPromise]).catch((error) => {
          console.error('createOrder failed on mobile:', error)
          throw error
        })
      }

      return orderPromise
    } catch (error: any) {
      console.error('createOrder error:', {
        message: error?.message,
        error: error,
        isMobile,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
      })
      throw error
    }
  }

  const onApprove = async (data: any, actions: any) => {
    setIsProcessing(true)
    setHasError(false) // Reset error state
    setPaymentError(null) // Clear previous error message
    
    console.log('onApprove called', {
      orderID: data?.orderID,
      isMobile,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    })
    
    try {
      // Validate actions and order object exist (critical for mobile)
      if (!actions) {
        console.error('PayPal actions object is missing in onApprove')
        throw new Error('Payment system error. Please refresh and try again.')
      }

      if (!actions.order) {
        console.error('PayPal actions.order is missing in onApprove')
        throw new Error('Payment system error. Please refresh and try again.')
      }

      if (!actions.order.capture) {
        console.error('PayPal actions.order.capture is missing')
        throw new Error('Payment system error. Please refresh and try again.')
      }

      // Skip order.get() check on mobile - it can cause issues
      // The order ID is already in data.orderID, so we can proceed directly to capture
      if (!isMobile) {
        // Only do order.get() check on desktop for debugging
        try {
          if (actions.order.get) {
            const orderDetails = await actions.order.get()
            console.log('Order details retrieved:', orderDetails?.id)
          }
        } catch (getError: any) {
          console.warn('Failed to get order details (non-critical):', getError)
          // Continue anyway - capture might still work
        }
      }

      // Capture order with retry logic for mobile network issues
      let order
      let retries = 0
      const maxRetries = isMobile ? 2 : 3 // Fewer retries on mobile to fail faster
      const timeout = isMobile ? 20000 : 10000 // Longer timeout for mobile (20s)
      
      console.log('Starting order capture...', { isMobile, maxRetries, timeout })
      
      while (retries < maxRetries) {
        try {
          // For mobile, use simpler capture without timeout race (can cause issues)
          if (isMobile) {
            // Direct capture on mobile - simpler is better
            order = await actions.order.capture()
            console.log(`✅ Payment captured successfully on mobile (attempt ${retries + 1})`)
            break // Success, exit retry loop
          } else {
            // Desktop: use timeout wrapper
            const capturePromise = actions.order.capture()
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Capture timeout')), timeout)
            )
            
            order = await Promise.race([capturePromise, timeoutPromise]) as any
            console.log(`✅ Payment captured successfully on desktop (attempt ${retries + 1})`)
            break // Success, exit retry loop
          }
        } catch (captureError: any) {
          const errorMsg = captureError?.message || String(captureError)
          const errorCode = captureError?.code || ''
          
          console.error(`PayPal capture attempt ${retries + 1}/${maxRetries} failed:`, {
            message: errorMsg,
            code: errorCode,
            error: captureError,
            isMobile,
            orderID: data?.orderID
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
            const backoffDelay = isMobile ? 2000 * retries : 1000 * retries // Longer backoff on mobile
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
      
      console.log('Order captured:', {
        orderID: order.id,
        status: order.status,
        isMobile
      })
      
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
      const errorMsg = error?.message || String(error)
      const errorCode = error?.code || ''
      
      console.error('PayPal payment error in onApprove:', {
        message: errorMsg,
        code: errorCode,
        error: error,
        isMobile,
        orderID: data?.orderID,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        stack: error?.stack
      })
      
      // Provide more specific error messages for mobile
      let errorMessage = 'Payment failed. Please try again.'
      if (isMobile) {
        const lowerMsg = errorMsg.toLowerCase()
        if (lowerMsg.includes('network') || lowerMsg.includes('timeout') || lowerMsg.includes('connection') || lowerMsg.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (lowerMsg.includes('cancel')) {
          errorMessage = 'Payment was cancelled.'
          // Don't show as error for cancellations
          setIsProcessing(false)
          return
        } else if (lowerMsg.includes('timeout')) {
          errorMessage = 'Payment timed out. Please try again with a better connection.'
        } else if (lowerMsg.includes('capture') && lowerMsg.includes('fail')) {
          errorMessage = 'Payment capture failed. The payment may have been processed. Please check your PayPal account or try again.'
        } else if (lowerMsg.includes('order') && lowerMsg.includes('missing')) {
          errorMessage = 'Order not found. Please try the payment again.'
        } else {
          errorMessage = `Payment failed: ${errorMsg}. Please try again or use a different payment method.`
        }
      } else {
        // Desktop error messages
        if (errorMsg.toLowerCase().includes('network') || errorMsg.toLowerCase().includes('timeout')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = `Payment failed: ${errorMsg}. Please try again.`
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
    
    console.error('PayPal onErrorHandler called:', {
      message: errorMsg,
      code: errorCode,
      error: err,
      isMobile,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      stack: err?.stack,
      // Additional context for debugging
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
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

  // Mobile-optimized button height (minimum 50px for Apple Pay, 55px for better touch targets)
  // Use safe default with fallback
  const buttonHeight = isMobile ? 55 : 50

  // Safe button height with fallback - ensure minimum 44px touch target for mobile
  const safeButtonHeight = typeof buttonHeight === 'number' && buttonHeight > 0 
    ? Math.max(buttonHeight, isMobile ? 44 : 50) 
    : (isMobile ? 44 : 50)

  return (
    <div 
      className="w-full min-h-[50px]" 
      style={{ 
        minHeight: `${safeButtonHeight}px`,
        // Ensure no CSS transforms interfere with iframe rendering
        transform: 'none',
        // Ensure container doesn't block interactions - critical for mobile
        pointerEvents: 'auto',
        position: 'relative',
        // Minimal styling to not interfere with PayPal iframe
        overflow: 'visible',
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
      {(() => {
        // Debug logging when buttons are rendered
        if (isMobile && sdkReady) {
          console.log('🟢 PayPal buttons rendered on mobile', {
            isResolved,
            sdkReady,
            isMobile,
            amount,
            currency
          })
        }
        return null
      })()}
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onErrorHandler}
        onCancel={onCancel}
        style={{
          // Use horizontal layout on mobile for better touch targets
          layout: isMobile ? 'horizontal' : 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay',
          height: safeButtonHeight,
          tagline: false,
        }}
        forceReRender={[amount, currency, hasError, isMobile, sdkReady]}
      />
    </div>
  )
})

// Default export removed to prevent provider conflicts
// Use PayPalButtonContent within an existing PayPalScriptProvider instead
// If you need a standalone button with its own provider, create a new component

