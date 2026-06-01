import sql from "@/app/api/utils/sql";
import { sendEmail } from "@/app/api/utils/send-email";

export async function POST(request) {
  try {
    const body = await request.json();
    const { event } = body;

    if (!event) {
      return Response.json(
        { error: "Invalid webhook payload" },
        { status: 400 },
      );
    }

    const eventType = event.type;
    const productId = event.product_id;
    const transactionId = event.id;
    const appUserId = event.app_user_id;

    console.log(`RevenueCat webhook: ${eventType} for ${productId}`);

    // Handle refund events
    if (eventType === "CANCELLATION" || eventType === "REFUND") {
      // Find the purchase by transaction ID
      const [purchase] = await sql(
        `SELECT sp.*, au.email 
         FROM service_purchases sp
         JOIN auth_users au ON sp.user_id = au.id
         WHERE sp.revenue_cat_transaction_id = $1`,
        [transactionId],
      );

      if (purchase) {
        // Update purchase status to refunded
        await sql(
          `UPDATE service_purchases 
           SET status = 'refunded',
               refund_date = NOW(),
               refund_reason = $1,
               updated_at = NOW()
           WHERE id = $2`,
          [
            eventType === "CANCELLATION" ? "User cancelled" : "Refund issued",
            purchase.id,
          ],
        );

        // Send refund notification email
        try {
          await sendEmail({
            to: purchase.email,
            subject: "Refund Processed - Capri Remote",
            html: `
              <h2>Your refund has been processed</h2>
              <p>Hi there,</p>
              <p>We've processed your refund for <strong>${purchase.service_name}</strong> ($${purchase.price}).</p>
              <p>The refund should appear in your account within 5-10 business days.</p>
              <p>If you have any questions, please don't hesitate to reach out.</p>
              <p>Best regards,<br/>The Capri Remote Team</p>
            `,
          });

          // Log email notification
          await sql(
            `INSERT INTO email_notifications (user_id, purchase_id, email_type, recipient_email, subject, status)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              purchase.user_id,
              purchase.id,
              "refund_notification",
              purchase.email,
              "Refund Processed - Capri Remote",
              "sent",
            ],
          );
        } catch (emailError) {
          console.error("Failed to send refund email:", emailError);
        }
      }
    }

    // Handle successful purchase events
    if (
      eventType === "INITIAL_PURCHASE" ||
      eventType === "NON_RENEWING_PURCHASE"
    ) {
      // Find user by app_user_id (should be their user ID)
      const [user] = await sql(`SELECT * FROM auth_users WHERE id = $1`, [
        appUserId,
      ]);

      if (user) {
        // Send purchase confirmation email
        try {
          await sendEmail({
            to: user.email,
            subject: "Purchase Confirmed - Capri Remote",
            html: `
              <h2>Thank you for your purchase! 🎉</h2>
              <p>Hi ${user.first_name || "there"},</p>
              <p>We've received your purchase and will reach out within 24 hours with next steps.</p>
              <p>In the meantime, if you have any questions, feel free to contact us through the Help section in the app.</p>
              <p>Best regards,<br/>The Capri Remote Team</p>
            `,
          });
        } catch (emailError) {
          console.error(
            "Failed to send purchase confirmation email:",
            emailError,
          );
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
