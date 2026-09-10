'use client'

import { useState } from 'react'
import { createOrderAction, verifyPaymentAction } from '@/app/actions/orders'
import Script from 'next/script'

declare global {
  interface Window {
    Razorpay: any
  }
}

export function CheckoutButton() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      const result = await createOrderAction()

      if ('error' in result) {
        alert(result.error)
        setIsProcessing(false)
        return
      }

      if (!razorpayLoaded) {
        alert('Payment system is still loading. Please try again.')
        setIsProcessing(false)
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: result.amount * 100,
        currency: 'INR',
        name: 'NexMart',
        description: 'Order Payment',
        order_id: result.razorpayOrderId,
        handler: async function (response: any) {
          try {
            await verifyPaymentAction(
              result.orderId,
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            )
          } catch (error) {
            alert('Payment verification failed. Please contact support.')
            setIsProcessing(false)
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false)
          },
        },
        theme: {
          color: '#4F46E5',
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      alert('Failed to initiate payment. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />
      <button
        onClick={handlePayment}
        disabled={isProcessing || !razorpayLoaded}
        className="mt-6 w-full rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 disabled:bg-indigo-400"
      >
        {isProcessing
          ? 'Processing...'
          : !razorpayLoaded
          ? 'Loading...'
          : 'Proceed to Payment'}
      </button>
    </>
  )
}
