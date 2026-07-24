import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type Body = {
  to: string;
  orderId: string;
  total: number;
  items?: Array<{ name: string; quantity: number; price: number }>;
};

function formatPrice(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    if (!body?.to || !body?.orderId) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields (to, orderId)." },
        { status: 400 },
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const from = process.env.ORDER_EMAIL_FROM;

    if (!resendApiKey || !from) {
      console.warn("Email not sent — RESEND_API_KEY or ORDER_EMAIL_FROM not configured.");
      return NextResponse.json({ ok: false, error: "Email service not configured." }, { status: 503 });
    }

    const resend = new Resend(resendApiKey);

    const itemsHtml = body.items?.length
      ? body.items.map((it) => `
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #eee;color:#333;">${it.name}</td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;color:#666;">${it.quantity}</td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;color:#333;">${formatPrice(it.price * it.quantity)}</td>
          </tr>
        `).join("")
      : "";

    await resend.emails.send({
      from,
      to: body.to,
      subject: `Order Confirmed — #${body.orderId.slice(0, 12)}`,
      html: `
        <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Arial;max-width:600px;margin:0 auto;padding:40px 20px;">
          <div style="text-align:center;margin-bottom:32px;">
            <h1 style="font-size:24px;font-weight:900;letter-spacing:2px;color:#000;margin:0;">SHOPNEST<span style="color:#d4a853;">.</span></h1>
          </div>
          <div style="background:#f9fafb;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
            <div style="width:64px;height:64px;border-radius:50%;background:#d4fae5;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
              <span style="font-size:28px;">✓</span>
            </div>
            <h2 style="font-size:20px;font-weight:700;color:#111;margin:0 0 8px;">Order Confirmed!</h2>
            <p style="font-size:14px;color:#666;margin:0;">Thank you for your purchase.</p>
          </div>
          <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:24px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
              <span style="font-size:13px;color:#666;">Order ID</span>
              <span style="font-size:13px;font-weight:600;color:#111;font-family:monospace;">#${body.orderId.slice(0, 12)}</span>
            </div>
            ${itemsHtml ? `
            <table style="width:100%;border-collapse:collapse;margin-top:12px;">
              <thead>
                <tr>
                  <td style="padding:8px 0;border-bottom:2px solid #e5e7eb;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#999;">Item</td>
                  <td style="padding:8px 0;border-bottom:2px solid #e5e7eb;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#999;text-align:center;">Qty</td>
                  <td style="padding:8px 0;border-bottom:2px solid #e5e7eb;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#999;text-align:right;">Price</td>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            ` : ""}
            <div style="margin-top:16px;padding-top:16px;border-top:2px solid #111;display:flex;justify-content:space-between;">
              <span style="font-size:16px;font-weight:700;color:#111;">Total</span>
              <span style="font-size:18px;font-weight:900;color:#d4a853;">${formatPrice(body.total)}</span>
            </div>
          </div>
          <div style="border:1px solid #fef3c7;background:#fffbeb;border-radius:12px;padding:16px;margin-bottom:24px;">
            <p style="font-size:13px;color:#92400e;margin:0;">📦 Your order will be processed and shipped within 2-3 business days. You&apos;ll receive a shipping confirmation email with tracking details.</p>
          </div>
          <p style="font-size:12px;color:#999;text-align:center;margin:0;">This is a demo project email. No real order was placed.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
