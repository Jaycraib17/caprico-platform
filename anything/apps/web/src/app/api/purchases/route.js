import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { sendEmail } from "@/app/api/utils/send-email";

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const purchases = await sql(
      `SELECT 
        id,
        service_id,
        service_name,
        price,
        status,
        purchased_at,
        created_at
      FROM service_purchases
      WHERE user_id = $1
      ORDER BY purchased_at DESC`,
      [session.user.id],
    );

    return Response.json({ purchases });
  } catch (error) {
    console.error("Failed to fetch purchases:", error);
    return Response.json(
      { error: "Failed to fetch purchases" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { serviceId, serviceName, price, revenueCatTransactionId } = body;

    if (!serviceId || !serviceName || !price) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get user email
    const [user] = await sql(
      `SELECT email, first_name FROM auth_users WHERE id = $1`,
      [session.user.id],
    );

    const [purchase] = await sql(
      `INSERT INTO service_purchases (
        user_id,
        service_id,
        service_name,
        price,
        revenue_cat_transaction_id,
        status,
        customer_email
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        session.user.id,
        serviceId,
        serviceName,
        price,
        revenueCatTransactionId,
        "completed",
        user.email,
      ],
    );

    // Send purchase confirmation email
    try {
      await sendEmail({
        to: user.email,
        subject: "Purchase Confirmed - Capri Remote",
        html: `
          <h2>Thank you for your purchase! 🎉</h2>
          <p>Hi ${user.first_name || "there"},</p>
          <p>We've successfully received your purchase:</p>
          <p><strong>${serviceName}</strong> - $${price}</p>
          <p>Our team will reach out to you within 24 hours with detailed instructions and next steps.</p>
          <p>You can view your purchase history anytime in the app under the "Purchases" tab.</p>
          <p>If you have any questions in the meantime, feel free to reach out through the Support section.</p>
          <p>Best regards,<br/>The Capri Remote Team</p>
        `,
      });

      // Log email notification
      await sql(
        `INSERT INTO email_notifications (user_id, purchase_id, email_type, recipient_email, subject, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          session.user.id,
          purchase.id,
          "purchase_confirmation",
          user.email,
          "Purchase Confirmed - Capri Remote",
          "sent",
        ],
      );
    } catch (emailError) {
      console.error("Failed to send purchase confirmation email:", emailError);
      // Log failed email
      await sql(
        `INSERT INTO email_notifications (user_id, purchase_id, email_type, recipient_email, subject, status, error_message)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          session.user.id,
          purchase.id,
          "purchase_confirmation",
          user.email,
          "Purchase Confirmed - Capri Remote",
          "failed",
          emailError.message,
        ],
      );
    }

    return Response.json({ purchase }, { status: 201 });
  } catch (error) {
    console.error("Failed to create purchase record:", error);
    return Response.json(
      { error: "Failed to create purchase record" },
      { status: 500 },
    );
  }
}
