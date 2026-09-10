import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image?: string | null
  seller: {
    name: string
  }
}

export function ProductCard({ id, name, price, image, seller }: ProductCardProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
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
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{name}</h3>
        <p className="mt-1 text-xs text-gray-500">by {seller.name}</p>
        <p className="mt-2 text-lg font-bold text-gray-900">${price.toFixed(2)}</p>
      </div>
    </Link>
  )
}
