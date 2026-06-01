// Debug endpoint disabled in production for security.
export async function GET() {
  return Response.json({ error: "Not found" }, { status: 404 });
}
