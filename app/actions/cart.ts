'use server'

import { addToCart, updateCartItemQuantity, removeFromCart } from '@/lib/cart'
import { revalidatePath } from 'next/cache'

export async function addToCartAction(
  productId: string,
  name: string,
  price: number,
  image?: string | null,
  quantity: number = 1
) {
  await addToCart({ id: productId, name, price, image }, quantity)
  revalidatePath('/cart')
  return { success: true }
}

export async function updateCartItemAction(itemId: string, quantity: number) {
  await updateCartItemQuantity(itemId, quantity)
  revalidatePath('/cart')
  return { success: true }
}

export async function removeFromCartAction(itemId: string) {
  await removeFromCart(itemId)
  revalidatePath('/cart')
  return { success: true }
}
