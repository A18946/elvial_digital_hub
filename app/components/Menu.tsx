"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

type MenuItem = {
  id: string;
  attributes: {
    title: string;
    url: string;
    parent: string;
    weight: number;
    enabled: boolean;
  };
  children?: MenuItem[];
};

export default function Menu() {
  const [open, setOpen] = useState(false);
  const [tree, setTree] = useState<MenuItem[]>([]);
  const { lang } = useLanguage();

  const linksMap = {
    "hinged systems": "/page/hinged-systems",
    "sliding systems": "/page/sliding-systems",
    "folding doors": "/page/folding-doors",
    "entrance doors": "/page/entrance-doors",
    "facades systems": "/page/facades",
    "outdoor systems": "/page/outdoor",
    "sun shading systems": "/page/sun-shading",
    "various": "/page/various",
    "digital services": "/page/digital-services",
  };

  // ✅ BUILD TREE (NEW)
 function buildTree(items) {
  const map = {};
  const roots = [];

  items.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  items.forEach((item) => {
    const parent = item.attributes.parent;

    if (!parent || parent === "") {
      roots.push(map[item.id]);
    } else {
      if (map[parent]) {
        map[parent].children.push(map[item.id]);
      }
    }
  });

  return roots;
}


  // ✅ FETCH
  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch("/api/menu");
        const json = await res.json();

        const data = json.data || [];

        console.log("✅ RAW menu:", data);

        const built = buildTree(data);

        console.log("🌳 TREE:", built);

        setTree(built);
      } catch (e) {
        console.error("❌ Menu fetch error:", e);
      }
    }

    fetchMenu();
  }, [lang]);

  // ✅ FIX URL
  const fixUrl = (url: string) => {
    if (!url) return "#";
    if (url.startsWith("http")) return url;
    return url.startsWith("/") ? url : `/${url}`;
  };

  // ✅ RECURSIVE RENDER (NEW)
  function renderMenu(items: MenuItem[]) {
    return (
      <div>
        {items.map((item) => {
          const isExternal = item.attributes.url?.startsWith("http");
          
        const titleKey = item.attributes.title?.toLowerCase().trim();

        const href = linksMap[titleKey] || fixUrl(item.attributes.url);


          return (
            <div key={item.id} style={{ marginBottom: 15 }}>
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                style={{ textDecoration: "none", color: "black" }}
              >
                <strong>{item.attributes.title}</strong>
              </a>

              {item.children && item.children.length > 0 && (
                <div style={{ marginLeft: 15, marginTop: 5 }}>
                  {renderMenu(item.children)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          padding: 10,
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <a href="/">{lang === "en" ? "Home" : "Αρχική"}</a>
        <span>|</span>
        <button onClick={() => setOpen(true)}>
          {lang === "en" ? "Menu" : "Μενού"}
        </button>
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "350px",
            height: "100vh",
            background: "#fff",
            padding: "30px 25px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "5px 0 15px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* ✅ FULL TREE */}
          {renderMenu(tree)}
        </div>
      )}
    </>
  );
}
