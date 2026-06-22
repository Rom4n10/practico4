'use client';
/**
 * BookingCalendar
 * Cubre: US_017, US_018 — Calendario y selección de turnos
 *
 * Props:
 *   slots: lista de slots con { time, isPast, available }
 *   date:  fecha seleccionada en formato 'YYYY-MM-DD'
 *
 * Lógica:
 *   - Extrae el número de día de `date` para mostrarlo como botón clickeable
 *   - Muestra SOLO los slots que NO son pasados (isPast=false) Y están disponibles
 *   - Si no hay slots disponibles → muestra "No hay turnos disponibles"
 *   - Los slots pasados (isPast=true) NUNCA se renderizan
 */

interface Slot {
  time: string;
  isPast: boolean;
  available: boolean;
}

interface Props {
  slots: Slot[];
  date: string; // 'YYYY-MM-DD'
}

export default function BookingCalendar({ slots, date }: Props) {
  // Extraer número de día de la fecha (ej: '2026-04-19' → '19')
  const dayNumber = date.split('-')[2];

  // Filtrar: solo slots futuros Y disponibles
  const visibleSlots = slots.filter((s) => !s.isPast && s.available);

  return (
    <div>
      {/* Botón del día (clickeable para confirmar selección) */}
      <button type="button" aria-label={`Día ${dayNumber}`}>
        {dayNumber}
      </button>

      {/* Turnos disponibles o aviso de sin disponibilidad */}
      {visibleSlots.length === 0 ? (
        <p>No hay turnos disponibles</p>
      ) : (
        <div role="list">
          {visibleSlots.map((slot) => (
            <button
              key={slot.time}
              type="button"
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
