import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    // Graceful skip when not configured
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const checkoutSession = event.data.object as import("stripe").Stripe.Checkout.Session;
      const userId = checkoutSession.metadata?.userId;

      if (userId) {
        await db.purchase.create({
          data: {
            userId,
            stripePaymentIntentId:
              typeof checkoutSession.payment_intent === "string"
                ? checkoutSession.payment_intent
                : (checkoutSession.payment_intent?.id ?? null),
            amount: checkoutSession.amount_total ?? 900,
            currency: checkoutSession.currency ?? "usd",
            status: "completed",
          },
        });

        await db.user.update({
          where: { id: userId },
          data: { isPro: true },
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 400 });
  }
}
