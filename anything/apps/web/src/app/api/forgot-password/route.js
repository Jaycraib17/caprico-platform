import { randomBytes } from "crypto";
import sql from "@/app/api/utils/sql";
import { sendEmail } from "@/app/api/utils/send-email";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const normalised = email.trim().toLowerCase();

    // Look up user — don't reveal whether email exists (security)
    const users = await sql`
      SELECT id FROM auth_users WHERE email = ${normalised} LIMIT 1
    `;

    if (users.length === 0) {
      // Return success anyway to prevent email enumeration
      return Response.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const user = users[0];

    // Expire any existing unused tokens for this user
    await sql`
      UPDATE password_reset_tokens
      SET used = true
      WHERE user_id = ${user.id} AND used = false
    `;

    // Generate a secure random token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await sql`
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (${user.id}, ${token}, ${expiresAt})
    `;

    const resetUrl = `${process.env.NEXT_PUBLIC_CREATE_APP_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: normalised,
      from: "noreply@capriremote.com",
      subject: "Reset your Capri Remote password",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #FAD6E5;">
          <div style="background: linear-gradient(135deg, #FF2D75, #6A0DAD); padding: 40px 32px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Capri Remote</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Password Reset Request</p>
          </div>
          <div style="padding: 40px 32px;">
            <p style="color: #1A1028; font-size: 16px; margin: 0 0 16px;">Hi there,</p>
            <p style="color: #6B7280; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">
              We received a request to reset your password. Click the button below to choose a new one. This link expires in <strong>1 hour</strong>.
            </p>
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${resetUrl}"
                style="display: inline-block; background: linear-gradient(135deg, #FF2D75, #6A0DAD); color: #fff; text-decoration: none; font-weight: 700; font-size: 16px; padding: 14px 36px; border-radius: 50px; box-shadow: 0 4px 14px rgba(255,45,117,0.35);">
                Reset My Password
              </a>
            </div>
            <p style="color: #9CA3AF; font-size: 13px; line-height: 1.6; margin: 0;">
              If you didn't request this, you can safely ignore this email — your password won't change.<br><br>
              Or copy this link into your browser:<br>
              <span style="color: #6A0DAD; word-break: break-all;">${resetUrl}</span>
            </p>
          </div>
          <div style="background: #FFF5F8; padding: 20px 32px; text-align: center; border-top: 1px solid #FAD6E5;">
            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Capri Remote · <a href="https://capriremote.com/privacy" style="color: #FF2D75; text-decoration: none;">Privacy Policy</a>
            </p>
          </div>
        </div>
      `,
      text: `Reset your Capri Remote password\n\nClick this link to reset your password (expires in 1 hour):\n${resetUrl}\n\nIf you didn't request this, ignore this email.`,
    });

    return Response.json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("[forgot-password] Error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
