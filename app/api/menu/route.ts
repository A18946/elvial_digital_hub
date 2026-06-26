export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "en";

    // Δοκίμασε με language prefix στο URL
    const res = await fetch(
      `https://darkcyan-koala-320694.hostingersite.com/${lang}/jsonapi/menu_items/main`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      // Fallback χωρίς prefix
      const fallback = await fetch(
        `https://darkcyan-koala-320694.hostingersite.com/jsonapi/menu_items/main`,
        { cache: "no-store" }
      );
      const data = await fallback.json();
      return Response.json(data);
    }

    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    console.error("API ERROR:", e);
    return Response.json({ data: [] });
  }
}