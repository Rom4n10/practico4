/**
 * lib/booking.ts
 * Lógica pura de reservas — sin DOM, 100% testeable con Jest.
 *
 * Cubre requerimientos:
 *   - M04-R03F: Visualización de horarios disponibles
 *   - M04-R04F: Selección de horario
 *   - M04-R05F: Timer de sesión
 *   - M04-R01F: Sugerencias alternativas
 */

import type { TimeSlot, BookingConfig, BookingEventType, SlotSuggestion } from '@/types';
import { DAY_NAMES, MONTH_NAMES } from '@/data/mockData';

// ─── Utilidades de Fecha ───────────────────────────────────────────────────────

/**
 * Formatea una fecha como clave 'YYYY-MM-DD'.
 * @example formatDateKey(new Date(2026, 3, 15)) → '2026-04-15'
 */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Convierte 'HH:MM' a formato 12h.
 * @example formatTime12h('14:30') → { time: '2:30', period: 'PM' }
 * @example formatTime12h('08:00') → { time: '8:00', period: 'AM' }
 */
export function formatTime12h(timeStr: string): { time: string; period: string } {
  const [hourStr, minStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return { time: `${h12}:${minStr}`, period };
}

// ─── Validación de Fechas Bloqueadas (M04-R03F) ────────────────────────────────

/**
 * Determina si una fecha está bloqueada (feriado o día no laborable).
 *
 * @param date    Fecha a evaluar
 * @param config  Configuración del sistema de reservas
 * @returns true si la fecha está bloqueada, false si es reservable
 *
 * @example
 * // Domingo (getDay() === 0) está en blockedDays
 * isDateBlocked(new Date('2026-04-19'), config) → true
 *
 * @example
 * // Feriado explícito
 * isDateBlocked(new Date('2026-05-01'), config) → true
 */
export function isDateBlocked(date: Date, config: BookingConfig): boolean {
  const dayOfWeek = date.getDay();
  if (config.blockedDays.includes(dayOfWeek)) return true;
  const dateStr = formatDateKey(date);
  return config.blockedDates.includes(dateStr);
}

// ─── Generación de Slots Disponibles (M04-R03F) ────────────────────────────────

/**
 * Genera los slots de tiempo disponibles para una fecha y tipo de evento dados.
 * Aplica las reglas de negocio:
 *  - Solo slots futuros (no pasados)
 *  - Antelación mínima (minAdvanceHours)
 *  - Slots que no superen el horario de cierre
 *  - Slots no ocupados ni superpuestos con reservas existentes
 *
 * @param dateStr     Fecha en formato 'YYYY-MM-DD'
 * @param eventType   Tipo de evento seleccionado (contiene la duración)
 * @param config      Configuración del sistema
 * @param bookedSlots Lista de horarios ya reservados para esa fecha (ej: ['09:00','09:30'])
 * @param now         Fecha/hora actual (inyectada para facilitar testing)
 * @returns           Array de TimeSlot con time, available y locked
 *
 * @example
 * generateTimeSlots('2026-04-20', eventType30min, config, [], new Date('2026-04-20T07:00'))
 * // → slots de 08:00 a 17:30 (cada 15 min), todos available: true
 */
export function generateTimeSlots(
  dateStr: string,
  eventType: BookingEventType,
  config: BookingConfig,
  bookedSlots: string[],
  now: Date = new Date()
): TimeSlot[] {
  if (!dateStr) return [];
  const parts = dateStr.split('-');
  if (parts.length !== 3) return [];
  const selectedDate = new Date(
    parseInt(parts[0]),
    parseInt(parts[1]) - 1,
    parseInt(parts[2])
  );
  if (isNaN(selectedDate.getTime())) return [];

  const duration = eventType.duration;
  const interval = config.slotIntervalMinutes;
  const slots: TimeSlot[] = [];

  for (let hour = config.workStart; hour < config.workEnd; hour++) {
    for (let min = 0; min < 60; min += interval) {
      const slotTime = new Date(selectedDate);
      slotTime.setHours(hour, min, 0, 0);

      // Ignorar slots pasados
      if (slotTime <= now) continue;

      // Antelación mínima
      const diffHours = (slotTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (diffHours < config.minAdvanceHours) continue;

      // El slot + duración no puede superar workEnd
      const slotEnd = new Date(slotTime.getTime() + duration * 60 * 1000);
      if (
        slotEnd.getHours() > config.workEnd ||
        (slotEnd.getHours() === config.workEnd && slotEnd.getMinutes() > 0)
      )
        continue;

      const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      const isBooked = bookedSlots.includes(timeStr);

      // Verificar superposición con slots ocupados intermedios
      let overlapsBooked = false;
      if (!isBooked) {
        for (let offsetMin = interval; offsetMin < duration; offsetMin += interval) {
          const checkTime = new Date(slotTime.getTime() + offsetMin * 60 * 1000);
          const checkStr = `${String(checkTime.getHours()).padStart(2, '0')}:${String(checkTime.getMinutes()).padStart(2, '0')}`;
          if (bookedSlots.includes(checkStr)) {
            overlapsBooked = true;
            break;
          }
        }
      }

      slots.push({
        time: timeStr,
        available: !isBooked && !overlapsBooked,
        locked: false,
      });
    }
  }

  return slots;
}

// ─── Sugerencias Alternativas (M04-R01F) ──────────────────────────────────────

/**
 * Busca los próximos N slots disponibles a partir de una fecha base.
 * Se usa cuando no hay disponibilidad en la fecha seleccionada.
 *
 * @param baseDateStr      Fecha base 'YYYY-MM-DD' desde donde buscar
 * @param eventType        Tipo de evento seleccionado
 * @param config           Configuración del sistema
 * @param allBookedSlots   Mapa de fecha → slots ocupados
 * @param count            Cantidad de sugerencias a devolver
 * @param now              Fecha/hora actual (inyectada para testing)
 */
export function findNearestSuggestions(
  baseDateStr: string,
  eventType: BookingEventType,
  config: BookingConfig,
  allBookedSlots: Record<string, string[]>,
  count: number = 3,
  now: Date = new Date()
): SlotSuggestion[] {
  const suggestions: SlotSuggestion[] = [];
  const parts = baseDateStr.split('-');
  const baseDate = new Date(
    parseInt(parts[0]),
    parseInt(parts[1]) - 1,
    parseInt(parts[2])
  );

  for (let dayOffset = 0; dayOffset <= 14 && suggestions.length < count; dayOffset++) {
    const checkDate = new Date(baseDate);
    checkDate.setDate(baseDate.getDate() + dayOffset);

    if (isDateBlocked(checkDate, config)) continue;

    const dateStr = formatDateKey(checkDate);
    const booked = allBookedSlots[dateStr] || [];
    const slots = generateTimeSlots(dateStr, eventType, config, booked, now);

    for (const slot of slots) {
      if (slot.available && suggestions.length < count) {
        const t12 = formatTime12h(slot.time);
        suggestions.push({
          date: dateStr,
          time: slot.time,
          displayDate: `${DAY_NAMES[checkDate.getDay()]} ${checkDate.getDate()} de ${MONTH_NAMES[checkDate.getMonth()]}`,
          displayTime: `${t12.time} ${t12.period}`,
        });
      }
    }
  }

  return suggestions;
}
