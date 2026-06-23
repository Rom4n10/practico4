'use client';

import { useMemo, useState } from 'react';
import BookingCalendar from '@/components/BookingCalendar';
import GuestDataForm from '@/components/GuestDataForm';
import ReservationFlow from '@/components/ReservationFlow';
import {
  BOOKING_CONFIG,
  BOOKING_EVENT_TYPES,
  EVENT_TYPES_DATA,
  MOCK_BOOKED_SLOTS,
  MONTH_NAMES,
} from '@/data/mockData';
import { toCalendarSlots } from '@/lib/adapters';
import { formatDateKey, generateTimeSlots, isDateBlocked } from '@/lib/booking';
import type { BookingEventType } from '@/types';

const STEPS = ['Consulta', 'Horario', 'Datos', 'Confirmar'];
const ACTIVE_EVENT_IDS = new Set(
  EVENT_TYPES_DATA.filter((e) => e.status === 'active').map((e) => e.id)
);
const PUBLIC_EVENTS = BOOKING_EVENT_TYPES.filter((e) => ACTIVE_EVENT_IDS.has(e.id));

function buildCalendarDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ day: number | null; dateStr: string | null }> = [];
  for (let i = 0; i < startPad; i++) cells.push({ day: null, dateStr: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    cells.push({ day: d, dateStr: formatDateKey(date) });
  }
  return cells;
}

export default function BookingFlow() {
  const [step, setStep] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<BookingEventType | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const calendarDays = useMemo(
    () => buildCalendarDays(calendarMonth.year, calendarMonth.month),
    [calendarMonth]
  );

  const slots = useMemo(() => {
    if (!selectedDate || !selectedEvent) return [];
    const booked = MOCK_BOOKED_SLOTS[selectedDate] ?? [];
    const raw = generateTimeSlots(selectedDate, selectedEvent, BOOKING_CONFIG, booked);
    return toCalendarSlots(raw, selectedDate);
  }, [selectedDate, selectedEvent]);

  function canGoStep2() {
    return selectedEvent && selectedDate;
  }

  return (
    <>
      <div className="booking-stepper">
        {STEPS.map((label, i) => (
          <div key={label} className={`stepper-item ${i === step ? 'active' : i < step ? 'completed' : ''}`}>
            <span className="stepper-number">{i + 1}</span>
            <span className="stepper-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="booking-content">
        {step === 0 && (
          <div className="booking-step active">
            <div>
              <h1 className="step-title">¿Qué necesitás agendar?</h1>
              <p className="step-subtitle">Seleccioná el tipo de consulta y el día que prefieras</p>
            </div>

            <div>
              <h3 className="calendar-section-title">Tipo de Consulta</h3>
              <div className="event-types-grid">
                {PUBLIC_EVENTS.map((evt) => (
                  <button
                    key={evt.id}
                    type="button"
                    className={`event-type-card ${selectedEvent?.id === evt.id ? 'selected' : ''}`}
                    onClick={() => setSelectedEvent(evt)}
                  >
                    <span className="event-type-icon">{evt.icon}</span>
                    <span className="event-type-name">{evt.name}</span>
                    <span className="event-type-duration">{evt.duration} min</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="calendar-section">
              <h3 className="calendar-section-title">Seleccioná una fecha</h3>
              <div className="calendar-widget">
                <div className="calendar-header">
                  <span className="calendar-month-label">
                    {MONTH_NAMES[calendarMonth.month]} {calendarMonth.year}
                  </span>
                  <div className="calendar-nav-btns">
                    <button
                      type="button"
                      className="calendar-nav-btn"
                      aria-label="Mes anterior"
                      onClick={() =>
                        setCalendarMonth((m) => {
                          const d = new Date(m.year, m.month - 1, 1);
                          return { year: d.getFullYear(), month: d.getMonth() };
                        })
                      }
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <button
                      type="button"
                      className="calendar-nav-btn"
                      aria-label="Mes siguiente"
                      onClick={() =>
                        setCalendarMonth((m) => {
                          const d = new Date(m.year, m.month + 1, 1);
                          return { year: d.getFullYear(), month: d.getMonth() };
                        })
                      }
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                  </div>
                </div>
                <div className="calendar-weekdays">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d) => (
                    <span key={d} className="calendar-weekday">{d}</span>
                  ))}
                </div>
                <div className="calendar-days">
                  {calendarDays.map((cell, idx) => {
                    if (!cell.day || !cell.dateStr) {
                      return <span key={`empty-${idx}`} className="calendar-day empty" />;
                    }
                    const date = new Date(calendarMonth.year, calendarMonth.month, cell.day);
                    const blocked = isDateBlocked(date, BOOKING_CONFIG);
                    const selected = selectedDate === cell.dateStr;
                    return (
                      <button
                        key={cell.dateStr}
                        type="button"
                        className={`calendar-day ${blocked ? 'disabled' : ''} ${selected ? 'selected' : ''}`}
                        disabled={blocked}
                        onClick={() => setSelectedDate(cell.dateStr)}
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-block"
              disabled={!canGoStep2()}
              onClick={() => setStep(1)}
            >
              Continuar
            </button>
          </div>
        )}

        {step === 1 && selectedDate && selectedEvent && (
          <div className="booking-step active">
            <div>
              <h1 className="step-title">Elegí tu horario</h1>
              <p className="step-subtitle">Los horarios se muestran en tu zona horaria local</p>
            </div>
            <div className="time-slots-header">
              <span className="time-slots-date">{selectedDate}</span>
              <span className="form-hint" style={{ display: 'block', marginTop: 2 }}>{selectedEvent.name}</span>
            </div>
            <BookingCalendar slots={slots} date={selectedDate} />
            <div className="booking-nav">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>Volver</button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>Continuar</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="booking-step active">
            <div>
              <h1 className="step-title">Tus datos</h1>
              <p className="step-subtitle">Completá tu información para confirmar la reserva</p>
            </div>
            <GuestDataForm onSubmit={() => setStep(3)} />
            <div className="booking-nav">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>Volver</button>
            </div>
          </div>
        )}

        {step === 3 && selectedEvent && (
          <div className="booking-step active">
            <div>
              <h1 className="step-title">Confirmá tu reserva</h1>
              <p className="step-subtitle">Revisá los datos antes de confirmar</p>
            </div>
            <ReservationFlow success eventName={selectedEvent.name} />
            <div className="booking-nav">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>Volver</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
