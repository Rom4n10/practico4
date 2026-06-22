import type { EventType, EventFilters, EventFormData } from '@/types';
import { DURATION_PRESETS } from '@/data/mockData';

export function filterEventTypes(events: EventType[], filters: Partial<EventFilters>): EventType[] {
  return events.filter((event) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchesName = event.name.toLowerCase().includes(q);
      const matchesDesc = event.description?.toLowerCase().includes(q) ?? false;
      if (!matchesName && !matchesDesc) return false;
    }
    if (filters.status && filters.status !== 'all') {
      if (event.status !== filters.status) return false;
    }
    if (filters.duration !== undefined && filters.duration !== 'all') {
      if (filters.duration === 'custom') {
        if (DURATION_PRESETS.includes(event.duration as (typeof DURATION_PRESETS)[number])) return false;
      } else {
        if (event.duration !== Number(filters.duration)) return false;
      }
    }
    if (filters.dateFrom) {
      if (new Date(event.createdAt) < new Date(filters.dateFrom)) return false;
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59);
      if (new Date(event.createdAt) > to) return false;
    }
    return true;
  });
}

export function generateEventId(): string {
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createEventType(data: EventFormData, now: Date = new Date()): EventType {
  return {
    id: generateEventId(),
    name: data.name.trim(),
    description: data.description.trim(),
    duration: data.duration,
    modality: data.modality!,
    confirmation: data.confirmation,
    status: 'active',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    mediaFiles: [],
  };
}

export function updateEventType(existing: EventType, changes: Partial<EventFormData>, now: Date = new Date()): EventType {
  return {
    ...existing,
    ...(changes.name !== undefined && { name: changes.name.trim() }),
    ...(changes.description !== undefined && { description: changes.description.trim() }),
    ...(changes.duration !== undefined && { duration: changes.duration }),
    ...(changes.modality !== undefined && changes.modality !== null && { modality: changes.modality }),
    ...(changes.confirmation !== undefined && { confirmation: changes.confirmation }),
    updatedAt: now.toISOString(),
  };
}

export function toggleEventStatus(event: EventType): EventType['status'] {
  return event.status === 'active' ? 'inactive' : 'active';
}
