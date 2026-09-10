import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getCart, calculateCartTotal } from '@/lib/cart'
import { CheckoutButton } from '@/components/checkout-button'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export default async function CheckoutPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/checkout')
  }

  const cart = await getCart()
  const total = calculateCartTotal(cart)

  if (cart.length === 0) {
    return (
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const razorpayConfigured = !!(
    process.env.RAZORPAY_KEY_ID && 
    process.env.RAZORPAY_KEY_SECRET &&
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  )

  return (
    <main className="flex-1 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              
              <div className="mt-4 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <div className="relative h-20 w-20 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        ₹{item.price.toFixed(2)} × {item.quantity}
                      </p>
                      <p className="mt-1 font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Customer Details</h2>
              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {session.user.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {session.user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total (INR)</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {!razorpayConfigured ? (
                <div className="mt-6 rounded-lg bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Payment system not configured.</strong><br />
                    To enable payments, add your Razorpay credentials to the <code className="text-xs">.env</code> file:
                  </p>
                  <pre className="mt-2 text-xs text-yellow-900">
                    RAZORPAY_KEY_ID=your_key<br />
                    RAZORPAY_KEY_SECRET=your_secret<br />
                    NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key
                  </pre>
                  <p className="mt-2 text-xs text-yellow-700">
                    Get test keys from{' '}
                    <a 
                      href="https://dashboard.razorpay.com/app/keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Razorpay Dashboard
                    </a>
                  </p>
                </div>
              ) : (
                <CheckoutButton />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
