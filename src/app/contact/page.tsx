"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setName(""); setEmail(""); setSubject(""); setMessage("");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 pt-24">
      <div className="max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">Contact</p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Get in touch.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-zinc-400">
          Have a question, suggestion, or just want to say hello? We&apos;d love to hear from you. Our team typically responds within 24 hours.
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr,1.2fr]">
        {/* Contact info */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/10">
              <Mail className="h-4 w-4 text-[var(--gold)]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Email</h3>
              <p className="mt-1 text-sm text-zinc-400">ghotamdulhani123@gmail.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/10">
              <Phone className="h-4 w-4 text-[var(--gold)]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Phone</h3>
              <p className="mt-1 text-sm text-zinc-400">+92 321 1792687</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/10">
              <MapPin className="h-4 w-4 text-[var(--gold)]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Address</h3>
              <p className="mt-1 text-sm text-zinc-400">Karachi, Sindh, Pakistan</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-white/5 bg-[var(--surface)] p-6">
          {submitted ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--gold)]/10">
                <Send className="h-6 w-6 text-[var(--gold)]" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">Message sent!</h3>
              <p className="mt-2 text-sm text-zinc-400">Thanks for reaching out. We&apos;ll get back to you soon.</p>
              <button type="button" onClick={() => setSubmitted(false)} className="mt-6 text-xs font-semibold text-[var(--gold)] hover:underline">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Subject</label>
                <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="How can we help?" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Message</label>
                <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us more..." className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors" />
              </div>
              <button type="submit" className="w-full rounded-full bg-[var(--gold)] py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors">
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
