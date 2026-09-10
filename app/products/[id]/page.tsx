import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Store } from 'lucide-react'
import { AddToCartButton } from '@/components/add-to-cart-button'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      seller: true,
      category: true,
    },
  })

  if (!product) {
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

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div>
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {product.category.name}
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="mt-4 text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {product.description && (
              <div className="mt-6">
                <h2 className="text-sm font-medium text-gray-900">Description</h2>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>
            )}

            <div className="mt-6">
              <p className="text-sm text-gray-600">
                {product.stock > 0 ? (
                  <span className="text-green-600">In stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-600">Out of stock</span>
                )}
              </p>
            </div>

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>

            <div className="mt-8 border-t pt-8">
              <Link
                href={`/sellers/${product.seller.id}`}
                className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50"
              >
                <Store className="h-6 w-6 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.seller.name}
                  </p>
                  {product.seller.description && (
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {product.seller.description}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
