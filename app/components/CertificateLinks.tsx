"use client";

import { useEffect, useState } from "react";
import CertificateModal from "./CertificateModal";

export default function CertificateLinks() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const handler = async (e: any) => {
      const link = e.target.closest(".certificate-link");
      if (!link) return;

      e.preventDefault();

      const code = link.getAttribute("data-certificate");
      console.log("!!! CERTIFICATE CLICK — code extracted:", code);
      if (!code) return;

      setOpen(true);
      setLoading(true);
      setFiles([]);

      try {
        const url = `https://darkcyan-koala-320694.hostingersite.com/api/certificates/${code}`;
        console.log("!!! FETCHING:", url);

        const res = await fetch(url, { cache: "no-store" });

        console.log("!!! RESPONSE STATUS:", res.status, res.ok);

        if (!res.ok) {
          console.error("Certificate fetch failed:", res.status);
          setFiles([]);
          return;
        }

        const data = await res.json();
        console.log("!!! RESPONSE DATA:", data);
        setFiles(data.certificates || []);
      } catch (err) {
        console.error("!!! CERTIFICATE FETCH ERROR (likely CORS or network):", err);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <CertificateModal
      open={open}
      onClose={() => setOpen(false)}
      files={files}
      loading={loading}
    />
  );
}