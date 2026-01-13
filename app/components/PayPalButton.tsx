'use client'

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useState } from 'react'

interface PayPalButtonProps {
  amount: number
  currency: 'USD' | 'GBP'
  onSuccess: () => void
  onError?: (error: string) => void
}

export default function PayPalButton({ amount, currency, onSuccess, onError }: PayPalButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  // Get client ID from environment variable or use fallback
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'ARN5klFaEsIMllSuqWN-fxKKuB1i-mk9TvKWW0hB6WVFAK05soxvKRNyJnFrhkGUox1Ib0-RLtkFvNvm'

  if (!clientId) {
    return (
      <div className="text-red-500 text-sm text-center p-4">
        PayPal client ID not configured. Please restart the development server or add the environment variable.
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

  return (
    <PayPalScriptProvider options={{ clientId, currency }}>
      <div className="w-full">
        {isProcessing && (
          <div className="mb-2 text-center text-sm text-gray-600">
            Processing payment...
          </div>
        )}
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onErrorHandler}
          onCancel={onCancel}
          style={{
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
          }}
        />
      </div>
    </PayPalScriptProvider>
  )
}

