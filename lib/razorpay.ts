import Razorpay from 'razorpay'
import crypto from 'crypto'

export function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    return null
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  })
}

export function verifyPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keySecret) {
    return false
  }

  const text = `${razorpayOrderId}|${razorpayPaymentId}`
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(text)
    .digest('hex')

  return expectedSignature === razorpaySignature
}

export function convertToRazorpayAmount(amount: number): number {
  // Convert rupees to paise (multiply by 100)
  return Math.round(amount * 100)
}

export function convertFromRazorpayAmount(amount: number): number {
  // Convert paise to rupees (divide by 100)
  return amount / 100
}
