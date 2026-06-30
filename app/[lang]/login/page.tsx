"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";

export default function LoginPage() {
  const { lang } = useLanguage(); // ← από context, όχι params
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("LOGIN CLICKED:", username);
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("STATUS:", res.status);
      const data = await res.json();
      console.log("DATA:", data);

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("drupal_token", data.token);
      localStorage.setItem("drupal_uid", String(data.uid));
      localStorage.setItem("drupal_name", data.name);
      window.dispatchEvent(new Event("storage"));
      router.push(`/${lang || "en"}`);
    } catch (e) {
      console.error("ERROR:", e);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 40, maxWidth: 400, margin: "0 auto" }}>
      <h1>{lang === "el" ? "Σύνδεση" : "Login"}</h1>

      {error && (
        <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          {lang === "el" ? "Όνομα χρήστη / Email" : "Username / Email"}
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          {lang === "el" ? "Κωδικός" : "Password"}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
        />
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          background: "#333",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading
          ? (lang === "el" ? "Σύνδεση..." : "Logging in...")
          : (lang === "el" ? "Σύνδεση" : "Login")
        }
      </button>
    </main>
  );
}