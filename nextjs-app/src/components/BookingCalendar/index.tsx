'use client';
/**
 * BookingCalendar
 * Cubre: US_017, US_018 — Calendario y selección de turnos
 */
interface Slot {
  time: string;
  isPast: boolean;
  available: boolean;
}

interface Props {
  slots: Slot[];
  date: string;
}

export default function BookingCalendar({ slots, date }: Props) {
  const dayNumber = date.split('-')[2];
  const visibleSlots = slots.filter((s) => !s.isPast && s.available);

  return (
    <div className="card">
      <button type="button" className="btn btn-day" aria-label={`Día ${dayNumber}`}>
        {dayNumber}
      </button>

      {visibleSlots.length === 0 ? (
        <p style={{ marginTop: '1rem' }}>No hay turnos disponibles</p>
      ) : (
        <div className="slot-grid" role="list">
          {visibleSlots.map((slot) => (
            <button
              key={slot.time}
              type="button"
              className="btn btn-slot"
              role="listitem"
            >
              {slot.time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
