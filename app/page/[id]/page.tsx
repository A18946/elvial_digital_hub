import React from "react";

// ✅ helper για να πάρουμε image από media
async function getImageFromMedia(uuid: string) {
  const res = await fetch(
    `https://darkcyan-koala-320694.hostingersite.com/jsonapi/media/image/${uuid}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const json = await res.json();

  const fileRel =
    json.data.relationships?.field_media_image?.data;

  if (!fileRel) return null;

  const fileRes = await fetch(
    `https://darkcyan-koala-320694.hostingersite.com/jsonapi/file/file/${fileRel.id}`,
    { cache: "no-store" }
  );

  const fileJson = await fileRes.json();

  return (
    "https://darkcyan-koala-320694.hostingersite.com" +
    fileJson.data.attributes.uri.url
  );
}

// ✅ existing fetch (ΔΕΝ το αλλάζουμε)
async function getCategoryData(category: string) {
  const res = await fetch(
    `https://darkcyan-koala-320694.hostingersite.com/api/${category}`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];

  return res.json();
}

export default async function Page({ params }: any) {
  const { id } = await params;

  const data = await getCategoryData(id);

  // ✅ κάνουμε async map σωστά
  const items = await Promise.all(
    data.map(async (item: any, i: number) => {
      const title = item.title?.[0]?.value;
      const uuid = item.uuid?.[0]?.value;

      // ✅ ΣΩΣΤΟ FIELD (διορθώσαμε μόνο αυτό)
      const mediaUUID = item.field__image?.[0]?.target_uuid;

      let image = null;

      if (mediaUUID) {
        image = await getImageFromMedia(mediaUUID);
      }

      return {
        id: i,
        title,
        uuid,
        image,
      };
    })
  );

  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ marginBottom: 30 }}>
        {id.replaceAll("-", " ")}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "30px",
        }}
      >
        {items.map((item) => (
          <a href={`/node/${item.uuid}`} key={item.id}>
            <div
              style={{
                
                
                overflow: "hidden",
                
                
              }}
            >
              {/* ✅ IMAGE */}
              {item.image && (
                <img src={item.image} style={{ width: "50%" }} />
              )}

              {/* ✅ TITLE (όπως είχες) */}
              <div style={{ padding: 15 }}>
                <h3 style={{ margin: 0 }}>{item.title}</h3>
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
