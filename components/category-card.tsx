import Link from 'next/link'
import Image from 'next/image'

interface CategoryCardProps {
  name: string
  slug: string
  description?: string | null
  image?: string | null
}

export function CategoryCard({ name, slug, description, image }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
        )}
      </div>
    </Link>
  )
}
