import React from "react";

async function getImageFromMedia(uuid: string) {
  const res = await fetch(
    `https://darkcyan-koala-320694.hostingersite.com/jsonapi/media/image/${uuid}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  const json = await res.json();
  const fileRel = json.data.relationships?.field_media_image?.data;
  if (!fileRel) return null;
  const fileRes = await fetch(
    `https://darkcyan-koala-320694.hostingersite.com/jsonapi/file/file/${fileRel.id}`,
    { cache: "no-store" }
  );
  const fileJson = await fileRes.json();
  return "https://darkcyan-koala-320694.hostingersite.com" + fileJson.data.attributes.uri.url;
}

async function getProduct(uuid: string) {
  const res = await fetch(
    `https://darkcyan-koala-320694.hostingersite.com/jsonapi/node/product/${uuid}?include=field_category,field_tag,field_download_file,field_bim,field_description,field_description.field_attributes,field_template,field__image`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}
// Πρόσθεσε αυτή τη function πριν το export default
function fixBodyLinks(html: string): string {
  // 1. js-flipbook-link: αντικατάσταση href="#" με το data-href-en
  let fixed = html.replace(
    /class="js-flipbook-link"[^>]*href="#"[^>]*data-href-el="([^"]*)"[^>]*data-href-en="([^"]*)"/g,
    (match, el, en) => {
      const href = en.replace("/pdf-proxy/", "/flipbook/");
      return `href="${href}" target="_blank"`;
    }
  );

  // Αν το data-href-en έρχεται πριν το data-href-el
  fixed = fixed.replace(
    /class="js-flipbook-link"[^>]*href="#"[^>]*data-href-en="([^"]*)"[^>]*data-href-el="([^"]*)"/g,
    (match, en, el) => {
      const href = en.replace("/pdf-proxy/", "/flipbook/");
      return `href="${href}" target="_blank"`;
    }
  );

  // 2. PDF links: /sites/default/files/ → full Drupal URL
  fixed = fixed.replace(
    /href="\/sites\/default\/files\//g,
    `href="https://darkcyan-koala-320694.hostingersite.com/sites/default/files/`
  );

  // 3. Relative pdf-proxy links
  fixed = fixed.replace(
    /href="\/pdf-proxy\//g,
    'href="/flipbook/'
  );

  return fixed;
}
async function getDownloads(nodeUuid: string) {
  const res = await fetch(
    `https://darkcyan-koala-320694.hostingersite.com/jsonapi/node/product/${nodeUuid}/field_template`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const json = await res.json();
  
  // Τα template refs έχουν μόνο id/type, κάνουμε fetch κάθε ένα ξεχωριστά
  const templateRefs = json.data || [];
  
  const templates = await Promise.all(
    templateRefs.map(async (ref: any) => {
      const tRes = await fetch(
        `https://darkcyan-koala-320694.hostingersite.com/jsonapi/node/template/${ref.id}`,
        { cache: "no-store" }
      );
      if (!tRes.ok) return null;
      const tJson = await tRes.json();
      return tJson.data;
    })
  );
  
  return templates.filter(Boolean);
}


export default async function Page({ params }: any) {
  const { id } = await params;
  const json = await getProduct(id);
  if (!json) return <div>Not found</div>;

  const product = json.data;
  const included = json.included || [];
  const attr = product.attributes;
  const rel = product.relationships;
  // BIM FILES
const bimRefs = rel?.field_bim?.data || [];

console.log(
  "FIELD BIM:",
  JSON.stringify(bimRefs, null, 2)
);

const bimTemplates = bimRefs
  .map((ref: any) =>
    included.find((i: any) => i.id === ref.id)
  )
  .filter(Boolean);

console.log(
  "BIM TEMPLATES:",
  JSON.stringify(bimTemplates, null, 2)
);

  // IMAGE
  // IMAGE - ίδιο pattern με category page
  // IMAGE - είναι array, παίρνουμε το πρώτο
  const imageMediaUUID = rel?.field__image?.data?.[0]?.id;
  const imageUrl = imageMediaUUID ? await getImageFromMedia(imageMediaUUID) : null;

  // CATEGORY & TAG
  const categoryId = rel?.field_category?.data?.id;
  const category = included.find((i: any) => i.id === categoryId);
  const categoryName = category?.attributes?.name || "";

  const tagId = rel?.field_tag?.data?.id;
  const tag = included.find((i: any) => i.id === tagId);
  const tagName = tag?.attributes?.name || "";

  // DOWNLOAD FILE
  const downloadFileId = rel?.field_download_file?.data?.id;
  const downloadFile = included.find((i: any) => i.id === downloadFileId);
  const downloadUrl = downloadFile
    ? "https://darkcyan-koala-320694.hostingersite.com" + downloadFile.attributes.uri.url
    : null;
  
  // SPECIFICATIONS
  const descRefs = rel?.field_description?.data || [];
  const descParagraphs = descRefs
    .map((ref: any) => included.find((i: any) => i.id === ref.id))
    .filter(Boolean);

  const specs = await Promise.all(
    descParagraphs.map(async (p: any) => {
      const attrRefs = p.relationships?.field_attributes?.data || [];
      const attrNames = await Promise.all(
        attrRefs.map(async (ref: any) => {
          const fromIncluded = included.find((i: any) => i.id === ref.id);
          if (fromIncluded) return fromIncluded.attributes?.name || "";
          const termRes = await fetch(
            `https://darkcyan-koala-320694.hostingersite.com/jsonapi/taxonomy_term/product_attributes/${ref.id}`,
            { cache: "no-store" }
          );
          if (!termRes.ok) return "";
          const termJson = await termRes.json();
          return termJson.data?.attributes?.name || "";
        })
      );
      const values = (p.attributes?.field_value || []).join(", ");
      return { label: attrNames.filter(Boolean).join(", "), value: values };
    })
  );
  const filteredSpecs = specs.filter((s) => s.label || s.value);
  console.log("=== BIM TEST START ===");
  // DOWNLOADS
  const downloadsData = await getDownloads(id);
  
  
const bimData = await getBimFiles(id);

console.log("=== BIM DATA ===");
console.log(JSON.stringify(bimData));

console.log(
  "BIM DATA:",
  JSON.stringify(bimData, null, 2)
);

console.log(
  "FIRST BIM:",
  JSON.stringify(bimData[0], null, 2)
);


const bimBody = bimTemplates
  .map((n: any) =>
    n.attributes?.body?.processed ||
    n.attributes?.body?.value ||
    ""
  )
  .filter(Boolean)
  .join("");

console.log("BIM BODY:", bimBody);

  const downloadsBody = downloadsData
    .map((n: any) => n.attributes?.body?.processed || n.attributes?.body?.value || "")
    .filter(Boolean)
    .join("");
  
  return (
    <main style={{ padding: 40, maxWidth: 900 }}>
      {/* Product Title */}
      <h1>{attr.title}</h1>

      {/* Image Section */}
      {imageUrl && (
        <div style={{ marginBottom: 30 }}>
          <img
            src={imageUrl}
            alt={attr.title}
            style={{ 
              maxWidth: "50%", 
              height: "auto", 
              display: "block",
              borderRadius: "8px"
            }}
          />
        </div>
      )}

      {/* Product Info Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 30 }}>
        <tbody>
          {categoryName && (
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px 16px", fontWeight: "bold", width: "35%" }}>Category</td>
              <td style={{ padding: "12px 16px" }}>{categoryName}</td>
            </tr>
          )}
          {tagName && (
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px 16px", fontWeight: "bold" }}>Tag</td>
              <td style={{ padding: "12px 16px" }}>{tagName}</td>
            </tr>
          )}
          {downloadUrl && (
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px 16px", fontWeight: "bold" }}>Download File</td>
              <td style={{ padding: "12px 16px" }}>
                <a 
                  href={downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: "#007bff", textDecoration: "none" }}
                >
                  Download
                </a>
              </td>
            </tr>
          )}
          
        </tbody>
      </table>

      {/* Specifications Section */}
      {filteredSpecs.length > 0 && (
        <div style={{ marginBottom: 30 }}>
          <h2 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>Description</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {filteredSpecs.map((spec, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px 16px", fontWeight: "bold", width: "35%" }}>
                    {spec.label}
                  </td>
                  <td style={{ padding: "12px 16px" }}>{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Downloads Section */}
      {downloadsBody && (
  <div style={{ marginBottom: 30 }}>
    <h2 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>Downloads</h2>
    <div dangerouslySetInnerHTML={{ __html: fixBodyLinks(downloadsBody) }} />
  </div>
)}
      {/* BIM Section */}
      {bimBody && (
        <div style={{ marginBottom: 30 }}>
          <h2 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>BIM</h2>
          <div dangerouslySetInnerHTML={{ __html: fixBodyLinks(bimBody) }} />
        </div>
      )}
    </main>
  );
}