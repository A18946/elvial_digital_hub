"use client";

import { useLanguage } from "./context/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function LanguageSwitcherExample() {
  const { lang, setLang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  // Όταν φορτώνει η σελίδα, κάνε redirect στο σωστό lang prefix
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    const hasPrefix = pathname.startsWith("/en") || pathname.startsWith("/el");
    
    if (!hasPrefix) {
      router.replace(`/${savedLang}${pathname}`);
    } else if (!pathname.startsWith(`/${savedLang}`)) {
      // Αν το prefix δεν ταιριάζει με την αποθηκευμένη γλώσσα
      const newPath = pathname.replace(/^\/(en|el)/, `/${savedLang}`);
      router.replace(newPath);
    }
  }, []);

  const switchLang = (newLang: string) => {
    setLang(newLang);
    const newPath = pathname.replace(/^\/(en|el)/, `/${newLang}`);
    router.push(newPath || `/${newLang}`);
  };

  return (
    <div>
      <button
        onClick={() => switchLang("en")}
        style={{ background: lang === "en" ? "#ddd" : "#fff" }}
      >
        English
      </button>
      <button
        onClick={() => switchLang("el")}
        style={{ background: lang === "el" ? "#ddd" : "#fff" }}
      >
        Greek
      </button>
    </div>
  );
}