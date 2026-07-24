import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";
const ORDER_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE || "";

let initialized = false;

function ensureInit() {
  if (!initialized && EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    initialized = true;
  }
}

export async function sendOrderConfirmation(params: {
  to: string;
  orderId: string;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}): Promise<boolean> {
  if (!EMAILJS_SERVICE_ID || !ORDER_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn("EmailJS not configured — skipping order email.");
    return false;
  }
  ensureInit();
  const itemsList = params.items
    .map((it) => `${it.name} x${it.quantity} — Rs. ${(it.price * it.quantity).toLocaleString("en-PK")}`)
    .join("\n");
  await emailjs.send(EMAILJS_SERVICE_ID, ORDER_TEMPLATE_ID, {
    to_email: params.to,
    order_id: params.orderId,
    total: `Rs. ${params.total.toLocaleString("en-PK")}`,
    items: itemsList,
  });
  return true;
}
