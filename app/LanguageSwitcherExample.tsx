"use client";

import { useLanguage } from "./context/LanguageContext";
import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcherExample() {
  const { lang, setLang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

 const switchLang = (newLang: string) => {
  setLang(newLang);

  if (!pathname) return;

  // ✅ βγάζουμε παλιό lang prefix
  let cleanPath = pathname.replace(/^\/(el|en)/, "");

  if (!cleanPath.startsWith("/")) {
    cleanPath = "/" + cleanPath;
  }

  // ✅ ΠΑΝΤΑ βάζουμε lang prefix
  router.push(`/${newLang}${cleanPath}`);
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