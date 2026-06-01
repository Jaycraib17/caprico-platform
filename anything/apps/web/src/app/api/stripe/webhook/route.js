import sql from "@/app/api/utils/sql";

// Stripe webhook handler
export async function POST(request) {
  try {
    const body = await request.text();

    // In production, verify webhook signature:
    // const sig = request.headers.get('stripe-signature');
    // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    const event = JSON.parse(body);

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionCanceled(event.data.object);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: "Webhook failed" }, { status: 500 });
  }
}

async function handleSubscriptionUpdate(subscription) {
  const userId = subscription.metadata?.user_id;
  if (!userId) return;

  const isActive = ["active", "trialing"].includes(subscription.status);
  const expiresAt = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;

  await sql`
    UPDATE auth_users
    SET 
      is_premium = ${isActive},
      premium_expires_at = ${expiresAt},
      stripe_id = ${subscription.customer},
      subscription_status = ${subscription.status},
      last_check_subscription_status_at = NOW(),
      updated_at = NOW()
    WHERE id = ${userId}
  `;
}

async function handleSubscriptionCanceled(subscription) {
  const userId = subscription.metadata?.user_id;
  if (!userId) return;

  await sql`
    UPDATE auth_users
    SET 
      is_premium = false,
      subscription_status = 'canceled',
      last_check_subscription_status_at = NOW(),
      updated_at = NOW()
    WHERE id = ${userId}
  `;
}

async function handlePaymentSucceeded(invoice) {
  const customerId = invoice.customer;

  await sql`
    UPDATE auth_users
    SET last_check_subscription_status_at = NOW()
    WHERE stripe_id = ${customerId}
  `;
}

async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer;

  await sql`
    UPDATE auth_users
    SET subscription_status = 'past_due',
        last_check_subscription_status_at = NOW()
    WHERE stripe_id = ${customerId}
  `;
}
