'use client'

import { useState } from 'react'
import { addToCartAction } from '@/app/actions/cart'
import { ShoppingCart } from 'lucide-react'

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    image?: string | null
    stock: number
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    if (product.stock === 0) return

    setIsAdding(true)
    try {
      await addToCartAction(product.id, product.name, product.price, product.image, quantity)
      alert('Added to cart!')
    } catch (error) {
      alert('Failed to add to cart')
    } finally {
      setIsAdding(false)
    }
  }

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full rounded-lg bg-gray-300 px-6 py-3 text-white cursor-not-allowed"
      >
        Out of Stock
      </button>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-900">Quantity:</label>
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="rounded-md border border-gray-300 px-3 py-2"
        >
          {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="flex w-full items-center justify-center space-x-2 rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 disabled:bg-indigo-400"
      >
        <ShoppingCart className="h-5 w-5" />
        <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
      </button>
    </div>
  )
}
