import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type Body = {
  to: string;
  orderId: string;
  total: number;
};

function requiredServerEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing server env var: ${name}`);
  return v;
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

    const resendApiKey = requiredServerEnv("RESEND_API_KEY");
    const from = requiredServerEnv("ORDER_EMAIL_FROM"); // e.g. "ShopNest <onboarding@resend.dev>"

    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from,
      to: body.to,
      subject: `Your ShopNest order ${body.orderId}`,
      html: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial; line-height: 1.5;">
          <h2 style="margin:0 0 8px;">Thanks for your order!</h2>
          <p style="margin:0 0 16px;color:#444;">We received your order and will process it shortly.</p>
          <div style="padding:12px 14px;border:1px solid #eee;border-radius:12px;background:#fafafa;">
            <div><b>Order ID:</b> ${body.orderId}</div>
            <div><b>Total:</b> $${Number(body.total ?? 0).toFixed(2)}</div>
          </div>
          <p style="margin:16px 0 0;color:#666;font-size:12px;">
            This is a demo project email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}


