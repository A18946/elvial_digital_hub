import React from "react";


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

async function getHome() {
  const res = await fetch(
    "https://darkcyan-koala-320694.hostingersite.com/api/home",
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

async function getCategories() {
  const res = await fetch(
    "https://darkcyan-koala-320694.hostingersite.com/api/categories",
    { cache: "no-store" }
  );

  if (!res.ok) return [];
  return res.json();
}


// ✅ PAGE

export default async function Home() {
  const page = await getHome();
  const categories = await getCategories();

  const node = page?.[0];

  const items = await Promise.all(
    categories.map(async (cat: any, i: number) => {
      const name = cat.name?.[0]?.value;
      
      const mediaUUID = 
        cat.field__image?.[0]?.target_uuid ||
        cat.field__image?.[0]?.target_id ||
        cat.field_image?.[0]?.target_uuid ||
        cat.field_image?.[0]?.target_id;

      let image = null;

      if (mediaUUID) {
        image = await getImageFromMedia(mediaUUID);
      }
      
      const products = await getCategories(name);
      const first3 = products.slice(0, 3);
     
      return {
        id: i,
        name,
        image,
        products: first3,
      };
    })
  );

  const linksMap: Record<string, string> = {
    "hinged systems": "/page/hinged-systems",
    "sliding systems": "/page/sliding-systems",
    "folding doors": "/page/folding-doors",
    "entrance systems": "/page/entrance-doors",
    "facades systems": "/page/facades",
    "outdoor systems": "/page/outdoor",
    "sun shading systems": "/page/sun-shading",
    "various systems": "/page/various",
    "digital services": "/page/digital-services",
    
  };

  return (
    <main style={{ padding: 20 }}>
      
      {/* ✅ HOMEPAGE CONTENT */}
      <h1>{node?.title?.[0]?.value || "No title"}</h1>

      <div
        dangerouslySetInnerHTML={{
          __html: node?.body?.[0]?.value || ""
        }}
      />

      <hr />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "40px",
        }}
      >
        {items.map((item) => (
          <a
            key={item.id}
            
  href={linksMap[item.name?.toLowerCase().trim()] || "#"}
  // ✅ FIX
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block"
            }}
          >
            <div style={{ cursor: "pointer" }}>
              
              

              {/* ✅ IMAGE */}
              {item.image && (
                <img src={item.image} style={{ width: "30%", display: "block", marginBottom: 10 }} />
              )}
              <h3 style={{ margin: 0 }}>{item.name}</h3>
              {/* ✅ PRODUCTS GRID */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "10px",
                }}
              >
                {item.products.map((prod: any, i: number) => (
                  <div key={i}>
                    <p style={{ fontSize: 12 }}>
                      {prod.title?.[0]?.value}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </a>
        ))}
      </div>

    </main>
  );
}