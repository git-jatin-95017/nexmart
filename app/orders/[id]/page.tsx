import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Clock, Ban } from 'lucide-react'

interface OrderPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
    },
  })

  if (!order || order.userId !== session.user.id) {
    notFound()
  }

  const statusConfig = {
    PAID: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      title: 'Payment Successful!',
      message: 'Your order has been confirmed and is being processed.',
    },
    PENDING: {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      title: 'Payment Pending',
      message: 'Your order is awaiting payment confirmation.',
    },
    FAILED: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      title: 'Payment Failed',
      message: 'Unfortunately, your payment could not be processed.',
    },
    CANCELLED: {
      icon: Ban,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      title: 'Order Cancelled',
      message: 'This order has been cancelled.',
    },
  }

  const config = statusConfig[order.status]
  const StatusIcon = config.icon

  return (
    <main className="flex-1 bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className={`rounded-lg ${config.bgColor} p-8 text-center`}>
          <StatusIcon className={`mx-auto h-16 w-16 ${config.color}`} />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">{config.title}</h1>
          <p className="mt-2 text-gray-600">{config.message}</p>
        </div>

        <div className="mt-8 rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
          
          <div className="mt-4 space-y-2 border-b pb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order ID</span>
              <span className="font-mono text-gray-900">{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date</span>
              <span className="text-gray-900">
                {new Date(order.createdAt).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <span className={`font-medium ${config.color}`}>{order.status}</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-gray-900">Items Ordered</h3>
            <div className="mt-4 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-gray-600">
                      ₹{item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {order.razorpayPaymentId && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-sm font-medium text-gray-900">Payment Information</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Payment ID:</span>{' '}
                  <span className="font-mono">{order.razorpayPaymentId}</span>
                </p>
                {order.razorpayOrderId && (
                  <p>
                    <span className="font-medium">Order ID:</span>{' '}
                    <span className="font-mono">{order.razorpayOrderId}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-center font-medium text-gray-700 hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-center font-medium text-white hover:bg-indigo-700"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </main>
  )
}
