'use client';
/**
 * GuestDataForm — Formulario de datos del paciente (Paso 3 del Booking)
 * Cubre: US_015, US_016, US_019
 *
 * US_015: El sistema valida que el email ingresado tenga formato correcto.
 * US_016: El nombre debe tener al menos 3 caracteres para continuar.
 * US_019: El botón "Siguiente" se habilita solo cuando el formulario es válido.
 *
 * Reglas de negocio (extraídas de booking.js → isFormValid):
 *   - fullName: mínimo 3 caracteres (sin espacios leading/trailing)
 *   - email:    debe pasar regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/
 *   - phone:    opcional
 *   - note:     opcional
 */

import { useState } from 'react';

interface Props {
  onSubmit?: (data: { fullName: string; email: string; phone: string; note: string }) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function GuestDataForm({ onSubmit }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [note, setNote]         = useState('');

  const [nameError, setNameError]   = useState('');
  const [emailError, setEmailError] = useState('');

  // Validación en tiempo real del nombre
  function handleNameChange(value: string) {
    setFullName(value);
    if (value.trim().length > 0 && value.trim().length < 3) {
      setNameError('El nombre debe tener al menos 3 caracteres');
    } else {
      setNameError('');
    }
  }

  // Validación en tiempo real del email
  function handleEmailChange(value: string) {
    setEmail(value);
    if (value.trim().length > 0 && !EMAIL_REGEX.test(value.trim())) {
      setEmailError('El email no tiene un formato válido');
    } else {
      setEmailError('');
    }
  }

  // El formulario es válido si nombre ≥ 3 chars Y email correcto
  const isValid = fullName.trim().length >= 3 && EMAIL_REGEX.test(email.trim());

  function handleSubmit() {
    if (!isValid) return;
    onSubmit?.({ fullName: fullName.trim(), email: email.trim(), phone, note });
  }

  return (
    <form>
      {/* Nombre completo */}
      <div>
        <label htmlFor="fullName">Nombre completo</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => handleNameChange(e.target.value)}
        />
        {nameError && <span role="alert">{nameError}</span>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
        />
        {emailError && <span role="alert">{emailError}</span>}
      </div>

      {/* Teléfono (opcional) */}
      <div>
        <label htmlFor="phone">Teléfono (opcional)</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* Nota (opcional) */}
      <div>
        <label htmlFor="note">Nota</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* Botón habilitado solo cuando el formulario es válido (US_019) */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid}
      >
        Siguiente
      </button>
    </form>
  );
}
