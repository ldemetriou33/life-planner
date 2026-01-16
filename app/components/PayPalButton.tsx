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
  const [sdkVerified, setSdkVerified] = useState(false) // New state for SDK verification

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

  // Ensure SDK is ready - simplified logic, don't block on verification
  useEffect(() => {
    if (isResolved && !isPending && !isRejected) {
      // On mobile, add a small delay to ensure SDK is initialized
      if (isMobile) {
        const timer = setTimeout(() => {
          setSdkReady(true)
          console.log('✅ PayPal SDK ready on mobile')
        }, 500) // Reduced delay - 500ms should be enough
        return () => clearTimeout(timer)
      } else {
        // Desktop: set ready immediately
        setSdkReady(true)
      }
    } else {
      setSdkReady(false)
    }
  }, [isResolved, isPending, isRejected, isMobile])

  // Optional SDK verification - doesn't block rendering, just logs
  useEffect(() => {
    if (isResolved && typeof window !== 'undefined') {
      const checkPayPal = () => {
        const paypal = (window as any).paypal
        if (paypal) {
          setSdkVerified(true)
          console.log('✅ PayPal SDK verified - window.paypal exists')
        } else {
          console.warn('⚠️ window.paypal not found (but SDK is resolved)')
          // Don't block - verification is optional
          setSdkVerified(false)
        }
      }
      
      // Check immediately and after a delay
      checkPayPal()
      const timer = setTimeout(checkPayPal, 1000)
      return () => clearTimeout(timer)
    } else {
      setSdkVerified(false)
    }
  }, [isResolved])

  // Timeout fallback - if SDK is resolved but sdkReady is still false after 3 seconds, set it anyway
  useEffect(() => {
    if (isResolved && !isPending && !isRejected && !sdkReady) {
      const fallbackTimer = setTimeout(() => {
        console.warn('⚠️ SDK ready timeout - forcing ready state')
        setSdkReady(true)
      }, 3000) // 3 second fallback
      return () => clearTimeout(fallbackTimer)
    }
  }, [isResolved, isPending, isRejected, sdkReady])

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
  // Don't require sdkVerified - it's optional enhancement, not blocker
  // Only require SDK to be resolved and ready - verification is nice-to-have
  const isSdkFullyReady = isResolved && !isPending && !isRejected && sdkReady
  
  if (!isSdkFullyReady) {
    // Visual debugging: Show SDK state
    const sdkState = {
      isResolved,
      isPending,
      isRejected,
      sdkReady,
      sdkVerified,
      timestamp: new Date().toLocaleTimeString()
    }
    
    // On mobile, wait a bit longer to ensure SDK is fully ready
    if (isMobile) {
      return (
        <div className="text-center p-4 min-h-[50px] flex flex-col items-center justify-center">
          <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-2"></div>
          <p className="text-sm text-gray-600">Loading payment options...</p>
          <p className="text-xs text-gray-500 mt-1">Please wait for payment system to initialize...</p>
          {/* Visual debugging - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-100 rounded">
              SDK State: resolved={String(isResolved)}, ready={String(sdkReady)}, verified={String(sdkVerified)}
            </div>
          )}
        </div>
      )
    }
    
    return (
      <div className="text-center p-4 min-h-[50px] flex flex-col items-center justify-center">
        <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-2"></div>
        <p className="text-sm text-gray-600">Loading payment options...</p>
        {/* Visual debugging - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-100 rounded">
            SDK State: resolved={String(isResolved)}, ready={String(sdkReady)}, verified={String(sdkVerified)}
          </div>
        )}
      </div>
    )
  }

  // Simplified createOrder - ensure currency matches provider
  const createOrder = (data: any, actions: any) => {
    // Ensure currency is valid and matches provider configuration
    const validCurrency = currency === 'GBP' || currency === 'USD' ? currency : 'USD'
    
    console.log('🔵 createOrder called', {
      amount,
      currency: validCurrency,
      originalCurrency: currency,
      isMobile,
      timestamp: new Date().toISOString()
    })
    
    // Create order with validated currency
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toString(),
            currency_code: validCurrency, // Use validated currency
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

  // Simplified error handler - just log and show message
  const onErrorHandler = (err: any) => {
    const errorMsg = err?.message || String(err)
    
    // Simple logging
    console.error('❌ PayPal onErrorHandler:', {
      error: err,
      message: errorMsg,
      code: err?.code,
      isMobile,
      timestamp: new Date().toISOString()
    })
    
    // Simple error message
    const errorMessage = isMobile 
      ? `Payment error: ${errorMsg}. Please try again or use a desktop browser.`
      : `Payment error: ${errorMsg}. Please try again.`
    
    setHasError(true)
    setPaymentError(errorMessage)
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
              {isMobile && (
                <div className="text-xs text-gray-600 text-center mb-1 px-2">
                  Mobile payment tips: Ensure popups are allowed, check your internet connection, or try on a desktop browser.
                </div>
              )}
              <div 
                onClick={() => {
                  setHasError(false)
                  setPaymentError(null)
                  // Force re-render of buttons by updating state
                  setIsProcessing(false)
                }}
                className="text-xs text-center text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
              >
                Click to try again
              </div>
            </div>
          )}
      
      {/* Visual debugging: Show when buttons are rendered */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-green-600 mb-2 p-1 bg-green-50 rounded text-center">
          ✅ Buttons Ready - SDK verified at {new Date().toLocaleTimeString()}
        </div>
      )}
      
      {/* Single PayPal Buttons component - PayPal automatically shows Apple Pay when available */}
      {(() => {
        // Debug logging when buttons are rendered
        console.log('🟢 PayPal buttons rendered', {
          isResolved,
          sdkReady,
          sdkVerified,
          isMobile,
          amount,
          currency,
          timestamp: new Date().toISOString()
        })
        return null
      })()}
      
      {/* Click prevention wrapper - blocks clicks until SDK is ready */}
      <div
        style={{
          position: 'relative',
          pointerEvents: isSdkFullyReady ? 'auto' : 'none',
          opacity: isSdkFullyReady ? 1 : 0.6,
        }}
      >
        {/* Overlay to block clicks when SDK not ready */}
        {!isSdkFullyReady && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              cursor: 'not-allowed',
            }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('⚠️ Button click blocked - SDK not ready')
            }}
          />
        )}
        
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
          // Let PayPal automatically choose redirect on mobile (more reliable than popup)
          forceReRender={[amount, currency, hasError, isMobile, sdkReady, isSdkFullyReady]}
        />
      </div>
    </div>
  )
})

// Default export removed to prevent provider conflicts
// Use PayPalButtonContent within an existing PayPalScriptProvider instead
// If you need a standalone button with its own provider, create a new component

