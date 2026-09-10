'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { updateCartItemAction, removeFromCartAction } from '@/app/actions/cart'
import { useState } from 'react'
import type { CartItem } from '@/lib/cart'

interface CartItemComponentProps {
  item: CartItem
}

export function CartItemComponent({ item }: CartItemComponentProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateQuantity = async (quantity: number) => {
    setIsUpdating(true)
    try {
      await updateCartItemAction(item.id, quantity)
    } catch (error) {
      alert('Failed to update quantity')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsUpdating(true)
    try {
      await removeFromCartAction(item.id)
    } catch (error) {
      alert('Failed to remove item')
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex gap-4 rounded-lg border bg-white p-4">
      <Link href={`/products/${item.id}`} className="relative h-24 w-24 flex-shrink-0">
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
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/products/${item.id}`}
            className="text-lg font-medium text-gray-900 hover:text-indigo-600"
          >
            {item.name}
          </Link>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            ${item.price.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <select
            value={item.quantity}
            onChange={(e) => handleUpdateQuantity(Number(e.target.value))}
            disabled={isUpdating}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                Qty: {num}
              </option>
            ))}
          </select>

          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-red-600 hover:text-red-800 disabled:text-red-400"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
