"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

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
  "general manuals": "/page/general-manuals",
  "ανοιγόμενα συστήματα": "/page/hinged-systems",
  "συρόμενα συστήματα": "/page/sliding-systems",
  "φυσσούνες": "/page/folding-doors",
  "είσοδοι": "/page/entrance-doors",
  "υαλοπετάσματα": "/page/facades",
  "λύσεις outdoor": "/page/outdoor",
  "σκίαση": "/page/sun-shading",
  "διάφορα": "/page/various",
  "ψηφιακές υπηρεσίες": "/page/digital-services",
  "γενικά εγχειρίδια": "/page/general-manuals",
};

export default function CategoriesClient({ homeContent }: { homeContent: any }) {
  const { lang } = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setItems([]);
      try {
        const res = await fetch(`/api/categories?lang=${lang}`);
        const categories = await res.json();

        const withImages = await Promise.all(
  categories.map(async (cat: any, i: number) => ({
    id: i,
    name: cat.name,
    image: cat.imageUrl,
  }))
);

        setItems(withImages);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [lang]);

 

  return (
    <main style={{ padding: 20 }}>
      <h1>{homeContent?.title?.[0]?.value || ""}</h1>
      <div dangerouslySetInnerHTML={{ __html: homeContent?.body?.[0]?.value || "" }} />
      <hr />
      {loading && <div>Loading...</div>}  {/* ← μόνο indicator, όχι replace */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "40px" }}>
        {items.map((item) => (
          <a
            key={item.id}
            href={linksMap[item.name?.toLowerCase().trim()] || "#"}
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <div style={{ cursor: "pointer" }}>
              {item.image && (
                <img src={item.image} style={{ width: "30%", display: "block", marginBottom: 10 }} />
              )}
              <h3 style={{ margin: 0 }}>{item.name}</h3>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}