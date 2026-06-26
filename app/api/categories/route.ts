export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";

  const url = lang === "el"
    ? "https://darkcyan-koala-320694.hostingersite.com/el/api/categories"
    : "https://darkcyan-koala-320694.hostingersite.com/api/categories";

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return Response.json([]);
  const data = await res.json();

  // Deduplication
  const byTid: Record<string, any> = {};
  data.forEach((cat: any) => {
    const tid = String(cat.tid?.[0]?.value);
    const catLang = cat.langcode?.[0]?.value;
    if (!byTid[tid]) {
      byTid[tid] = cat;
    } else if (catLang === lang) {
      byTid[tid] = cat;
    }
  });

  const unique = Object.values(byTid).sort((a: any, b: any) =>
    (a.weight?.[0]?.value || 0) - (b.weight?.[0]?.value || 0)
  );

  // Φέρε εικόνες server-side (χωρίς CORS)
  const withImages = await Promise.all(
    unique.map(async (cat: any) => {
      const mediaUUID =
        cat.field__image?.[0]?.target_uuid ||
        cat.field__image?.[0]?.target_id ||
        cat.field_image?.[0]?.target_uuid ||
        cat.field_image?.[0]?.target_id;

      let imageUrl = null;

      if (mediaUUID) {
        const imgRes = await fetch(
          `https://darkcyan-koala-320694.hostingersite.com/jsonapi/media/image/${mediaUUID}`,
          { cache: "no-store" }
        );
        if (imgRes.ok) {
          const imgJson = await imgRes.json();
          const fileRel = imgJson.data.relationships?.field_media_image?.data;
          if (fileRel) {
            const fileRes = await fetch(
              `https://darkcyan-koala-320694.hostingersite.com/jsonapi/file/file/${fileRel.id}`,
              { cache: "no-store" }
            );
            const fileJson = await fileRes.json();
            imageUrl = "https://darkcyan-koala-320694.hostingersite.com" + fileJson.data.attributes.uri.url;
          }
        }
      }

      return {
        name: cat.name?.[0]?.value,
        imageUrl,
      };
    })
  );

  return Response.json(withImages);
}