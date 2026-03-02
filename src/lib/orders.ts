import { push, ref, set } from "firebase/database";
import { getFirebaseDb } from "./firebase";
import type { CartItem } from "../context/CartContext";

export type ShippingAddress = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
};

export type OrderInput = {
  uid: string;
  email: string | null;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  address: ShippingAddress;
};

export async function createOrder(input: OrderInput): Promise<{ orderId: string }> {
  const db = getFirebaseDb();
  const ordersRef = ref(db, `orders/${input.uid}`);
  const newRef = push(ordersRef);
  const orderId = newRef.key!;

  await set(newRef, {
    ...input,
    orderId,
    createdAt: Date.now(),
  });

  return { orderId };
}


