import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Clock, Ban } from 'lucide-react'

export default async function OrdersPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const statusIcons = {
    PAID: CheckCircle,
    PENDING: Clock,
    FAILED: XCircle,
    CANCELLED: Ban,
  }

  const statusColors = {
    PAID: 'text-green-600',
    PENDING: 'text-yellow-600',
    FAILED: 'text-red-600',
    CANCELLED: 'text-gray-600',
  }

  return (
    <main className="flex-1 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>

        {orders.length === 0 ? (
          <div className="mt-8 rounded-lg border bg-white p-12 text-center">
            <p className="text-gray-600">You haven't placed any orders yet.</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status]
              return (
                <div key={order.id} className="rounded-lg border bg-white p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-5 w-5 ${statusColors[order.status]}`} />
                        <span className={`font-medium ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Order ID: <span className="font-mono">{order.id}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.productName} × {item.quantity}
                          </span>
                          <span className="font-medium text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/orders/${order.id}`}
                      className="rounded-lg border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
