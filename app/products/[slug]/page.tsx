import React from "react";

async function getCategoryData(category: string) {
  const res = await fetch(
    `https://darkcyan-koala-320694.hostingersite.com/api/${category}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function Page({ params }: any) {
  const { category } = await params;

  const data = await getCategoryData(category);

  return (
    <main style={{ padding: 20 }}>
      <h1>{category}</h1>

      {data.length === 0 && <p>No products</p>}

      {data.map((item: any, i: number) => {
        const title = item.title?.[0]?.value;
        const imageUrl =
          item.field_image?.[0]?.url &&
          "https://darkcyan-koala-320694.hostingersite.com" +
            item.field_image[0].url;

        return (
          <div key={i}>
            <h3>{title}</h3>

            {imageUrl && (
              <img src={imageUrl} width="200" />
            )}
          </div>
        );
      })}
    </main>
  );
}
