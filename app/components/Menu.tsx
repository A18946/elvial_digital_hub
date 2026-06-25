"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

type MenuItem = {
  id: string;
  attributes: {
    title: string;
    url: string;
    weight: number;
    enabled: boolean;
  };
  relationships?: {
    parent?: {
      data?: {
        id: string;
      } | null;
    };
  };
};

export default function Menu() {
  const [open, setOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { lang } = useLanguage();

  // Fetch μενού όταν αλλάζει η γλώσσα
  
useEffect(() => {
  async function fetchMenu() {
    try {
      console.log("🔵 Fetching menu for lang:", lang);

      const res = await fetch(
        `https://darkcyan-koala-320694.hostingersite.com/${lang}/jsonapi/menu_items/main`,
        { cache: "no-store" }
      );

      console.log("🟡 Response status:", res.status);

      if (!res.ok) {
        console.log("🔴 Using fallback URL");

        const fallback = await fetch(
          `/api/menu`
        );

        const json = await fallback.json();
        console.log("🟣 Fallback data:", json);

        setMenuItems(json.data || []);
        return;
      }

      const json = await res.json();
      console.log("🟢 Menu data:", json);

      setMenuItems(json.data || []);
    } catch (e) {
      console.error("❌ Menu fetch error:", e);
    }
  }


    fetchMenu();
  }, [lang]); // ← ξανατρέχει όταν αλλάζει γλώσσα

  const enabled = menuItems.filter((i) => i.attributes.enabled);

  const topLevel = enabled
    .filter((i) => !i.relationships?.parent?.data)
    .sort((a, b) => a.attributes.weight - b.attributes.weight);
  console.log("✅ topLevel:", topLevel);
  const getChildren = (parentId: string) =>
    enabled
      .filter((i) => i.relationships?.parent?.data?.id === parentId)
      .sort((a, b) => a.attributes.weight - b.attributes.weight);

  const fixUrl = (url: string) => {
    if (!url || url === "") return "#";
    if (url.startsWith("http")) return url;
    return url;
  };
  console.log("✅ menuItems:", menuItems);
  return (
    <>
      <div style={{ padding: 10, borderBottom: "1px solid #ddd", display: "flex", alignItems: "center", gap: 10 }}>
        <a href="/">{lang === "en" ? "Home" : "Αρχική"}</a>
        <span>|</span>
        <button onClick={() => setOpen(true)}>{lang === "en" ? "Menu" : "Μενού"}</button>
      </div>

      {open && (
        <div style={{
          position: "fixed", top: 0, left: 0,
          width: "350px", height: "100vh",
          background: "#fff", padding: "30px 25px",
          overflowY: "auto", zIndex: 1000,
          boxShadow: "5px 0 15px rgba(0,0,0,0.2)",
        }}>
          <div style={{ marginBottom: 20 }}>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {topLevel.map((item) => {
            const children = getChildren(item.id);
            const isExternal = item.attributes.url?.startsWith("http");
            const href = fixUrl(item.attributes.url);

            return (
              <div key={item.id} style={{ marginBottom: 20 }}>
                <h2 style={{ fontWeight: "bold", marginBottom: 8 }}>
                  <a
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {item.attributes.title}
                  </a>
                </h2>

                {children.length > 0 && (
                  <div style={{ marginLeft: 10, lineHeight: "2" }}>
                    {children.map((child) => {
                      const childExternal = child.attributes.url?.startsWith("http");
                      const childHref = fixUrl(child.attributes.url);
                      return (
                        <div key={child.id}>
                          <a
                            href={childHref}
                            target={childExternal ? "_blank" : undefined}
                            rel={childExternal ? "noopener noreferrer" : undefined}
                            style={{ textDecoration: "none", color: "#333" }}
                          >
                            {child.attributes.title}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}