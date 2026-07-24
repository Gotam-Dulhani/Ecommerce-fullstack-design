import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-16">
      <section className="relative overflow-hidden bg-[var(--background)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,83,0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">Legal</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight text-white">Terms of Service</h1>
          <p className="mt-4 max-w-lg mx-auto text-sm text-zinc-400">Last updated: July 24, 2026</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="prose-dark space-y-10 text-sm leading-relaxed text-zinc-400">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using the ShopNest website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Account Registration</h2>
            <p>To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be at least 18 years old to create an account.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Products and Pricing</h2>
            <p>All product descriptions, images, and specifications are provided for informational purposes. We strive to display accurate colors and details, but cannot guarantee that your screen&apos;s display will be perfectly accurate. All prices are listed in Pakistani Rupees (PKR) and are subject to change without notice.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Orders and Payment</h2>
            <p>By placing an order, you are making an offer to purchase a product. We reserve the right to accept or decline any order. Payment must be completed before an order is processed. We accept the payment methods displayed at checkout.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Shipping and Delivery</h2>
            <p>We ship to addresses within Pakistan. Standard delivery times are estimates and may vary. Free shipping is available on orders above Rs. 42,000. A flat shipping fee of Rs. 2,799 applies to orders below this threshold.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Returns and Refunds</h2>
            <p>You may return products within 14 days of delivery if they are unused and in original packaging. Refunds will be processed to the original payment method within 5-7 business days. Custom or personalized items are non-returnable.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Gift Cards</h2>
            <p>Gift cards are non-refundable and cannot be exchanged for cash. Lost or stolen gift cards cannot be replaced. Gift cards do not expire and can be used for any purchase on the platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Intellectual Property</h2>
            <p>All content on this website, including logos, images, text, and designs, is the property of ShopNest and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written consent.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. Limitation of Liability</h2>
            <p>ShopNest shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform or products. Our total liability shall not exceed the amount paid for the specific product in question.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">10. Changes to Terms</h2>
            <p>We reserve the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the revised terms. We will notify users of significant changes via email or platform notification.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">11. Contact</h2>
            <p>For questions about these Terms, contact us at <span className="text-[var(--gold)]">ghotamdulhani123@gmail.com</span> or visit our <Link href="/contact" className="text-[var(--gold)] hover:underline">Contact page</Link>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
