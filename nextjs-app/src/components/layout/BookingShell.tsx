'use client';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  timerText?: string;
  timezone?: string;
}

export default function BookingShell({ children, timerText = '5:00', timezone }: Props) {
  const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="booking-shell" data-theme="light">
      <div className="timer-bar">
        <div className="timer-bar-fill" style={{ width: '100%' }} />
      </div>

      <header className="booking-header">
        <div className="booking-brand">
          <div className="booking-brand-icon">A</div>
          <span className="booking-brand-text">AgendaYa</span>
        </div>
        <div className="booking-timer-display">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="timer-text">{timerText}</span>
        </div>
      </header>

      <div className="timezone-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
        <span className="tz-name">{tz}</span>
      </div>

      {children}

      <div id="booking-toast-container" className="booking-toast-container" aria-live="polite" />
    </div>
  );
}
