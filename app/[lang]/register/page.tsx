"use client";

import { useState } from 'react';

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: '',
    mail: '',
    field_first_name: '',
    field_last_name: '',
    field_password: '',
    field_confirm_password: '',
    field_phone: '',
    field_choose_roles: 'homeowner',
  });
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.field_password !== form.field_confirm_password) {
      setStatus({ loading: false, error: 'Οι κωδικοί δεν ταιριάζουν', success: false });
      return;
    }

    setStatus({ loading: true, error: null, success: false });

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ loading: false, error: data.message, success: false });
        return;
      }

      setStatus({ loading: false, error: null, success: true });
    } catch {
      setStatus({ loading: false, error: 'Κάτι πήγε στραβά', success: false });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Όνομα χρήστη" value={form.name} onChange={handleChange} required />
      <input name="mail" type="email" placeholder="Email" value={form.mail} onChange={handleChange} required />
      <input name="field_first_name" placeholder="Όνομα" value={form.field_first_name} onChange={handleChange} required />
      <input name="field_last_name" placeholder="Επώνυμο" value={form.field_last_name} onChange={handleChange} required />
      <input name="field_phone" placeholder="Τηλέφωνο" value={form.field_phone} onChange={handleChange} required />
      <input name="field_password" type="password" placeholder="Κωδικός" value={form.field_password} onChange={handleChange} required />
      <input name="field_confirm_password" type="password" placeholder="Επιβεβαίωση κωδικού" value={form.field_confirm_password} onChange={handleChange} required />

      <select name="field_choose_roles" value={form.field_choose_roles} onChange={handleChange}>
        <option value="homeowner">Ιδιοκτήτης</option>
        <option value="architect">Αρχιτέκτονας</option>
        <option value="fabricator">Κατασκευαστής</option>
      </select>

      <button type="submit" disabled={status.loading}>
        {status.loading ? 'Αποστολή...' : 'Εγγραφή'}
      </button>

      {status.error && <p style={{ color: 'red' }}>{status.error}</p>}
      {status.success && <p style={{ color: 'green' }}>Η εγγραφή ολοκληρώθηκε!</p>}
    </form>
  );
}