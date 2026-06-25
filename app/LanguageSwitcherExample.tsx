"use client";

import { useLanguage } from "./context/LanguageContext";

export default function LanguageSwitcherExample() {
  const { lang, setLang } = useLanguage();

  return (
    <div>
      <button
        onClick={() => setLang("en")}
        style={{ background: lang === "en" ? "#ddd" : "#fff" }}
      >
        English
      </button>

      <button
        onClick={() => setLang("el")}
        style={{ background: lang === "el" ? "#ddd" : "#fff" }}
      >
        Greek
      </button>
    </div>
  );
}