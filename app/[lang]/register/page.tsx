"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";

export default function RegisterForm() {
  const { lang } = useLanguage();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    mail: "",
    field_first_name: "",
    field_last_name: "",
    field_phone: "",
    field_password: "",
    field_confirm_password: "",
    field_choose_roles: "homeowner",
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null as string | null,
    success: false,
  });

  const t = {
    title: lang === "el" ? "Εγγραφή" : "Register",
    firstName: lang === "el" ? "Όνομα" : "First Name",
    lastName: lang === "el" ? "Επώνυμο" : "Last Name",
    username: lang === "el" ? "Όνομα χρήστη" : "Username",
    email: lang === "el" ? "Email" : "Email",
    phone: lang === "el" ? "Τηλέφωνο" : "Phone",
    password: lang === "el" ? "Κωδικός" : "Password",
    confirmPassword: lang === "el" ? "Επιβεβαίωση κωδικού" : "Confirm Password",
    role: lang === "el" ? "Ρόλος" : "Role",
    homeowner: lang === "el" ? "Ιδιοκτήτης" : "Homeowner",
    architect: lang === "el" ? "Αρχιτέκτονας" : "Architect",
    fabricator: lang === "el" ? "Κατασκευαστής" : "Fabricator",
    submit: lang === "el" ? "Δημιουργία λογαριασμού" : "Create Account",
    submitting: lang === "el" ? "Δημιουργία..." : "Creating Account...",
    success: lang === "el" ? "Η εγγραφή ολοκληρώθηκε επιτυχώς." : "Registration completed successfully.",
    passwordMismatch: lang === "el" ? "Οι κωδικοί δεν ταιριάζουν" : "Passwords do not match",
    serverError: lang === "el" ? "Σφάλμα διακομιστή" : "Server error",
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.field_password !== form.field_confirm_password) {
      setStatus({ loading: false, error: t.passwordMismatch, success: false });
      return;
    }

    setStatus({ loading: true, error: null, success: false });

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ loading: false, error: data.message || t.serverError, success: false });
        return;
      }

      setStatus({ loading: false, error: null, success: true });
      setTimeout(() => router.push(`/${lang}/login`), 2000);
    } catch {
      setStatus({ loading: false, error: t.serverError, success: false });
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginTop: "8px",
    marginBottom: "20px",
  };

  return (
    <main style={{ padding: 40, maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 30, fontSize: 48, fontWeight: 700 }}>
        {t.title}
      </h1>

      <form onSubmit={handleSubmit}>
        {status.error && (
          <div style={{ color: "red", marginBottom: 20 }}>{status.error}</div>
        )}
        {status.success && (
          <div style={{ color: "green", marginBottom: 20 }}>{t.success}</div>
        )}

        <label>{t.firstName}</label>
        <input name="field_first_name" value={form.field_first_name} onChange={handleChange} style={inputStyle} required />

        <label>{t.lastName}</label>
        <input name="field_last_name" value={form.field_last_name} onChange={handleChange} style={inputStyle} required />

        <label>{t.username}</label>
        <input name="name" value={form.name} onChange={handleChange} style={inputStyle} required />

        <label>{t.email}</label>
        <input type="email" name="mail" value={form.mail} onChange={handleChange} style={inputStyle} required />

        <label>{t.phone}</label>
        <input name="field_phone" value={form.field_phone} onChange={handleChange} style={inputStyle} required />

        <label>{t.password}</label>
        <input type="password" name="field_password" value={form.field_password} onChange={handleChange} style={inputStyle} required />

        <label>{t.confirmPassword}</label>
        <input type="password" name="field_confirm_password" value={form.field_confirm_password} onChange={handleChange} style={inputStyle} required />

        <label>{t.role}</label>
        <select name="field_choose_roles" value={form.field_choose_roles} onChange={handleChange} style={inputStyle}>
          <option value="homeowner">{t.homeowner}</option>
          <option value="architect">{t.architect}</option>
          <option value="fabricator">{t.fabricator}</option>
        </select>

        <button
          type="submit"
          disabled={status.loading}
          style={{
            width: "100%",
            padding: 12,
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: status.loading ? "not-allowed" : "pointer",
            marginTop: 10,
          }}
        >
          {status.loading ? t.submitting : t.submit}
        </button>
      </form>
    </main>
  );
}