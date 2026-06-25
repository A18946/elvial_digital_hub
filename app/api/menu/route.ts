export async function GET() {
  try {
    console.log("👉 CALLING DRUPAL");

    const res = await fetch(
      "https://darkcyan-koala-320694.hostingersite.com/jsonapi/menu_items/main"
    );

    console.log("👉 STATUS:", res.status);

    const text = await res.text();
    console.log("👉 RAW RESPONSE:", text);

    return new Response(text, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("🔥 ERROR:", e);

    return Response.json({ error: "fetch failed" }, { status: 500 });
  }
}