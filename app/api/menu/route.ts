export async function GET() {
  try {
    const res = await fetch(
      "https://darkcyan-koala-320694.hostingersite.com/jsonapi/menu_items/main"
    );

    const data = await res.json();

    return Response.json(data);
  } catch (e) {
    return Response.json({ error: "fetch failed" }, { status: 500 });
  }
}