"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const linksMap: Record<string, string> = {
  "hinged systems": "/en/page/hinged-systems",
  "sliding systems": "/en/page/sliding-systems",
  "folding doors": "/en/page/folding-doors",
  "entrance systems": "/en/page/entrance-doors",
  "facades systems": "/en/page/facades",
  "outdoor systems": "/en/page/outdoor",
  "sun shading systems": "/en/page/sun-shading",
  "various systems": "/en/page/various",
  "digital services": "/en/page/digital-services",
  "general manuals": "/en/page/general-manuals",
  "ανοιγόμενα συστήματα": "/el/page/hinged-systems",
  "συρόμενα συστήματα": "/el/page/sliding-systems",
  "φυσσούνες": "/el/page/folding-doors",
  "είσοδοι": "/el/page/entrance-doors",
  "υαλοπετάσματα": "/el/page/facades",
  "λύσεις outdoor": "/el/page/outdoor",
  "σκίαση": "/el/page/sun-shading",
  "διάφορα": "/el/page/various",
  "ψηφιακές υπηρεσίες": "/el/page/digital-services",
  "γενικά εγχειρίδια": "/el/page/general-manuals",
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