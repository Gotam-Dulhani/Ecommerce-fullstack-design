"use client";

import Link from "next/link";
import { useState } from "react";
import { Gift, CreditCard, Send, CheckCircle, ArrowLeft, Sparkles } from "lucide-react";
import { formatPrice } from "../../lib/utils";

const DENOMINATIONS = [1000, 2500, 5000, 10000, 25000];

function generateGiftCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "SHOP-";
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

type Step = "select" | "details" | "confirm" | "success";

export default function GiftCardsPage() {
  const [step, setStep] = useState<Step>("select");
  const [amount, setAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [giftCode, setGiftCode] = useState("");
  const [purchased, setPurchased] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const selectedAmount = customAmount ? parseInt(customAmount) || 0 : amount;

  const handlePurchase = async () => {
    const code = generateGiftCode();
    setGiftCode(code);
    setSending(true);
    // Simulate a brief delay for UX
    await new Promise((r) => setTimeout(r, 800));
    setEmailSent(false);
    setSending(false);
    setPurchased(true);
    setStep("success");
  };

  const reset = () => {
    setStep("select");
    setAmount(5000);
    setCustomAmount("");
    setRecipientName("");
    setRecipientEmail("");
    setSenderName("");
    setMessage("");
    setGiftCode("");
    setPurchased(false);
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--background)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,83,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)]/10">
            <Gift className="h-6 w-6 text-[var(--gold)]" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">Give the gift of choice</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight text-white">
            Gift Cards
          </h1>
          <p className="mt-4 max-w-lg mx-auto text-sm text-zinc-400">
            Share premium shopping with someone special. Choose an amount, personalize it, and send it instantly.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-20">
        {/* Progress steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {(["select", "details", "confirm"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                step === "success" || (["select", "details", "confirm"] as Step[]).indexOf(step) > i
                  ? "bg-[var(--gold)] text-black"
                  : step === s
                    ? "bg-[var(--gold)]/20 text-[var(--gold)] ring-2 ring-[var(--gold)]/50"
                    : "bg-white/5 text-zinc-600"
              }`}>
                {step === "success" || (["select", "details", "confirm"] as Step[]).indexOf(step) > i ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 2 && <div className={`h-px w-12 sm:w-20 ${(["select", "details", "confirm"] as Step[]).indexOf(step) > i ? "bg-[var(--gold)]" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        {/* ─── STEP 1: Select Amount ─── */}
        {step === "select" && (
          <div className="animate-fade-in space-y-6">
            <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white">Choose an amount</h2>
              <p className="mt-1 text-xs text-zinc-500">Select a denomination or enter a custom amount.</p>

              <div className="mt-6 grid grid-cols-3 sm:grid-cols-5 gap-3">
                {DENOMINATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => { setAmount(d); setCustomAmount(""); }}
                    className={`rounded-xl border py-4 text-center transition-all ${
                      amount === d && !customAmount
                        ? "border-[var(--gold)] bg-[var(--gold)]/10 shadow-lg shadow-[var(--gold)]/5"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <p className={`text-lg font-bold ${amount === d && !customAmount ? "text-[var(--gold)]" : "text-white"}`}>
                      {formatPrice(d)}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Custom amount (Rs.)</label>
                <input
                  type="number"
                  min={500}
                  max={100000}
                  step={500}
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors"
                />
              </div>

              {selectedAmount >= 500 && (
                <div className="mt-6 rounded-xl bg-[var(--gold)]/5 border border-[var(--gold)]/10 p-4 flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-[var(--gold)]" />
                  <div>
                    <p className="text-xs text-zinc-400">Gift card value</p>
                    <p className="text-lg font-bold text-[var(--gold)]">{formatPrice(selectedAmount)}</p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setStep("details")}
              disabled={selectedAmount < 500}
              className="w-full rounded-full bg-[var(--gold)] py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* ─── STEP 2: Details ─── */}
        {step === "details" && (
          <div className="animate-fade-in space-y-6">
            <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Recipient details</h2>
                <span className="rounded-full bg-[var(--gold)]/10 px-3 py-1 text-xs font-bold text-[var(--gold)]">{formatPrice(selectedAmount)}</span>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Recipient name</label>
                <input
                  type="text"
                  placeholder="Who is this for?"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Recipient email</label>
                <input
                  type="email"
                  placeholder="their-email@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Your name</label>
                <input
                  type="text"
                  placeholder="From..."
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Personal message (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Write something nice..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("select")}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep("confirm")}
                disabled={!recipientName.trim() || !recipientEmail.trim() || !senderName.trim()}
                className="flex-1 rounded-full bg-[var(--gold)] py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Review order
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Confirm ─── */}
        {step === "confirm" && (
          <div className="animate-fade-in space-y-6">
            <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold text-white">Review your gift card</h2>

              {/* Gift card preview */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[var(--gold)] via-[var(--gold-dim)] to-[#8b6914] p-6 text-black">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute right-4 bottom-0 h-20 w-20 rounded-full bg-white/5 translate-y-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">ShopNest Gift Card</span>
                  </div>
                  <p className="mt-4 text-3xl font-black">{formatPrice(selectedAmount)}</p>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="opacity-60 font-medium">To</p>
                      <p className="font-bold">{recipientName}</p>
                    </div>
                    <div>
                      <p className="opacity-60 font-medium">From</p>
                      <p className="font-bold">{senderName}</p>
                    </div>
                  </div>
                  {message && (
                    <p className="mt-3 text-xs italic opacity-80">&ldquo;{message}&rdquo;</p>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Recipient</span>
                  <span className="text-white font-medium">{recipientName} ({recipientEmail})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Amount</span>
                  <span className="text-[var(--gold)] font-bold">{formatPrice(selectedAmount)}</span>
                </div>
                <div className="border-t border-white/5 pt-3 flex justify-between">
                  <span className="text-zinc-400">Total</span>
                  <span className="text-lg font-bold text-white">{formatPrice(selectedAmount)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--gold)]/10 bg-[var(--gold)]/5 p-4 text-xs text-zinc-400">
              This is a demo — no payment will be processed. Clicking &ldquo;Purchase&rdquo; will generate a sample gift card code.
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("details")}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={handlePurchase}
                disabled={sending}
                className="flex-1 rounded-full bg-[var(--gold)] py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors disabled:opacity-50"
              >
                {sending ? "Sending..." : "Purchase gift card"}
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 4: Success ─── */}
        {step === "success" && (
          <div className="animate-fade-in space-y-6">
            <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-6 sm:p-8 text-center space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Gift card sent!</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  A {formatPrice(selectedAmount)} gift card has been sent to {recipientEmail}.
                </p>
                {emailSent && (
                  <p className="mt-1 text-xs text-emerald-500">Email delivered successfully.</p>
                )}
                {!emailSent && (
                  <p className="mt-1 text-xs text-zinc-500">Email could not be sent — share the code manually.</p>
                )}
              </div>

              {/* Generated code */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Gift card code</p>
                <p className="text-2xl font-black tracking-widest text-[var(--gold)] font-mono">{giftCode}</p>
                <p className="mt-3 text-xs text-zinc-500">Share this code with the recipient or use it at checkout.</p>
              </div>

              <div className="rounded-xl bg-[var(--gold)]/5 border border-[var(--gold)]/10 p-4 text-xs text-zinc-400">
                In a real store, this code would be redeemable at checkout for {formatPrice(selectedAmount)} off any order.
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={reset}
                className="flex-1 rounded-full border border-white/10 bg-white/5 py-3.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-colors"
              >
                Send another
              </button>
              <Link
                href="/products"
                className="flex-1 rounded-full bg-[var(--gold)] py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors text-center"
              >
                Browse products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
