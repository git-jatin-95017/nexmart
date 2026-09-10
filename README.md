# E-Commerce Marketplace MVP

A lean multi-seller marketplace web application built with Next.js, TypeScript, Tailwind CSS, and Prisma. Browse products from multiple sellers, add items to your cart, and explore seller storefronts.

## Features

- 🏠 **Home Page**: Featured products and category navigation
- 📂 **Category Browsing**: Browse products by category
- 🔍 **Product Details**: Detailed product information with add to cart
- 🛒 **Shopping Cart**: Add, update, and remove items with persistent storage
- 🏪 **Seller Storefronts**: View products from individual sellers
- 📱 **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

1. **Clone the repository** (or use this existing project)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the database**:
   
   The migrations should already be applied, but if needed:
   ```bash
   npm run db:migrate
   ```

4. **Seed the database** (if not already seeded):
   ```bash
   npm run db:seed
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:seed` - Seed the database with demo data
- `npm run db:reset` - Reset database and re-seed

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── actions/           # Server actions (cart operations)
│   ├── cart/              # Shopping cart page
│   ├── categories/        # Category listing and detail pages
│   ├── products/          # Product detail pages
│   ├── sellers/           # Seller storefront pages
│   ├── layout.tsx         # Root layout with header
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── add-to-cart-button.tsx
│   ├── cart-item.tsx
│   ├── category-card.tsx
│   ├── header.tsx
│   └── product-card.tsx
├── lib/                   # Utility functions
│   ├── cart.ts           # Cart management utilities
│   └── prisma.ts         # Prisma client instance
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Prisma schema
│   ├── migrations/       # Database migrations
│   └── seed.ts           # Database seeding script
└── package.json
```

## Database Schema

The application uses three main models:

- **Seller**: Marketplace sellers with name, description, and contact info
- **Category**: Product categories (Electronics, Fashion, Home & Living, Sports)
- **Product**: Products with pricing, stock, images, and relations to sellers and categories

## Demo Data

The seed script populates the database with:
- 4 categories
- 4 sellers
- 16 products across all categories
- Featured products on the home page

## Out of Scope (MVP)

This MVP intentionally excludes:
- Real payment processing / checkout
- User authentication / login
- Admin panel
- Image uploads (uses placeholder URLs)

## Cart Implementation

The shopping cart uses cookies for persistence, allowing cart state to survive page refreshes. Cart operations are handled through Next.js Server Actions for seamless updates.

## Development Notes

- SQLite database file is located at `prisma/dev.db`
- Prisma Client is configured with the `better-sqlite3` adapter
- The app uses Next.js Server Components by default for optimal performance
- Cart interactions use Client Components for interactivity

## License

This is an MVP project created for demonstration purposes.
