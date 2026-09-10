'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { getRazorpayInstance, verifyPaymentSignature, convertToRazorpayAmount } from '@/lib/razorpay'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createOrderAction() {
  const session = await auth()

  if (!session?.user) {
    return { error: 'You must be logged in to checkout' }
  }

  const razorpay = getRazorpayInstance()

  if (!razorpay) {
    return { error: 'Payment system not configured. Please contact support.' }
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      user: true,
    },
  })

  if (cartItems.length === 0) {
    return { error: 'Your cart is empty' }
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: cartItems.map((item) => item.productId),
      },
    },
  })

  const totalAmount = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)
    return sum + (product?.price || 0) * item.quantity
  }, 0)

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: convertToRazorpayAmount(totalAmount),
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    })

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        customerName: session.user.name || '',
        customerEmail: session.user.email || '',
        totalAmount,
        razorpayOrderId: razorpayOrder.id,
        items: {
          create: cartItems.map((item) => {
            const product = products.find((p) => p.id === item.productId)!
            return {
              productId: item.productId,
              productName: product.name,
              price: product.price,
              quantity: item.quantity,
            }
          }),
        },
      },
    })

    return {
      success: true,
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return { error: 'Failed to create order. Please try again.' }
  }
}

export async function verifyPaymentAction(
  orderId: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  const session = await auth()

  if (!session?.user) {
    return { error: 'Unauthorized' }
  }

  const isValid = verifyPaymentSignature(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  )

  if (!isValid) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'FAILED' },
    })
    return { error: 'Payment verification failed' }
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'PAID',
      razorpayPaymentId,
      razorpaySignature,
    },
  })

  await prisma.cartItem.deleteMany({
    where: { userId: session.user.id },
  })

  revalidatePath('/cart')
  redirect(`/orders/${orderId}`)
}

export async function cancelOrderAction(orderId: string) {
  const session = await auth()

  if (!session?.user) {
    return { error: 'Unauthorized' }
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  })

  if (!order || order.userId !== session.user.id) {
    return { error: 'Order not found' }
  }

  if (order.status !== 'PENDING') {
    return { error: 'Order cannot be cancelled' }
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELLED' },
  })

  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}
