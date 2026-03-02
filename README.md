## Overview

**Tech stack**
- **Frontend / Backend**: Next.js (App Router, React, TypeScript)
- **Styling**: TailwindCSS (Next.js app-tw template)
- **Auth**: Firebase Authentication (email/password)
- **Database**: Firebase Realtime Database (products collection, cart persists in `localStorage`)
- **Deployment target**: Vercel

The app implements:
- Home page with featured products
- Product listing page with search and category filter
- Product details page
- Cart page with add/remove/update and local persistence
- Firebase-authenticated users (login / signup)
- Admin panel (protected by admin email) with full product CRUD and a `featured` flag

## 1. Setup & Installation

```bash
git clone https://github.com/<your-username>/ecommerce-fullstack-design.git
cd ecommerce-fullstack-design
npm install
```

### Firebase configuration

Create a Firebase project in the Firebase console, then enable:
- **Authentication → Email/Password**
- **Realtime Database → start in test mode** (or production rules as required)

Create a `.env.local` file in the project root with your Firebase config:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# email address that is considered "admin" in the UI
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

Restart the dev server after changing environment variables.

## 2. Development

Run the app locally:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Main routes

- `/` – **Home**: hero section + featured products (uses `featured` flag from Firebase)
- `/products` – **Product listing**: all products in a responsive grid with:
  - Text search (name/category)
  - Category filter dropdown
- `/products/[id]` – **Product details** page with Add to cart
- `/cart` – **Cart**:
  - Add/remove items, update quantity
  - Order summary (total items, subtotal, total)
  - Cart data is persisted in `localStorage`
- `/auth/login` – **Login** (Firebase email/password)
- `/auth/signup` – **Signup** (Firebase email/password)
- `/admin` – **Admin panel** (protected):
  - Only available when `user.email === NEXT_PUBLIC_ADMIN_EMAIL`
  - Create, edit, delete products
  - Fields: `name`, `price`, `image`, `description`, `category`, `stock`, `featured`

### Data model (Firebase Realtime Database)

`products` collection structure:

```json
{
  "products": {
    "<productId>": {
      "name": "Product name",
      "price": 99.99,
      "image": "https://example.com/image.jpg",
      "description": "Long description...",
      "category": "Category name",
      "stock": 10,
      "featured": true
    }
  }
}
```

You can seed products manually in Firebase console or via the **Admin** page.

## 3. Building & Deployment (Vercel)

Build locally:

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push this repository to GitHub (e.g. `ecommerce-fullstack-design`).
2. Go to Vercel and **Import Project** from GitHub.
3. Set the same environment variables from `.env.local` in the **Vercel Project → Settings → Environment Variables**.
4. Deploy – Vercel will detect Next.js and build automatically.

After deployment, verify:
- All routes work (`/`, `/products`, `/products/[id]`, `/cart`, `/auth/*`, `/admin`)
- Firebase read/write access is correct in production.

## 4. Notes for Reviewers

- No custom JWT implementation is used – **Firebase Auth** handles authentication.
- Admin access is restricted to the configured `NEXT_PUBLIC_ADMIN_EMAIL`.
- Cart state is kept client-side with `localStorage` as required.
- The layout is responsive using Tailwind utility classes (flex/grid, responsive paddings, etc.).
