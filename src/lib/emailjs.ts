import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

export const ORDER_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE || "";
export const GIFT_CARD_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_GIFT_TEMPLATE || "";

export function initEmailJS() {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
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
  initEmailJS();
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

export async function sendGiftCard(params: {
  to: string;
  recipientName: string;
  senderName: string;
  amount: number;
  giftCode: string;
  message: string;
}): Promise<boolean> {
  if (!EMAILJS_SERVICE_ID || !GIFT_CARD_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn("EmailJS not configured — skipping gift card email.");
    return false;
  }
  initEmailJS();
  await emailjs.send(EMAILJS_SERVICE_ID, GIFT_CARD_TEMPLATE_ID, {
    to_email: params.to,
    recipient_name: params.recipientName,
    sender_name: params.senderName,
    amount: `Rs. ${params.amount.toLocaleString("en-PK")}`,
    gift_code: params.giftCode,
    message: params.message || "No message",
  });
  return true;
}
