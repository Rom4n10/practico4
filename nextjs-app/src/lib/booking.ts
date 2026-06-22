import type { TimeSlot, BookingConfig, BookingEventType, SlotSuggestion } from '@/types';
import { DAY_NAMES, MONTH_NAMES } from '@/data/mockData';

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatTime12h(timeStr: string): { time: string; period: string } {
  const [hourStr, minStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return { time: `${h12}:${minStr}`, period };
}

export function isDateBlocked(date: Date, config: BookingConfig): boolean {
  const dayOfWeek = date.getDay();
  if (config.blockedDays.includes(dayOfWeek)) return true;
  const dateStr = formatDateKey(date);
  return config.blockedDates.includes(dateStr);
}

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
  const selectedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  if (isNaN(selectedDate.getTime())) return [];

  const duration = eventType.duration;
  const interval = config.slotIntervalMinutes;
  const slots: TimeSlot[] = [];

  for (let hour = config.workStart; hour < config.workEnd; hour++) {
    for (let min = 0; min < 60; min += interval) {
      const slotTime = new Date(selectedDate);
      slotTime.setHours(hour, min, 0, 0);
      if (slotTime <= now) continue;
      const diffHours = (slotTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (diffHours < config.minAdvanceHours) continue;
      const slotEnd = new Date(slotTime.getTime() + duration * 60 * 1000);
      if (slotEnd.getHours() > config.workEnd || (slotEnd.getHours() === config.workEnd && slotEnd.getMinutes() > 0)) continue;
      const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      const isBooked = bookedSlots.includes(timeStr);
      let overlapsBooked = false;
      if (!isBooked) {
        for (let offsetMin = interval; offsetMin < duration; offsetMin += interval) {
          const checkTime = new Date(slotTime.getTime() + offsetMin * 60 * 1000);
          const checkStr = `${String(checkTime.getHours()).padStart(2, '0')}:${String(checkTime.getMinutes()).padStart(2, '0')}`;
          if (bookedSlots.includes(checkStr)) { overlapsBooked = true; break; }
        }
      }
      slots.push({ time: timeStr, available: !isBooked && !overlapsBooked, locked: false });
    }
  }
  return slots;
}

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
  const baseDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

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
