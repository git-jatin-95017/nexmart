import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/product-card'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        include: { seller: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!category) {
    notFound()
  }

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/categories"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Categories
        </Link>

        <div className="mt-4">
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          {category.description && (
            <p className="mt-2 text-gray-600">{category.description}</p>
          )}
        </div>

        {category.products.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {category.products.map((product) => (
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
    </main>
  )
}
