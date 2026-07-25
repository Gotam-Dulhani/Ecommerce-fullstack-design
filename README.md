# ShopNest — Premium Dark Luxury eCommerce

A fully functional eCommerce web application with a bold dark luxury aesthetic, built with Next.js and deployed on Vercel with Firebase backend.

**Live URL:** [ecommerce-fullstack-design-omega-teal.vercel.app](https://ecommerce-fullstack-design-omega-teal.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | TailwindCSS v4 |
| Auth | Firebase Authentication (email/password + email verification) |
| Database | Firebase Realtime Database |
| Icons | Lucide React |
| Animations | Framer Motion |
| Emails | EmailJS (client-side) |
| Deployment | Vercel |

---

## Features

### Core
- **Home page** — Hero section, category image grid, featured products carousel
- **Shop page** — Full-width category banners, search, sort, category filter pills, responsive product grid
- **Product detail** — Large image, ratings, quantity selector, add to cart, wishlist toggle, related products
- **Cart** — Add/remove/update quantities, order summary, free shipping over Rs. 5,000
- **Checkout** — Multi-step flow (shipping → review), order placed in Firebase

### Auth & User
- **Sign up / Sign in** — Split-screen premium layout with animated gradient background
- **Email verification** — Firebase sends verification link, must verify before checkout
- **Forgot password** — Reset link sent via Firebase
- **Password visibility toggle** — Eye icon on all password fields

### Wishlist
- **Heart toggle** on every product card and product detail page
- **Count badge** on navbar heart icon
- **Wishlist page** — Grid of saved products
- **localStorage persistence** — Survives page refreshes

### Gift Cards
- **4-step flow** — Select amount → Enter details → Review → Success
- **Custom denominations** — Rs. 1,000 to Rs. 25,000 or custom amount
- **Gift card code generation** — Unique `SHOP-XXXX-XXXX-XXXX` codes
- **Gold-gradient card preview** with recipient/sender names

### Admin
- **Product management** — Create, edit, delete products
- **Featured flag** — Mark products as featured for homepage
- **Protected** — Only accessible by configured admin email

### Emails
- **Order confirmation** — Sent via EmailJS on successful checkout
- **Rich HTML template** — Gold branding, itemized order summary, PKR pricing

### Pages
| Route | Description |
|---|---|
| `/` | Homepage with hero, categories, featured products |
| `/products` | Shop with category banners and product grid |
| `/products/[id]` | Product detail with image, ratings, cart/wishlist |
| `/cart` | Shopping cart with summary |
| `/checkout` | Multi-step checkout flow |
| `/checkout/success` | Order confirmation |
| `/wishlist` | Saved products |
| `/gift-cards` | Gift card purchase flow |
| `/auth/login` | Sign in (split-screen) |
| `/auth/signup` | Create account (split-screen) |
| `/auth/verify` | Email verification |
| `/about` | About ShopNest |
| `/contact` | Contact form |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/admin` | Product management (admin only) |

---

## Design System

| Token | Value | Usage |
|---|---|---|
| `--background` | `#09090b` | Page background |
| `--gold` | `#d4a853` | Primary accent |
| `--gold-dim` | `#b8923e` | Hover state |
| `--surface` | `#18181b` | Card backgrounds |
| `--foreground` | `#fafafa` | Text |

**Typography:** Geist Sans, bold headings, uppercase tracking on labels  
**Borders:** Subtle `white/5` dividers, gold hover accents  
**Effects:** Radial gradient hero glows, glassmorphism navbar, pulse animations on auth pages

---

## Currency & Shipping

- **Currency:** Pakistani Rupees (Rs.) — `formatPrice()` utility
- **Shipping:** Rs. 250 flat rate
- **Free shipping:** Orders over Rs. 5,000
- **Product range:** Rs. 149 – Rs. 8,999 across 8 categories

---

## Categories (148 products)

Electronics, Clothing, Footwear, Accessories, Home, Beauty, Sports, Lifestyle

---

## Setup & Installation

```bash
git clone https://github.com/Gotam-Dulhani/Ecommerce-fullstack-design.git
cd ecommerce-fullstack-design
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin email (must match a Firebase Auth user)
NEXT_PUBLIC_ADMIN_EMAIL=your@email.com

# EmailJS (order confirmation emails)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=user_xxxxx
NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE=template_xxxxx
```

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication → Email/Password**
3. Create a **Realtime Database** (start in test mode)
4. Add your deployed Vercel URL to **Authentication → Settings → Authorized domains**

### EmailJS Setup

1. Sign up at [emailjs.com](https://www.emailjs.com) (free — 200 emails/month)
2. Add an email service (connect Gmail)
3. Create an **Order Confirmation** template with variables: `{{to_email}}`, `{{order_id}}`, `{{total}}`, `{{items}}`
4. Copy your Service ID, Public Key, and Template ID
5. Add them as environment variables in Vercel

---

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add all environment variables in **Settings → Environment Variables**
4. Deploy — Vercel auto-detects Next.js

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── order-confirmation/route.ts   # Email API (Resend fallback)
│   │   ├── seed/route.ts                 # Product seeder
│   │   └── send-gift-card/route.ts       # Gift card email API
│   ├── auth/
│   │   ├── login/page.tsx                # Split-screen login
│   │   ├── signup/page.tsx               # Split-screen signup
│   │   └── verify/page.tsx               # Email verification
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── checkout/success/page.tsx
│   ├── products/page.tsx                 # Shop with category banners
│   ├── products/[id]/page.tsx            # Product detail
│   ├── wishlist/page.tsx
│   ├── gift-cards/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── terms/page.tsx
│   ├── privacy/page.tsx
│   ├── admin/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── RatingStars.tsx
│   ├── Skeleton.tsx
│   └── ConfigBanner.tsx
├── context/
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── WishlistContext.tsx
├── lib/
│   ├── firebase.ts
│   ├── products.ts
│   ├── orders.ts
│   ├── seedCatalog.ts                    # 148 products, PKR prices
│   ├── utils.ts                          # formatPrice() utility
│   └── emailjs.ts                        # EmailJS client-side sender
└── public/
```

---

## Notes

- All prices in **Pakistani Rupees (Rs.)**
- Product images from **Unsplash** (external URLs)
- **No payment processing** — this is a demo/fullstack showcase
- Seed catalog auto-updates via version tracking (`SEED_VERSION`)
- Cart and wishlist persist in **localStorage**
- Admin panel requires `NEXT_PUBLIC_ADMIN_EMAIL` env var

---

**Built with Next.js, Firebase, and TailwindCSS**
