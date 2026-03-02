import {
  child,
  get,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { getFirebaseDb } from "./firebase";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
  featured?: boolean;
  // eCommerce-style rating summary
  rating?: number; // 0-5
  ratingCount?: number; // number of reviews/ratings
};

const PRODUCTS_COLLECTION_KEY = "products";

export async function fetchAllProducts(): Promise<Product[]> {
  const firebaseDb = getFirebaseDb();
  const snapshot = await get(ref(firebaseDb, PRODUCTS_COLLECTION_KEY));
  const value = snapshot.val() as Record<string, Omit<Product, "id">> | null;
  if (!value) return [];
  return Object.entries(value).map(([id, data]) => ({ id, ...data }));
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const all = await fetchAllProducts();
  return all.filter((p) => p.featured);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const firebaseDb = getFirebaseDb();
  const snapshot = await get(child(ref(firebaseDb), `${PRODUCTS_COLLECTION_KEY}/${id}`));
  const value = snapshot.val();
  if (!value) return null;
  return { id, ...(value as Omit<Product, "id">) };
}

export type ProductInput = Omit<Product, "id">;

export async function createProduct(input: ProductInput): Promise<Product> {
  const firebaseDb = getFirebaseDb();
  const collectionRef = ref(firebaseDb, PRODUCTS_COLLECTION_KEY);
  const newRef = push(collectionRef);
  const id = newRef.key!;
  await set(newRef, input);
  return { id, ...input };
}

export async function updateProduct(
  id: string,
  updates: Partial<ProductInput>,
): Promise<void> {
  const firebaseDb = getFirebaseDb();
  const productRef = ref(firebaseDb, `${PRODUCTS_COLLECTION_KEY}/${id}`);
  await update(productRef, updates);
}

export async function deleteProduct(id: string): Promise<void> {
  const firebaseDb = getFirebaseDb();
  const productRef = ref(firebaseDb, `${PRODUCTS_COLLECTION_KEY}/${id}`);
  await remove(productRef);
}

export async function deleteAllProducts(): Promise<void> {
  const firebaseDb = getFirebaseDb();
  await remove(ref(firebaseDb, PRODUCTS_COLLECTION_KEY));
}


