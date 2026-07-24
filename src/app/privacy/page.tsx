import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-16">
      <section className="relative overflow-hidden bg-[var(--background)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,83,0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">Legal</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight text-white">Privacy Policy</h1>
          <p className="mt-4 max-w-lg mx-auto text-sm text-zinc-400">Last updated: July 24, 2026</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="prose-dark space-y-10 text-sm leading-relaxed text-zinc-400">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly: name, email address, shipping address, phone number, and payment details. We also automatically collect device information, IP address, browsing activity, and cookies to improve your experience.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use your information to: process and fulfill orders, send order confirmations and updates, personalize your shopping experience, send marketing communications (with your consent), improve our platform and services, and comply with legal obligations.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share your data with: payment processors for transaction fulfillment, shipping carriers for delivery, analytics providers to improve our services, and law enforcement when legally required.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Data Security</h2>
            <p>We implement industry-standard security measures including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to maintain your session, remember your preferences, analyze platform usage, and deliver personalized content. You can control cookies through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Your Rights</h2>
            <p>You have the right to: access your personal data, correct inaccurate information, request deletion of your data, opt out of marketing communications, and export your data in a portable format. Contact us to exercise these rights.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Data Retention</h2>
            <p>We retain your information for as long as your account is active or as needed to provide services. Account data can be deleted upon request. Transaction records are retained for 7 years for legal and tax compliance.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Children&apos;s Privacy</h2>
            <p>Our platform is not intended for children under 18. We do not knowingly collect personal information from children. If we discover that a child has provided us with personal data, we will delete it immediately.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. Changes to This Policy</h2>
            <p>We may update this policy from time to time. Significant changes will be communicated via email or a prominent notice on our platform. Continued use after changes indicates acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">10. Contact Us</h2>
            <p>For privacy-related inquiries, contact us at <span className="text-[var(--gold)]">ghotamdulhani123@gmail.com</span> or visit our <Link href="/contact" className="text-[var(--gold)] hover:underline">Contact page</Link>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
