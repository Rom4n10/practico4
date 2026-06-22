'use client';

import AppNav from '@/components/AppNav';
import BookingCalendar from '@/components/BookingCalendar';
import GuestDataForm from '@/components/GuestDataForm';
import ReservationFlow from '@/components/ReservationFlow';
import {
  BOOKING_CONFIG,
  BOOKING_EVENT_TYPES,
  MOCK_BOOKED_SLOTS,
} from '@/data/mockData';
import { toCalendarSlots } from '@/lib/adapters';
import { generateTimeSlots } from '@/lib/booking';

const BOOKING_DATE = '2026-04-19';
const selectedEvent = BOOKING_EVENT_TYPES[0];
const bookedSlots = MOCK_BOOKED_SLOTS[BOOKING_DATE] ?? [];
const calendarSlots = toCalendarSlots(
  generateTimeSlots(BOOKING_DATE, selectedEvent, BOOKING_CONFIG, bookedSlots),
  BOOKING_DATE
);

export default function ReservasPage() {
  return (
    <>
      <AppNav />
      <main className="app-main">
        <h1 className="app-page-title">Reserva de turnos</h1>
        <p className="app-subtitle">
          Evento: {selectedEvent.name} — {BOOKING_DATE}
        </p>

        <section className="app-section">
          <div className="app-section-header">
            <span className="step-badge" aria-hidden="true">1</span>
            <h2>Calendario de turnos</h2>
          </div>
          <BookingCalendar slots={calendarSlots} date={BOOKING_DATE} />
        </section>

        <section className="app-section">
          <div className="app-section-header">
            <span className="step-badge" aria-hidden="true">2</span>
            <h2>Datos del paciente</h2>
          </div>
          <GuestDataForm />
        </section>

        <section className="app-section">
          <div className="app-section-header">
            <span className="step-badge" aria-hidden="true">3</span>
            <h2>Confirmación de reserva</h2>
          </div>
          <ReservationFlow />
        </section>
      </main>
    </>
  );
}
