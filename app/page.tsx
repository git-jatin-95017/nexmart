import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/product-card'
import { CategoryCard } from '@/components/category-card'

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      include: { seller: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <main className="flex-1">
      <section className="bg-gradient-to-b from-indigo-600 to-purple-600 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Welcome to NexMart
            </h1>
            <p className="mt-4 text-xl text-indigo-100">
              Your modern marketplace connecting quality sellers and smart shoppers
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                slug={category.slug}
                description={category.description}
                image={category.image}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
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
        </div>
      </section>
    </main>
  )
}
