'use client';
/**
 * GuestDataForm — Formulario de datos del paciente
 * Cubre: US_015, US_016, US_019
 */
import { useState } from 'react';

interface Props {
  onSubmit?: (data: { fullName: string; email: string; phone: string; note: string }) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function GuestDataForm({ onSubmit }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  function handleNameChange(value: string) {
    setFullName(value);
    if (value.trim().length > 0 && value.trim().length < 3) {
      setNameError('El nombre debe tener al menos 3 caracteres');
    } else {
      setNameError('');
    }
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (value.trim().length > 0 && !EMAIL_REGEX.test(value.trim())) {
      setEmailError('El email no tiene un formato válido');
    } else {
      setEmailError('');
    }
  }

  const isValid = fullName.trim().length >= 3 && EMAIL_REGEX.test(email.trim());

  function handleSubmit() {
    if (!isValid) return;
    onSubmit?.({ fullName: fullName.trim(), email: email.trim(), phone, note });
  }

  return (
    <form className="card">
      <div className="form-group">
        <label htmlFor="fullName">Nombre completo</label>
        <input
          id="fullName"
          className="input"
          type="text"
          value={fullName}
          onChange={(e) => handleNameChange(e.target.value)}
        />
        {nameError && <span className="field-error" role="alert">{nameError}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          className="input"
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
        />
        {emailError && <span className="field-error" role="alert">{emailError}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Teléfono (opcional)</label>
        <input
          id="phone"
          className="input"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="note">Nota</label>
        <textarea
          id="note"
          className="textarea"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={!isValid}
      >
        Siguiente
      </button>
    </form>
  );
}
