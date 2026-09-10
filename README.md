# E-Commerce Marketplace MVP

A lean multi-seller marketplace web application built with Next.js, TypeScript, Tailwind CSS, and Prisma. Browse products from multiple sellers, add items to your cart, and explore seller storefronts. Now with full authentication support!

## Features

- 🔐 **Authentication**: Sign up, sign in, and sign out with secure password hashing
- 👤 **User Roles**: Buyer, Seller, or Both account types
- 🏠 **Home Page**: Featured products and category navigation
- 📂 **Category Browsing**: Browse products by category
- 🔍 **Product Details**: Detailed product information with add to cart
- 🛒 **Shopping Cart**: Add, update, and remove items with persistent storage (cookie-based for guests, database for logged-in users)
- 🏪 **Seller Storefronts**: View products from individual sellers
- 📱 **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Authentication**: Auth.js (NextAuth v5) with Credentials provider
- **Password Hashing**: bcryptjs
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

## Demo Accounts

The seed script creates demo accounts you can use to test authentication:

### Buyer Account
- **Email**: `buyer@demo.com`
- **Password**: `buyer123`
- **Role**: Buyer

### Seller Accounts
- **Email**: `seller@demo.com`
- **Password**: `seller123`
- **Role**: Seller
- **Store**: TechStore (linked to this account)

- **Email**: `hello@fashionhub.example`
- **Password**: `fashion123`
- **Role**: Seller
- **Store**: Fashion Hub (linked to this account)

You can also create new accounts using the Sign Up page.

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
│   ├── actions/           # Server actions (cart + auth operations)
│   ├── api/auth/          # Auth.js API routes
│   ├── auth/              # Authentication pages (sign in, sign up)
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
│   ├── product-card.tsx
│   ├── signin-form.tsx
│   ├── signout-button.tsx
│   └── signup-form.tsx
├── lib/                   # Utility functions
│   ├── cart.ts           # Cart management utilities
│   └── prisma.ts         # Prisma client instance
├── types/                 # TypeScript type definitions
│   └── next-auth.d.ts    # NextAuth session types
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Prisma schema
│   ├── migrations/       # Database migrations
│   └── seed.ts           # Database seeding script
├── auth.ts               # Auth.js configuration
├── .env                  # Environment variables
└── package.json
```

## Database Schema

The application uses the following main models:

- **User**: User accounts with email, hashed password, name, and role (BUYER, SELLER, or BOTH)
- **Seller**: Marketplace sellers with name, description, contact info, and optional User relation
- **Category**: Product categories (Electronics, Fashion, Home & Living, Sports)
- **Product**: Products with pricing, stock, images, and relations to sellers and categories
- **CartItem**: Shopping cart items linked to users (for authenticated users)

## Demo Data

The seed script populates the database with:
- 3 demo user accounts (1 buyer, 2 sellers) with documented passwords
- 4 categories
- 4 sellers (2 linked to user accounts)
- 16 products across all categories
- Featured products on the home page

## Out of Scope (MVP)

This MVP intentionally excludes:
- Real payment processing / checkout
- OAuth providers (GitHub, Google, etc.)
- Email verification / password reset
- Admin panel
- Image uploads (uses placeholder URLs)

## Authentication

The marketplace uses Auth.js (NextAuth v5) with a Credentials provider for authentication:

- Passwords are securely hashed using bcryptjs before storage
- Sessions are managed with JWT tokens
- Users can sign up as Buyers, Sellers, or Both
- When signing up as a Seller, a seller storefront is automatically created
- The header displays user information and a sign-out button when logged in

## Cart Implementation

The shopping cart has dual modes:
- **Authenticated users**: Cart items are stored in the database and persist across devices
- **Guest users**: Cart uses cookies for persistence
- Cart operations are handled through Next.js Server Actions for seamless updates

## Development Notes

- SQLite database file is located at `prisma/dev.db`
- Prisma Client is configured with the `better-sqlite3` adapter
- The app uses Next.js Server Components by default for optimal performance
- Cart interactions use Client Components for interactivity

## License

This is an MVP project created for demonstration purposes.
