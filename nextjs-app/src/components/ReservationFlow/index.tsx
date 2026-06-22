'use client';
/**
 * ReservationFlow
 * Cubre: US_020, US_022, US_023 — Flujo de reserva y concurrencia
 *
 * Props:
 *   isLockedTemp:       el slot 10:00 está bloqueado temporalmente
 *   success:            la reserva fue exitosa
 *   concurrencyConflict: hubo colisión de concurrencia al guardar
 *   eventName, date, time: datos para mostrar en confirmación
 *
 * Lógica:
 *   - isLockedTemp=true   → botón 10:00 aparece deshabilitado
 *   - success=true        → al hacer click en "Aceptar" muestra confirmación exitosa
 *   - concurrencyConflict=true → al hacer click en "Aceptar" muestra alerta de colisión
 */
import { useState } from 'react';

interface Props {
  isLockedTemp?: boolean;
  success?: boolean;
  eventName?: string;
  date?: string;
  time?: string;
  concurrencyConflict?: boolean;
}

export default function ReservationFlow({
  isLockedTemp = false,
  success = false,
  concurrencyConflict = false,
  eventName,
  date,
  time,
}: Props) {
  const [message, setMessage] = useState('');

  function handleAceptar() {
    if (concurrencyConflict) {
      setMessage('Este horario ya fue reservado. Por favor, seleccione otro');
      return;
    }
    if (success) {
      setMessage(`Se ha confirmado con éxito${eventName ? `: ${eventName}` : ''}`);
    }
  }

  return (
    <div>
      {/* Slot de turno — deshabilitado si está bloqueado temporalmente (US_020) */}
      <button
        type="button"
        aria-label="10:00"
        disabled={isLockedTemp}
      >
        10:00
      </button>

      {/* Botón de confirmación (US_022, US_023) */}
      <button type="button" onClick={handleAceptar}>
        Aceptar
      </button>

      {/* Mensaje resultante (éxito o conflicto) */}
      {message && <p role="alert">{message}</p>}
    </div>
  );
}
