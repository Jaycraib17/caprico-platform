import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { purchaseId, receiptData } = body;

    if (!purchaseId) {
      return Response.json({ error: "Missing purchase ID" }, { status: 400 });
    }

    // Verify the purchase belongs to the user
    const [purchase] = await sql(
      `SELECT * FROM service_purchases WHERE id = $1 AND user_id = $2`,
      [purchaseId, session.user.id],
    );

    if (!purchase) {
      return Response.json({ error: "Purchase not found" }, { status: 404 });
    }

    // In a real implementation, you would verify with RevenueCat API here
    // For now, we'll mark as verified if receipt data is provided
    const verified = !!receiptData;

    const [updatedPurchase] = await sql(
      `UPDATE service_purchases 
       SET receipt_verified = $1, 
           verification_date = $2,
           receipt_data = $3,
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [verified, new Date(), receiptData || null, purchaseId],
    );

    return Response.json({
      verified,
      purchase: updatedPurchase,
    });
  } catch (error) {
    console.error("Failed to verify receipt:", error);
    return Response.json(
      { error: "Failed to verify receipt" },
      { status: 500 },
    );
  }
}
