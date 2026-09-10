import { cookies } from 'next/headers'

export interface CartItem {
  id: string
  name: string
  price: number
  image?: string | null
  quantity: number
}

const CART_COOKIE_NAME = 'cart'

export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies()
  const cartCookie = cookieStore.get(CART_COOKIE_NAME)
  
  if (!cartCookie) {
    return []
  }

  try {
    return JSON.parse(cartCookie.value)
  } catch {
    return []
  }
}

export async function addToCart(item: Omit<CartItem, 'quantity'>, quantity: number = 1) {
  const cookieStore = await cookies()
  const cart = await getCart()
  
  const existingItemIndex = cart.findIndex((i) => i.id === item.id)
  
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity
  } else {
    cart.push({ ...item, quantity })
  }
  
  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cart), {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: false,
  })
  
  return cart
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const cookieStore = await cookies()
  const cart = await getCart()
  
  const itemIndex = cart.findIndex((i) => i.id === itemId)
  
  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1)
    } else {
      cart[itemIndex].quantity = quantity
    }
  }
  
  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cart), {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: false,
  })
  
  return cart
}

export async function removeFromCart(itemId: string) {
  return updateCartItemQuantity(itemId, 0)
}

export async function clearCart() {
  const cookieStore = await cookies()
  cookieStore.delete(CART_COOKIE_NAME)
}

export function calculateCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}
