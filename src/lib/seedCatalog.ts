import type { ProductInput } from "./products";

// A reasonably large demo catalog to populate Firebase RTDB quickly.
// Images are public URLs; you can replace these with your own hosted images later.
export const SEED_PRODUCTS: ProductInput[] = [
  {
    name: "Minimal Leather Tote Bag",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1520975693411-b4a8c97a6f65?auto=format&fit=crop&w=1200&q=80",
    description:
      "A structured everyday tote crafted from smooth leather with a clean silhouette and roomy interior.",
    category: "Accessories",
    stock: 30,
    featured: true,
    rating: 4.6,
    ratingCount: 183,
  },
  {
    name: "Classic White Sneakers",
    price: 74.5,
    image:
      "https://images.unsplash.com/photo-1528701800489-20be3c2ea20a?auto=format&fit=crop&w=1200&q=80",
    description:
      "Comfortable low-top sneakers with durable stitching and a timeless look that pairs with anything.",
    category: "Footwear",
    stock: 60,
    featured: true,
    rating: 4.7,
    ratingCount: 421,
  },
  {
    name: "Oversized Cotton Hoodie",
    price: 54.0,
    image:
      "https://images.unsplash.com/photo-1520975913038-9d06a04ed3c6?auto=format&fit=crop&w=1200&q=80",
    description:
      "Soft fleece-lined hoodie with an oversized fit for a cozy, modern streetwear vibe.",
    category: "Apparel",
    stock: 45,
    featured: false,
    rating: 4.3,
    ratingCount: 97,
  },
  {
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1526401281623-279b498f10a8?auto=format&fit=crop&w=1200&q=80",
    description:
      "Insulated bottle keeps drinks cold for hours. Leakproof lid and matte finish.",
    category: "Lifestyle",
    stock: 120,
    featured: false,
    rating: 4.4,
    ratingCount: 256,
  },
  {
    name: "Noise-Cancelling Headphones",
    price: 199.0,
    image:
      "https://images.unsplash.com/photo-1518441902113-f0a7b4190b8b?auto=format&fit=crop&w=1200&q=80",
    description:
      "Immersive sound with active noise cancelling and all-day comfort for work or travel.",
    category: "Electronics",
    stock: 25,
    featured: true,
    rating: 4.8,
    ratingCount: 1120,
  },
  {
    name: "Wireless Charging Pad",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    description:
      "Fast wireless charging with a slim profile. Works with most Qi-enabled devices.",
    category: "Electronics",
    stock: 80,
    featured: false,
    rating: 4.2,
    ratingCount: 311,
  },
  {
    name: "Ceramic Coffee Mug Set (2pcs)",
    price: 22.0,
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80",
    description:
      "Two minimalist ceramic mugs with a comfortable handle and smooth glazed finish.",
    category: "Home",
    stock: 70,
    featured: false,
    rating: 4.5,
    ratingCount: 144,
  },
  {
    name: "Scandinavian Desk Lamp",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    description:
      "Warm, focused lighting with a clean metal shade and adjustable arm.",
    category: "Home",
    stock: 35,
    featured: true,
    rating: 4.6,
    ratingCount: 88,
  },
  {
    name: "Slim Fit Denim Jacket",
    price: 99.0,
    image:
      "https://images.unsplash.com/photo-1520975958221-24b87c57d8e5?auto=format&fit=crop&w=1200&q=80",
    description:
      "A versatile denim jacket with a modern cut, perfect for layering year-round.",
    category: "Apparel",
    stock: 28,
    featured: true,
    rating: 4.4,
    ratingCount: 201,
  },
  {
    name: "Everyday Analog Watch",
    price: 129.0,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    description:
      "Classic analog watch with a minimalist dial and comfortable strap.",
    category: "Accessories",
    stock: 40,
    featured: false,
    rating: 4.1,
    ratingCount: 76,
  },
  {
    name: "Premium Yoga Mat",
    price: 39.95,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    description:
      "Non-slip mat with cushioned support—ideal for yoga, pilates, and stretching.",
    category: "Fitness",
    stock: 75,
    featured: false,
    rating: 4.7,
    ratingCount: 392,
  },
  {
    name: "Adjustable Dumbbell Set",
    price: 159.0,
    image:
      "https://images.unsplash.com/photo-1517960413843-0aee8e2d471c?auto=format&fit=crop&w=1200&q=80",
    description:
      "Space-saving adjustable dumbbells for full-body workouts at home.",
    category: "Fitness",
    stock: 18,
    featured: false,
    rating: 4.5,
    ratingCount: 65,
  },
  {
    name: "Portable Bluetooth Speaker",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80",
    description:
      "Big sound in a compact body. Water-resistant and perfect for weekends.",
    category: "Electronics",
    stock: 55,
    featured: true,
    rating: 4.6,
    ratingCount: 534,
  },
  {
    name: "Modern Throw Pillow",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1615873968403-89c97a2a5a6c?auto=format&fit=crop&w=1200&q=80",
    description:
      "Textured pillow cover with a modern pattern to refresh your living space.",
    category: "Home",
    stock: 100,
    featured: false,
    rating: 4.2,
    ratingCount: 58,
  },
  {
    name: "Minimalist Sunglasses",
    price: 34.0,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    description:
      "UV400 lenses with a lightweight frame—clean design, comfortable fit.",
    category: "Accessories",
    stock: 90,
    featured: false,
    rating: 4.0,
    ratingCount: 39,
  },
  {
    name: "Travel Backpack 22L",
    price: 79.0,
    image:
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80",
    description:
      "Organized compartments, padded laptop sleeve, and durable fabric for everyday carry.",
    category: "Accessories",
    stock: 32,
    featured: true,
    rating: 4.7,
    ratingCount: 284,
  },
  {
    name: "Linen Blend Shirt",
    price: 45.0,
    image:
      "https://images.unsplash.com/photo-1520975869018-afe98a0e8a5b?auto=format&fit=crop&w=1200&q=80",
    description:
      "Breathable linen blend with a relaxed fit—perfect for warm weather.",
    category: "Apparel",
    stock: 38,
    featured: false,
    rating: 4.2,
    ratingCount: 91,
  },
  {
    name: "Everyday Chinos",
    price: 52.0,
    image:
      "https://images.unsplash.com/photo-1520975682071-5d0df0d500c0?auto=format&fit=crop&w=1200&q=80",
    description:
      "Comfort stretch chinos with a clean taper—smart enough for work, easy for weekends.",
    category: "Apparel",
    stock: 44,
    featured: false,
    rating: 4.3,
    ratingCount: 73,
  },
  {
    name: "Kitchen Knife (Chef 8\")",
    price: 69.0,
    image:
      "https://images.unsplash.com/photo-1542826438-1f1f26dfade8?auto=format&fit=crop&w=1200&q=80",
    description:
      "Sharp, balanced chef’s knife with a comfortable handle for daily prep.",
    category: "Home",
    stock: 24,
    featured: false,
    rating: 4.6,
    ratingCount: 168,
  },
  {
    name: "Aroma Candle — Cedar & Vanilla",
    price: 18.5,
    image:
      "https://images.unsplash.com/photo-1512207846876-bb54ef505490?auto=format&fit=crop&w=1200&q=80",
    description:
      "Warm cedar and soft vanilla notes for a cozy, relaxing atmosphere.",
    category: "Lifestyle",
    stock: 110,
    featured: true,
    rating: 4.5,
    ratingCount: 219,
  },
  {
    name: "Ergonomic Wireless Mouse",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=1200&q=80",
    description:
      "Comfortable grip and reliable connection for smooth, all-day productivity.",
    category: "Electronics",
    stock: 65,
    featured: false,
    rating: 4.4,
    ratingCount: 142,
  },
  {
    name: "Soft Wool Beanie",
    price: 16.0,
    image:
      "https://images.unsplash.com/photo-1520975952965-5a2cdbd7a5e7?auto=format&fit=crop&w=1200&q=80",
    description:
      "Warm knit beanie with a soft feel and a clean, minimal look.",
    category: "Accessories",
    stock: 85,
    featured: false,
    rating: 4.1,
    ratingCount: 33,
  },
  {
    name: "Running Shoes — Neutral",
    price: 109.0,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    description:
      "Lightweight running shoes with cushioned support for daily runs.",
    category: "Footwear",
    stock: 26,
    featured: false,
    rating: 4.6,
    ratingCount: 304,
  },
  {
    name: "Casual Slip-On Loafers",
    price: 84.0,
    image:
      "https://images.unsplash.com/photo-1528702748617-c64d49f918af?auto=format&fit=crop&w=1200&q=80",
    description:
      "Easy slip-on loafers with a comfortable footbed for all-day wear.",
    category: "Footwear",
    stock: 22,
    featured: true,
    rating: 4.4,
    ratingCount: 47,
  },
];


