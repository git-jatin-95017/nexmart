import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'

const adapter = new PrismaBetterSqlite3({ 
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db' 
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting seed...')

  // Create Demo Users
  const buyerPassword = await bcrypt.hash('buyer123', 10)
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@demo.com' },
    update: {},
    create: {
      name: 'Demo Buyer',
      email: 'buyer@demo.com',
      password: buyerPassword,
      role: 'BUYER',
    },
  })

  const sellerPassword = await bcrypt.hash('seller123', 10)
  const seller1User = await prisma.user.upsert({
    where: { email: 'seller@demo.com' },
    update: {},
    create: {
      name: 'Demo Seller',
      email: 'seller@demo.com',
      password: sellerPassword,
      role: 'SELLER',
    },
  })

  const seller2Password = await bcrypt.hash('fashion123', 10)
  const seller2User = await prisma.user.upsert({
    where: { email: 'hello@fashionhub.example' },
    update: {},
    create: {
      name: 'Fashion Hub Owner',
      email: 'hello@fashionhub.example',
      password: seller2Password,
      role: 'SELLER',
    },
  })

  console.log('✅ Demo users created')

  // Create Categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Gadgets, devices, and tech accessories',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    },
  })

  const fashion = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Clothing, shoes, and accessories',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    },
  })

  const home = await prisma.category.upsert({
    where: { slug: 'home-living' },
    update: {},
    create: {
      name: 'Home & Living',
      slug: 'home-living',
      description: 'Furniture, decor, and home essentials',
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
    },
  })

  const sports = await prisma.category.upsert({
    where: { slug: 'sports' },
    update: {},
    create: {
      name: 'Sports & Outdoors',
      slug: 'sports',
      description: 'Fitness gear and outdoor equipment',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
    },
  })

  console.log('✅ Categories created')

  // Create Sellers (linked to demo users)
  const techStore = await prisma.seller.upsert({
    where: { email: 'contact@techstore.example' },
    update: {},
    create: {
      name: 'TechStore',
      email: 'contact@techstore.example',
      description: 'Your one-stop shop for the latest gadgets and electronics',
      logo: 'https://ui-avatars.com/api/?name=TechStore&background=4F46E5&color=fff',
      userId: seller1User.id,
    },
  })

  const fashionHub = await prisma.seller.upsert({
    where: { email: 'hello@fashionhub.example' },
    update: {},
    create: {
      name: 'Fashion Hub',
      email: 'hello@fashionhub.example',
      description: 'Trendy fashion for every occasion',
      logo: 'https://ui-avatars.com/api/?name=Fashion+Hub&background=EC4899&color=fff',
      userId: seller2User.id,
    },
  })

  const homeComfort = await prisma.seller.upsert({
    where: { email: 'info@homecomfort.example' },
    update: {},
    create: {
      name: 'Home Comfort',
      email: 'info@homecomfort.example',
      description: 'Quality furniture and home decor',
      logo: 'https://ui-avatars.com/api/?name=Home+Comfort&background=10B981&color=fff',
    },
  })

  const activeLife = await prisma.seller.upsert({
    where: { email: 'support@activelife.example' },
    update: {},
    create: {
      name: 'Active Life',
      email: 'support@activelife.example',
      description: 'Premium sports and outdoor gear',
      logo: 'https://ui-avatars.com/api/?name=Active+Life&background=F59E0B&color=fff',
    },
  })

  console.log('✅ Sellers created (2 linked to demo accounts)')

  // Create Products
  const products = [
    // Electronics
    {
      name: 'Wireless Headphones Pro',
      description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      stock: 45,
      featured: true,
      sellerId: techStore.id,
      categoryId: electronics.id,
    },
    {
      name: 'Smart Watch X1',
      description: 'Fitness tracking smartwatch with heart rate monitor and GPS',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      stock: 30,
      featured: true,
      sellerId: techStore.id,
      categoryId: electronics.id,
    },
    {
      name: 'Bluetooth Speaker',
      description: 'Portable waterproof speaker with 360° sound',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
      stock: 60,
      featured: false,
      sellerId: techStore.id,
      categoryId: electronics.id,
    },
    {
      name: 'Laptop Stand Pro',
      description: 'Ergonomic aluminum laptop stand for better posture',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
      stock: 80,
      featured: false,
      sellerId: techStore.id,
      categoryId: electronics.id,
    },

    // Fashion
    {
      name: 'Classic Leather Jacket',
      description: 'Genuine leather jacket with modern fit',
      price: 189.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      stock: 25,
      featured: true,
      sellerId: fashionHub.id,
      categoryId: fashion.id,
    },
    {
      name: 'Designer Sunglasses',
      description: 'UV-protected polarized sunglasses',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
      stock: 40,
      featured: false,
      sellerId: fashionHub.id,
      categoryId: fashion.id,
    },
    {
      name: 'Canvas Backpack',
      description: 'Durable canvas backpack with laptop compartment',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      stock: 50,
      featured: false,
      sellerId: fashionHub.id,
      categoryId: fashion.id,
    },
    {
      name: 'Running Shoes Elite',
      description: 'Lightweight running shoes with cushioned sole',
      price: 119.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      stock: 35,
      featured: true,
      sellerId: fashionHub.id,
      categoryId: fashion.id,
    },

    // Home & Living
    {
      name: 'Modern Table Lamp',
      description: 'Minimalist LED table lamp with touch controls',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
      stock: 55,
      featured: false,
      sellerId: homeComfort.id,
      categoryId: home.id,
    },
    {
      name: 'Throw Pillow Set',
      description: 'Set of 4 decorative throw pillows in neutral tones',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400',
      stock: 70,
      featured: false,
      sellerId: homeComfort.id,
      categoryId: home.id,
    },
    {
      name: 'Ceramic Plant Pot Set',
      description: 'Set of 3 modern ceramic plant pots',
      price: 44.99,
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400',
      stock: 45,
      featured: true,
      sellerId: homeComfort.id,
      categoryId: home.id,
    },
    {
      name: 'Wall Mirror Round',
      description: 'Round wall mirror with brass frame',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400',
      stock: 30,
      featured: false,
      sellerId: homeComfort.id,
      categoryId: home.id,
    },

    // Sports & Outdoors
    {
      name: 'Yoga Mat Premium',
      description: 'Extra thick yoga mat with carrying strap',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
      stock: 65,
      featured: true,
      sellerId: activeLife.id,
      categoryId: sports.id,
    },
    {
      name: 'Camping Tent 4-Person',
      description: 'Waterproof camping tent with easy setup',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400',
      stock: 20,
      featured: false,
      sellerId: activeLife.id,
      categoryId: sports.id,
    },
    {
      name: 'Dumbbell Set',
      description: 'Adjustable dumbbell set 10-50 lbs',
      price: 179.99,
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
      stock: 28,
      featured: false,
      sellerId: activeLife.id,
      categoryId: sports.id,
    },
    {
      name: 'Hiking Backpack 30L',
      description: 'Lightweight hiking backpack with hydration system',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=400',
      stock: 40,
      featured: true,
      sellerId: activeLife.id,
      categoryId: sports.id,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: product,
    })
  }

  console.log('✅ Products created')
  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
