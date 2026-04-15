import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Pricing \u2013 Visible Session Timer",
  description:
    "Free forever for individuals. Upgrade to Pro for unlimited templates, advanced visuals, and cross-device sync.",
};

const freeFeatures = [
  "Unlimited countdown & countup timers",
  "Full-screen display mode",
  "Up to 3 segments per session",
  "1 repeating interval preset",
  "Shareable timer URLs",
  "No account required",
];

const proFeatures = [
  "Everything in Free",
  "Save unlimited timer templates",
  "Up to 10 segments per session",
  "Unlimited repeating rounds",
  "Advanced visual cues & alerts",
  "Multiple color themes",
  "Template duplication & editing",
  "Google login + sync across devices",
  "Priority support",
];

const faqs = [
  {
    q: "Is the free tier really free forever?",
    a: "Yes. No credit card, no trial period, no expiration. The core timer experience is free for as long as you need it.",
  },
  {
    q: "What does the one-time payment include?",
    a: "A single $9 payment unlocks all Pro features permanently \u2014 no subscriptions, no recurring charges.",
  },
  {
    q: "Do I need an account to use the timer?",
    a: "No. You can launch and use the timer right now without signing up. An account is only needed to save templates.",
  },
  {
    q: "How does cross-device sync work?",
    a: "Sign in with Google on any device and your saved templates are instantly available. Changes sync automatically.",
  },
  {
    q: "Can I share timers with others?",
    a: "Yes \u2014 every timer configuration generates a shareable URL. Anyone with the link can open an identical timer, no account needed.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We use Stripe for secure payments and accept all major credit cards, Apple Pay, and Google Pay.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem-5.5rem)] bg-background text-foreground">
      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-4">Pricing</p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter mb-6">
          Simple, honest pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Start free. Upgrade when you need more. One payment, forever.
        </p>
      </section>

      {/* Plans */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Free Tier */}
          <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-8 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Free</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-muted-foreground">/ forever</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Everything you need to run a great timer session \u2014 no signup required.
              </p>
            </div>

            <Button size="lg" variant="outline" asChild className="w-full border-zinc-600 hover:bg-zinc-800">
              <Link href="/timer">Launch Free Timer</Link>
            </Button>

            <ul className="space-y-3">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <CheckIcon />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="rounded-2xl border border-white/20 bg-zinc-900 p-8 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-white text-zinc-900 text-xs font-bold px-4 py-1 rounded-bl-xl rounded-tr-2xl tracking-wide uppercase">
              Most popular
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-1">Pro</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold">$9</span>
                <span className="text-muted-foreground">/ one-time</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Save templates, unlock advanced features, and sync across all your devices.
              </p>
            </div>

            <form action="/api/stripe/checkout" method="POST">
              <Button
                size="lg"
                className="w-full bg-white text-zinc-900 hover:bg-zinc-200 font-semibold"
                type="submit"
              >
                Get Pro \u2014 $9
              </Button>
            </form>

            <ul className="space-y-3">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <CheckIcon filled />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs text-muted-foreground text-center pt-2">
              Secure checkout via Stripe. 30-day money-back guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="border-t border-zinc-800 py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold mb-1">No subscription</p>
            <p className="text-sm text-muted-foreground">Pay once, use forever</p>
          </div>
          <div>
            <p className="text-3xl font-bold mb-1">Instant access</p>
            <p className="text-sm text-muted-foreground">Upgrade unlocks immediately</p>
          </div>
          <div>
            <p className="text-3xl font-bold mb-1">30-day guarantee</p>
            <p className="text-sm text-muted-foreground">Full refund, no questions asked</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map(({ q, a }) => (
            <div key={q} className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-semibold mb-2">{q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a
            href="mailto:shannonkempenich@gmail.com"
            className="text-sm underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Contact support
          </a>
        </div>
      </section>
    </div>
  );
}

function CheckIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={filled ? "w-4 h-4 shrink-0 text-white" : "w-4 h-4 shrink-0 text-zinc-400"}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}
