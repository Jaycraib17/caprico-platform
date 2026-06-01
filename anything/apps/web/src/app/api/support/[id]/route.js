import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { sendEmail } from "@/app/api/utils/send-email";

export async function PATCH(request, { params }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { status, adminResponse, priority } = body;

    // Check if user is admin for admin actions
    const [user] = await sql(`SELECT is_admin FROM auth_users WHERE id = $1`, [
      session.user.id,
    ]);

    if (
      !user?.is_admin &&
      (adminResponse || status === "resolved" || status === "closed")
    ) {
      return Response.json({ error: "Admin access required" }, { status: 403 });
    }

    // Get ticket with user info
    const [ticket] = await sql(
      `SELECT st.*, au.email, au.first_name
       FROM support_tickets st
       JOIN auth_users au ON st.user_id = au.id
       WHERE st.id = $1`,
      [id],
    );

    if (!ticket) {
      return Response.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Verify user owns ticket or is admin
    if (ticket.user_id !== session.user.id && !user?.is_admin) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Build update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (status) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (priority && user?.is_admin) {
      updates.push(`priority = $${paramCount++}`);
      values.push(priority);
    }

    if (adminResponse) {
      updates.push(`admin_response = $${paramCount++}`, `responded_at = NOW()`);
      values.push(adminResponse);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const [updatedTicket] = await sql(
      `UPDATE support_tickets 
       SET ${updates.join(", ")}
       WHERE id = $${paramCount}
       RETURNING *`,
      values,
    );

    // Send email if admin responded
    if (adminResponse) {
      try {
        await sendEmail({
          to: ticket.email,
          subject: `Update on your support ticket: ${ticket.subject}`,
          html: `
            <h2>Support Team Response</h2>
            <p>Hi ${ticket.first_name || "there"},</p>
            <p>We've responded to your support ticket regarding: <strong>${ticket.subject}</strong></p>
            <p><strong>Our Response:</strong></p>
            <p>${adminResponse}</p>
            <p>If you have any follow-up questions, feel free to create a new ticket in the app.</p>
            <p>Best regards,<br/>The Capri Remote Support Team</p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send response email:", emailError);
      }
    }

    return Response.json({ ticket: updatedTicket });
  } catch (error) {
    console.error("Failed to update ticket:", error);
    return Response.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if user is admin
    const [user] = await sql(`SELECT is_admin FROM auth_users WHERE id = $1`, [
      session.user.id,
    ]);

    if (!user?.is_admin) {
      return Response.json({ error: "Admin access required" }, { status: 403 });
    }

    await sql(`DELETE FROM support_tickets WHERE id = $1`, [id]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete ticket:", error);
    return Response.json({ error: "Failed to delete ticket" }, { status: 500 });
  }
}
