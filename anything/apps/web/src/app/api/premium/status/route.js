import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ is_premium: false });
    }

    const [user] = await sql`
      SELECT is_premium, premium_expires_at
      FROM auth_users
      WHERE id = ${session.user.id}
    `;

    const isPremiumActive =
      user.is_premium &&
      (!user.premium_expires_at ||
        new Date(user.premium_expires_at) > new Date());

    return Response.json({
      is_premium: isPremiumActive,
      expires_at: user.premium_expires_at,
    });
  } catch (error) {
    console.error("Premium status error:", error);
    return Response.json({ is_premium: false });
  }
}
