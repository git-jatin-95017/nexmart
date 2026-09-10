import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export interface CartItem {
  id: string
  name: string
  price: number
  image?: string | null
  quantity: number
}

const CART_COOKIE_NAME = 'cart'

async function getCookieCart(): Promise<CartItem[]> {
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

export async function getCart(): Promise<CartItem[]> {
  const session = await auth()
  
  if (session?.user) {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    })
    
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: cartItems.map((item) => item.productId),
        },
      },
    })
    
    return cartItems.map((item) => {
      const product = products.find((p) => p.id === item.productId)!
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
      }
    })
  }
  
  return getCookieCart()
}

export async function addToCart(item: Omit<CartItem, 'quantity'>, quantity: number = 1) {
  const session = await auth()
  
  if (session?.user) {
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: item.id,
        },
      },
    })
    
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
    } else {
      await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId: item.id,
          quantity,
        },
      })
    }
    
    return getCart()
  }
  
  const cookieStore = await cookies()
  const cart = await getCookieCart()
  
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
  const session = await auth()
  
  if (session?.user) {
    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({
        where: {
          userId: session.user.id,
          productId: itemId,
        },
      })
    } else {
      await prisma.cartItem.updateMany({
        where: {
          userId: session.user.id,
          productId: itemId,
        },
        data: { quantity },
      })
    }
    
    return getCart()
  }
  
  const cookieStore = await cookies()
  const cart = await getCookieCart()
  
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
  const session = await auth()
  
  if (session?.user) {
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    })
    return
  }
  
  const cookieStore = await cookies()
  cookieStore.delete(CART_COOKIE_NAME)
}

export function calculateCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

export async function migrateGuestCartToUser(userId: string) {
  const guestCart = await getCookieCart()
  
  if (guestCart.length === 0) return
  
  for (const item of guestCart) {
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: item.id,
        },
      },
    })
    
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + item.quantity },
      })
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productId: item.id,
          quantity: item.quantity,
        },
      })
    }
  }
  
  const cookieStore = await cookies()
  cookieStore.delete(CART_COOKIE_NAME)
}
