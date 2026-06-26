export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";
  const category = searchParams.get("category") || "";

  const res = await fetch(
    `https://darkcyan-koala-320694.hostingersite.com/${lang}/api/${category}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const fallback = await fetch(
      `https://darkcyan-koala-320694.hostingersite.com/api/${category}`,
      { cache: "no-store" }
    );
    if (!fallback.ok) return Response.json([]);
    const data = await fallback.json();
    return Response.json(data);
  }

  const data = await res.json();
  return Response.json(data);
}