'use client';
/**
 * ReservationFlow
 * Cubre: US_020, US_022, US_023 — Flujo de reserva y concurrencia
 */
import { useState } from 'react';
import { BookingSuccessToast } from '@/components/booking/BookingSuccessToast';

interface Props {
  isLockedTemp?: boolean;
  success?: boolean;
  eventName?: string;
  date?: string;
  time?: string;
  concurrencyConflict?: boolean;
}

const SUCCESS_TOAST_MESSAGE = 'Reserva finalizada con éxito';

export default function ReservationFlow({
  isLockedTemp = false,
  success = false,
  concurrencyConflict = false,
  eventName,
}: Props) {
  const [message, setMessage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  function handleAceptar() {
    if (concurrencyConflict) {
      setMessage('Este horario ya fue reservado. Por favor, seleccione otro');
      return;
    }
    if (success) {
      setShowSuccessToast(true);
      setMessage(`Se ha confirmado con éxito${eventName ? `: ${eventName}` : ''}`);
    }
  }

  return (
    <div className="card booking-flow">
      {showSuccessToast && (
        <BookingSuccessToast
          message={SUCCESS_TOAST_MESSAGE}
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      <button
        type="button"
        className="btn btn-slot"
        aria-label="10:00"
        disabled={isLockedTemp}
      >
        10:00
      </button>

      <button type="button" className="btn btn-primary" onClick={handleAceptar}>
        Aceptar
      </button>

      {message && (
        <p
          className={`alert ${concurrencyConflict ? 'alert-error' : 'alert-success'}${showSuccessToast ? ' sr-only' : ''}`}
          role="alert"
        >
          {message}
        </p>
      )}
    </div>
  );
}
