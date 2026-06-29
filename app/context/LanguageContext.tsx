"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("en");

  // Διάβασε από localStorage κατά το mount
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLangState(saved);
  }, []);

  // Αποθήκευσε στο localStorage όταν αλλάζει
  const setLang = (newLang: string) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}