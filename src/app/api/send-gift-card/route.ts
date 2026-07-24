import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type Body = {
  to: string;
  recipientName: string;
  senderName: string;
  amount: number;
  giftCode: string;
  message?: string;
};

function formatPrice(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    if (!body?.to || !body?.giftCode || !body?.amount) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
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

    await resend.emails.send({
      from,
      to: body.to,
      subject: `${body.senderName} sent you a ${formatPrice(body.amount)} gift card!`,
      html: `
        <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Arial;max-width:600px;margin:0 auto;padding:40px 20px;">
          <div style="text-align:center;margin-bottom:32px;">
            <h1 style="font-size:24px;font-weight:900;letter-spacing:2px;color:#000;margin:0;">SHOPNEST<span style="color:#d4a853;">.</span></h1>
          </div>

          <div style="background:linear-gradient(135deg,#d4a853,#b8923e);border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;color:#000;">
            <p style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;opacity:0.7;margin:0 0 16px;">🎁 Gift Card</p>
            <p style="font-size:40px;font-weight:900;margin:0;">${formatPrice(body.amount)}</p>
            <div style="margin-top:20px;display:flex;justify-content:center;gap:24px;font-size:13px;">
              <div><span style="opacity:0.6;">To</span><br/><strong>${body.recipientName}</strong></div>
              <div><span style="opacity:0.6;">From</span><br/><strong>${body.senderName}</strong></div>
            </div>
            ${body.message ? `<p style="margin-top:16px;font-size:13px;font-style:italic;opacity:0.85;">&ldquo;${body.message}&rdquo;</p>` : ""}
          </div>

          <div style="border:2px dashed #d4a853;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
            <p style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999;margin:0 0 8px;">Your gift card code</p>
            <p style="font-size:24px;font-weight:900;letter-spacing:3px;color:#d4a853;font-family:monospace;margin:0;">${body.giftCode}</p>
            <p style="font-size:12px;color:#999;margin:12px 0 0;">Use this code at checkout to redeem your gift card.</p>
          </div>

          <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:24px;">
            <p style="font-size:13px;color:#666;margin:0;">🛍️ Browse our curated collection of 148+ premium products and use your gift card at checkout. Free shipping on orders over Rs. 5,000.</p>
          </div>

          <div style="text-align:center;margin-bottom:24px;">
            <a href="https://ecommerce-fullstack-design-omega-teal.vercel.app/products" style="display:inline-block;background:#d4a853;color:#000;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:14px 32px;border-radius:999px;text-decoration:none;">Start Shopping</a>
          </div>

          <p style="font-size:12px;color:#999;text-align:center;margin:0;">This is a demo project email. No real gift card was purchased.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
