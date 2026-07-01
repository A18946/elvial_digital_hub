"use client";

import { useState } from "react";

export default function RegisterForm() {
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
    error: null,
    success: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      form.field_password !==
      form.field_confirm_password
    ) {
      setStatus({
        loading: false,
        error: "Passwords do not match",
        success: false,
      });
      return;
    }

    setStatus({
      loading: true,
      error: null,
      success: false,
    });

    try {
      const res = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setStatus({
          loading: false,
          error:
            data.message ||
            "Registration failed",
          success: false,
        });
        return;
      }

      setStatus({
        loading: false,
        error: null,
        success: true,
      });
    } catch {
      setStatus({
        loading: false,
        error: "Server error",
        success: false,
      });
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
    <main
      style={{
        padding: 40,
        maxWidth: 500,
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          marginBottom: 30,
          fontSize: 48,
          fontWeight: 700,
        }}
      >
        Register
      </h1>

      <form onSubmit={handleSubmit}>
        {status.error && (
          <div
            style={{
              color: "red",
              marginBottom: 20,
            }}
          >
            {status.error}
          </div>
        )}

        {status.success && (
          <div
            style={{
              color: "green",
              marginBottom: 20,
            }}
          >
            Registration completed successfully.
          </div>
        )}
        <label>First Name</label>
        <input
          name="field_first_name"
          value={form.field_first_name}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <label>Last Name</label>
        <input
          name="field_last_name"
          value={form.field_last_name}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <label>Username</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="mail"
          value={form.mail}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <label>Phone</label>
        <input
          name="field_phone"
          value={form.field_phone}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <label>Password</label>
        <input
          type="password"
          name="field_password"
          value={form.field_password}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <label>Confirm Password</label>
        <input
          type="password"
          name="field_confirm_password"
          value={form.field_confirm_password}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <label>Role</label>
        <select
          name="field_choose_roles"
          value={form.field_choose_roles}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="homeowner">
            Homeowner
          </option>

          <option value="architect">
            Architect
          </option>

          <option value="fabricator">
            Fabricator
          </option>
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
            cursor: "pointer",
            marginTop: 10,
          }}
        >
          {status.loading
            ? "Creating Account..."
            : "Create Account"}
        </button>
      </form>
    </main>
  );
}