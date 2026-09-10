import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Mail } from 'lucide-react'
import { ProductCard } from '@/components/product-card'

interface SellerPageProps {
  params: Promise<{ id: string }>
}

export default async function SellerPage({ params }: SellerPageProps) {
  const { id } = await params
  
  const seller = await prisma.seller.findUnique({
    where: { id },
    include: {
      products: {
        include: { seller: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!seller) {
    notFound()
  }

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mt-8 rounded-lg border bg-gray-50 p-8">
          <div className="flex items-start gap-6">
            {seller.logo ? (
              <div className="relative h-24 w-24 flex-shrink-0">
                <Image
                  src={seller.logo}
                  alt={seller.name}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            ) : (
              <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-2xl font-bold text-white">
                {seller.name.charAt(0)}
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{seller.name}</h1>
              {seller.description && (
                <p className="mt-2 text-gray-600">{seller.description}</p>
              )}
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Mail className="mr-2 h-4 w-4" />
                {seller.email}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Products from {seller.name}
          </h2>

          {seller.products.length === 0 ? (
            <div className="mt-8 text-center">
              <p className="text-gray-500">This seller has no products listed yet.</p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {seller.products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  seller={product.seller}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
