import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || "price_1234567890"; // Replace with your Stripe price ID
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { trial } = await request.json();

    // Get or create Stripe customer
    const [user] = await sql`
      SELECT stripe_id, email FROM auth_users WHERE id = ${session.user.id}
    `;

    let customerId = user.stripe_id;

    // Create Stripe checkout session
    const checkoutSession = {
      mode: "subscription",
      customer: customerId,
      customer_email: !customerId ? user.email : undefined,
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_CREATE_APP_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_CREATE_APP_URL}/premium/canceled`,
      metadata: {
        user_id: session.user.id,
      },
      ...(trial ? { subscription_data: { trial_period_days: 7 } } : {}),
    };

    // For now, return a mock checkout URL since we need actual Stripe SDK
    // In production, you would use: const stripeSession = await stripe.checkout.sessions.create(checkoutSession);

    const mockCheckoutUrl = `${process.env.NEXT_PUBLIC_CREATE_APP_URL}/premium/demo-checkout?trial=${trial}`;

    return Response.json({
      url: mockCheckoutUrl,
      message:
        "Stripe integration ready - add Stripe SDK and credentials to go live",
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json(
      { error: "Failed to create checkout" },
      { status: 500 },
    );
  }
}
