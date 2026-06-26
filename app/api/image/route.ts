export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get("uuid") || "";

  const res = await fetch(
    `https://darkcyan-koala-320694.hostingersite.com/jsonapi/media/image/${uuid}`,
    { cache: "no-store" }
  );
  if (!res.ok) return Response.json({ url: null });

  const json = await res.json();
  const fileRel = json.data.relationships?.field_media_image?.data;
  if (!fileRel) return Response.json({ url: null });

  const fileRes = await fetch(
    `https://darkcyan-koala-320694.hostingersite.com/jsonapi/file/file/${fileRel.id}`,
    { cache: "no-store" }
  );
  const fileJson = await fileRes.json();
  const url = "https://darkcyan-koala-320694.hostingersite.com" + fileJson.data.attributes.uri.url;

  return Response.json({ url });
}