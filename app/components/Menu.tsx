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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const { lang } = useLanguage();

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("drupal_token");
      const name = localStorage.getItem("drupal_name");

      setIsLoggedIn(!!token);
      setUserName(name || "");
    };

    checkLogin();

    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("drupal_token");
    localStorage.removeItem("drupal_uid");
    localStorage.removeItem("drupal_name");

    setIsLoggedIn(false);
    setUserName("");

    window.location.href = `/${lang}`;
  };

  const linksMap: Record<string, string> = {
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

  function buildTree(items: any[]) {
    const map: Record<string, any> = {};
    const roots: any[] = [];

    items.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });

    items.forEach((item) => {
      const parent = item.attributes.parent;

      if (!parent || parent === "") {
        roots.push(map[item.id]);
      } else if (map[parent]) {
        map[parent].children.push(map[item.id]);
      }
    });

    return roots;
  }

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch(`/api/menu?lang=${lang}`);
        const json = await res.json();
        const data = json.data || [];

        const built = buildTree(data);

        setTree(built);
      } catch (e) {
        console.error("Menu fetch error:", e);
      }
    }

    fetchMenu();
  }, [lang]);

  const fixUrl = (url: string) => {
    if (!url) return "#";
    if (url.startsWith("http")) return url;
    return url.startsWith("/") ? url : `/${url}`;
  };

  function renderMenu(items: MenuItem[]) {
    return (
      <div>
        {items.map((item) => {
          const isExternal =
            item.attributes.url?.startsWith("http");

          const titleKey =
            item.attributes.title?.toLowerCase().trim();

          const href =
            linksMap[titleKey] ||
            fixUrl(item.attributes.url);

          return (
            <div key={item.id} style={{ marginBottom: 15 }}>
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={
                  isExternal
                    ? "noopener noreferrer"
                    : undefined
                }
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
              >
                <strong>{item.attributes.title}</strong>
              </a>

              {item.children &&
                item.children.length > 0 && (
                  <div
                    style={{
                      marginLeft: 15,
                      marginTop: 5,
                    }}
                  >
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
        <a href={`/${lang}`}>
          {lang === "en" ? "Home" : "Αρχική"}
        </a>

        <span>|</span>

        <button onClick={() => setOpen(true)}>
          {lang === "en" ? "Menu" : "Μενού"}
        </button>

        <span>|</span>

        {isLoggedIn ? (
          <>
            <span>
              {lang === "en"
                ? `Welcome ${userName}`
                : `Καλώς ήρθες ${userName}`}
            </span>

            <button onClick={handleLogout}>
              {lang === "en"
                ? "Logout"
                : "Αποσύνδεση"}
            </button>
          </>
        ) : (
          <a href={`/${lang}/login`}>
            {lang === "en"
              ? "Login"
              : "Σύνδεση"}
          </a>
        )}
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
            <button
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          {renderMenu(tree)}
        </div>
      )}
    </>
  );
}