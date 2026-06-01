import sql from "@/app/api/utils/sql";
import argon2 from "argon2";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return Response.json(
        { error: "Token and password are required" },
        { status: 400 },
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Find a valid, unused, non-expired token
    const tokens = await sql`
      SELECT prt.*, au.id AS uid, au.email
      FROM password_reset_tokens prt
      JOIN auth_users au ON prt.user_id = au.id
      WHERE prt.token = ${token}
        AND prt.used = false
        AND prt.expires_at > NOW()
      LIMIT 1
    `;

    if (tokens.length === 0) {
      return Response.json(
        {
          error:
            "This reset link is invalid or has expired. Please request a new one.",
        },
        { status: 400 },
      );
    }

    const { uid } = tokens[0];

    // Hash the new password using argon2 (consistent with platform auth)
    const hashedPassword = await argon2.hash(password);

    // Update password and mark token used — atomically
    await sql.transaction([
      sql`
        UPDATE auth_accounts
        SET password = ${hashedPassword}
        WHERE "userId" = ${uid} AND type = 'credentials'
      `,
      sql`
        UPDATE password_reset_tokens
        SET used = true
        WHERE token = ${token}
      `,
    ]);

    return Response.json({
      message: "Password reset successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("[reset-password] Error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
