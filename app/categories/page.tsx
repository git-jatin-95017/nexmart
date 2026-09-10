import { prisma } from '@/lib/prisma'
import { CategoryCard } from '@/components/category-card'

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">All Categories</h1>
        <p className="mt-2 text-gray-600">Browse products by category</p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </main>
  )
}
