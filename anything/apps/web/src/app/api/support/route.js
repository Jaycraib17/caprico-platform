import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { sendEmail } from "@/app/api/utils/send-email";

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const [user] = await sql(`SELECT is_admin FROM auth_users WHERE id = $1`, [
      session.user.id,
    ]);

    let tickets;
    if (user?.is_admin) {
      // Admin sees all tickets
      tickets = await sql(
        `SELECT st.*, 
                au.email as user_email, 
                au.first_name,
                au.last_name,
                sp.service_name,
                sp.price as purchase_price
         FROM support_tickets st
         JOIN auth_users au ON st.user_id = au.id
         LEFT JOIN service_purchases sp ON st.purchase_id = sp.id
         ORDER BY 
           CASE st.priority 
             WHEN 'urgent' THEN 1
             WHEN 'high' THEN 2
             WHEN 'normal' THEN 3
             WHEN 'low' THEN 4
           END,
           st.created_at DESC`,
      );
    } else {
      // Regular users see only their tickets
      tickets = await sql(
        `SELECT st.*,
                sp.service_name,
                sp.price as purchase_price
         FROM support_tickets st
         LEFT JOIN service_purchases sp ON st.purchase_id = sp.id
         WHERE st.user_id = $1
         ORDER BY st.created_at DESC`,
        [session.user.id],
      );
    }

    return Response.json({ tickets });
  } catch (error) {
    console.error("Failed to fetch support tickets:", error);
    return Response.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subject, message, purchaseId, priority = "normal" } = body;

    if (!subject || !message) {
      return Response.json(
        { error: "Subject and message are required" },
        { status: 400 },
      );
    }

    // Get user email
    const [user] = await sql(
      `SELECT email, first_name FROM auth_users WHERE id = $1`,
      [session.user.id],
    );

    const [ticket] = await sql(
      `INSERT INTO support_tickets (
        user_id,
        purchase_id,
        subject,
        message,
        priority,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [session.user.id, purchaseId || null, subject, message, priority, "open"],
    );

    // Send notification email to support team
    try {
      await sendEmail({
        to: process.env.SUPPORT_EMAIL || "support@capriremote.com",
        subject: `New Support Ticket: ${subject}`,
        html: `
          <h2>New Support Ticket #${ticket.id}</h2>
          <p><strong>From:</strong> ${user.first_name || "User"} (${user.email})</p>
          <p><strong>Priority:</strong> ${priority}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          ${purchaseId ? `<p><strong>Related Purchase ID:</strong> ${purchaseId}</p>` : ""}
        `,
      });
    } catch (emailError) {
      console.error("Failed to send support notification:", emailError);
    }

    return Response.json({ ticket }, { status: 201 });
  } catch (error) {
    console.error("Failed to create support ticket:", error);
    return Response.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
