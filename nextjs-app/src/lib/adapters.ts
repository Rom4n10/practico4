import type { EventType, TimeSlot } from '@/types';

export interface DashboardEvent {
  id: number;
  name: string;
  status: 'Activo' | 'Inactivo';
  duration: number;
}

export interface CalendarSlot {
  time: string;
  isPast: boolean;
  available: boolean;
}

function toDisplayStatus(status: EventType['status']): 'Activo' | 'Inactivo' {
  return status === 'active' ? 'Activo' : 'Inactivo';
}

export function toDashboardEvents(events: EventType[]): DashboardEvent[] {
  return events.map((event, index) => ({
    id: index + 1,
    name: event.name,
    status: toDisplayStatus(event.status),
    duration: event.duration,
  }));
}

export function toCalendarSlots(
  slots: TimeSlot[],
  dateStr: string,
  now: Date = new Date()
): CalendarSlot[] {
  const parts = dateStr.split('-');
  const baseDate = new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10)
  );

  return slots.map((slot) => {
    const [hour, minute] = slot.time.split(':').map((value) => parseInt(value, 10));
    const slotDate = new Date(baseDate);
    slotDate.setHours(hour, minute, 0, 0);

    return {
      time: slot.time,
      isPast: slotDate <= now,
      available: slot.available,
    };
  });
}
