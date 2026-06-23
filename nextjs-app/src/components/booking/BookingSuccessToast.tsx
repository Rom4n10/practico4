'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  message: string;
  onClose: () => void;
}

function SuccessToast({ message, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast toast-success" role="status" aria-live="polite">
      <span className="toast-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </span>
      <span className="toast-message">{message}</span>
      <button type="button" className="toast-close" aria-label="Cerrar" onClick={onClose}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

export function useBookingToastContainer() {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.getElementById('booking-toast-container'));
  }, []);

  return container;
}

export function BookingSuccessToast({ message, onClose }: Props) {
  const container = useBookingToastContainer();
  if (!container) return null;
  return createPortal(<SuccessToast message={message} onClose={onClose} />, container);
}
