import { getCart, calculateCartTotal } from '@/lib/cart'
import { CartItemComponent } from '@/components/cart-item'
import Link from 'next/link'

export default async function CartPage() {
  const cart = await getCart()
  const total = calculateCartTotal(cart)

  return (
    <main className="flex-1 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-gray-600">Your cart is empty</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.map((item) => (
                  <CartItemComponent key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-lg border bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                    </span>
                    <span className="font-medium text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-6 border-t pt-6">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button className="mt-6 w-full rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700">
                  Proceed to Checkout
                </button>
                <p className="mt-4 text-center text-sm text-gray-500">
                  Checkout is not implemented in this MVP
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
