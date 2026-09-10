# Haatly

A modern multi-seller marketplace that brings the warmth of a traditional haat to your screen. Built with Next.js, TypeScript, Tailwind CSS, and Prisma. Browse quality products from trusted sellers, manage your cart, explore unique storefronts, and complete secure payments with Razorpay. Featuring full authentication and integrated payment processing.

## Features

- 🔐 **Authentication**: Sign up, sign in, and sign out with secure password hashing
- 👤 **User Roles**: Buyer, Seller, or Both account types
- 💳 **Razorpay Payments**: Complete checkout flow with payment gateway integration (India)
- 📦 **Order Management**: Track orders, view order history, and payment status
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
- **Payment Gateway**: Razorpay (test mode)
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

## Razorpay Payment Setup

To enable payments, you need to configure Razorpay credentials:

### 1. Get Test Credentials

1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
2. Sign up or log in to your Razorpay account
3. Navigate to **Settings → API Keys**
4. Switch to **Test Mode** (toggle in top-right corner)
5. Generate new test keys if you don't have them
6. Copy your **Key ID** and **Key Secret**

### 2. Configure Environment Variables

Add your Razorpay credentials to the `.env` file:

```bash
# Razorpay credentials (test mode)
RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_secret_key"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_your_key_id"
```

**Important**: 
- Use **test mode** keys (start with `rzp_test_`)
- Keep `RAZORPAY_KEY_SECRET` secure and never commit it
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` is exposed to the browser

### 3. Test Payment Flow

After configuring credentials, test the complete flow:

1. **Sign in** with a demo account (e.g., `buyer@demo.com` / `buyer123`)
2. **Add items** to your cart from any product page
3. Go to **Cart** and click "Proceed to Checkout"
4. Review your order on the **Checkout** page
5. Click "Proceed to Payment" to open Razorpay checkout
6. Use Razorpay's test card details:
   - **Card Number**: `4111 1111 1111 1111`
   - **CVV**: Any 3 digits (e.g., `123`)
   - **Expiry**: Any future date (e.g., `12/25`)
   - **Name**: Any name
7. Complete payment and view your **Order Confirmation**
8. Check **My Orders** to see your order history

### Without Credentials

If Razorpay credentials are not configured:
- The app will still run normally
- Checkout page shows a setup message with instructions
- All other features (browse, cart, auth) work without payment setup

### Test Cards

Razorpay provides these test cards for different scenarios:

| Card Number | Scenario |
|-------------|----------|
| 4111 1111 1111 1111 | Successful payment |
| 5555 5555 5555 4444 | Successful payment |
| 4000 0000 0000 0002 | Payment declined |

More test scenarios: [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-upi-details/)

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
- **Order**: Customer orders with status tracking (PENDING, PAID, FAILED, CANCELLED)
- **OrderItem**: Individual items in an order with pricing snapshot

## Demo Data

The seed script populates the database with:
- 3 demo user accounts (1 buyer, 2 sellers) with documented passwords
- 4 categories
- 4 sellers (2 linked to user accounts)
- 16 products across all categories
- Featured products on the home page

## Out of Scope (MVP)

This MVP intentionally excludes:
- Production payment webhooks (basic verification implemented)
- Marketplace split payments / seller payouts
- Refunds UI / subscription payments
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

## Payment Implementation

The marketplace uses Razorpay's standard checkout flow:

1. **Order Creation**: Server creates a Razorpay order with amount in paise
2. **Checkout Modal**: Razorpay's hosted checkout opens for payment
3. **Payment Verification**: Server verifies payment signature using HMAC SHA256
4. **Order Update**: Order status updated to PAID after successful verification
5. **Cart Clearing**: User's cart is cleared after successful payment

All amounts are handled in INR (Indian Rupees), converted to paise for Razorpay APIs.

## Cart Implementation

The shopping cart has dual modes:
- **Authenticated users**: Cart items are stored in the database and persist across devices
- **Guest users**: Cart uses cookies for persistence
- **Checkout requirement**: Users must be logged in to complete checkout
- Cart operations are handled through Next.js Server Actions for seamless updates

## Development Notes

- SQLite database file is located at `prisma/dev.db`
- Prisma Client is configured with the `better-sqlite3` adapter
- The app uses Next.js Server Components by default for optimal performance
- Cart and payment interactions use Client Components for interactivity
- Razorpay checkout script is loaded dynamically via Next.js Script component
- Payment signature verification happens server-side for security
- Test mode allows unlimited transactions without real money

## License

This is an MVP project created for demonstration purposes.
