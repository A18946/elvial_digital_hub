"use client";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Menu() {
  const [open, setOpen] = useState(false);
 const { lang, setLang } = useLanguage();
  

  return (
    <>
      {/* TOP BAR */}
      <div style={{ padding: 10, borderBottom: "1px solid #ddd" }}>
        
<a href="/">
  {lang === "en" ? "Home" : "Αρχική"}
</a>

        <span style={{ margin: "0 10px" }}>|</span>
        <button onClick={() => setOpen(true)}>{lang === "en" ? "Menu" : "Μενού"}</button>
      </div>

      {/* SIDEBAR */}
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
          {/* CLOSE */}
          <div style={{ marginBottom: 20 }}>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* ================= */}
          {/* ELVIAL SYSTEMS */}
          {/* ================= */}
          <h2 style={{ fontWeight: "bold" }}>
              <a href="/node/640" style={{ textDecoration: "none", color: "black" }}>
                  {lang === "en" ? "ELVIAL SYSTEMS" : "ΣΥΣΤΗΜΑΤΑ ELVIAL"}
              </a>
          </h2>

          <div style={{ marginTop: 15, lineHeight: "2" }}>
            <a href="/page/hinged-systems">{lang === "en" ? "HINGED SYSTEMS" : "ΑΝΟΙΓΟΜΕΝΑ ΣΥΣΤΗΜΑΤΑ"}</a>
            <br />
            <a href="/page/sliding-systems">{lang === "en" ? "SLIDING SYSTEMS" : "ΣΥΡΟΜΕΝΑ ΣΥΣΤΗΜΑΤΑ"}</a>
            <br />
            <a href="/page/folding-doors">{lang === "en" ? "FOLDING DOORS" : "ΦΥΣΣΟΥΝΕΣ"}</a>
            <br />
            <a href="/page/entrance-doors">{lang === "en" ? "ENTRANCE DOORS" : "ΕΙΣΟΔΟΙ"}</a>
            <br />
            <a href="/page/facades">{lang === "en" ? "FACADES SYSTEMS" : "ΥΑΛΟΠΕΤΑΣΜΑΤΑ"}</a>
            <br />
            <a href="/page/outdoor">{lang === "en" ? "OUTDOOR SYSTEMS" : "ΛΥΣΕΙΣ OUTDOOR"}</a>
            <br />
            <a href="/page/sun-shading">{lang === "en" ? "SUN SHADING SYSTEMS" : "ΣΚΙΑΣΗ"}</a>
            <br />
            <a href="/page/various">{lang === "en" ? "VARIOUS" : "ΔΙΑΦΟΡΑ"}</a>
            <br />
            <a href="/page/digital-services">{lang === "en" ? "DIGITAL SERVICES" : "ΨΗΦΙΑΚΕΣ ΥΠΗΡΕΣΙΕΣ"}</a>
          </div>

          {/* ================= */}
          {/* GENERAL MANUALS */}
          {/* ================= */}
          <h2 style={{ marginTop: 30, fontWeight: "bold" }}>
            {lang === "en" ? "GENERAL MANUALS" : "ΓΕΝΙΚΑ ΕΓΧΕΙΡΙΔΙΑ"}
          </h2>

          {/* ================= */}
          {/* ELVIAL SITE */}
          {/* ================= */}
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontWeight: "bold" }}>ELVIAL SITE</h2>

            <div style={{ marginTop: 10, marginLeft: 10, lineHeight: "2" }}>
              <a href="https://www.elvial.gr/partners/">ELVIAL PARTNERS</a>
              <br />
              <a href="https://www.elvial.gr/elvial-home">ELVIAL HOME</a>
            </div>
          </div>

          {/* ================= */}
          {/* CALCULATORS */}
          {/* ================= */}
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontWeight: "bold" }}>CALCULATORS</h2>

            <div style={{ marginTop: 10, marginLeft: 10, lineHeight: "2" }}>
              <a href="#">ELVIAL STATICS</a>
              <br />
              <a href="https://e-elvial.gr/pls/apex/f?p=113:24:7843696091771::NO:::">UW CALCULATOR</a>
            </div>
          </div>

          {/* ================= */}
          {/* ACCOUNT */}
          {/* ================= */}
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontWeight: "bold" }}>ACCOUNT</h2>

            <div style={{ marginTop: 10, marginLeft: 10, lineHeight: "2" }}>
              <a href="#">MY ACCOUNT</a>
            </div>
          </div>

          {/* ================= */}
          {/* BOTTOM LINKS */}
          {/* ================= */}
          <div style={{ marginTop: 30 }}>
            <a href="/">Home</a>
            <br />
            <a href="#">My account</a>
          </div>
        </div>
      )}
    </>
  );
}