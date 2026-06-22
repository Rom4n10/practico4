/**
 * lib/eventTypes.ts
 * Lógica pura de gestión de tipos de evento — sin DOM, 100% testeable con Jest.
 *
 * Cubre requerimientos:
 *   - M03-R01F: Listar y filtrar tipos de evento
 *   - M03-R02F: Filtrado por duración
 *   - M03-R03F: Búsqueda por nombre/descripción
 *   - M03-R04F: Crear, editar y validar tipos de evento
 */

import type { EventType, EventFilters, EventFormData } from '@/types';
import { DURATION_PRESETS } from '@/data/mockData';

// ─── Filtrado (M03-R01F, R02F, R03F) ──────────────────────────────────────────

/**
 * Filtra una lista de tipos de evento según los criterios indicados.
 *
 * Filtros disponibles:
 *  - search:   búsqueda en nombre y descripción (case-insensitive)
 *  - status:   'active' | 'inactive' | 'all'
 *  - duration: número exacto de minutos | 'custom' (no preset) | 'all'
 *  - dateFrom / dateTo: rango de createdAt
 *
 * @example
 * filterEventTypes(events, { search: '', status: 'active', duration: 'all', dateFrom: '', dateTo: '' })
 * // → solo eventos con status === 'active'
 */
export function filterEventTypes(
  events: EventType[],
  filters: Partial<EventFilters>
): EventType[] {
  return events.filter((event) => {
    // Búsqueda por texto
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchesName = event.name.toLowerCase().includes(q);
      const matchesDesc = event.description?.toLowerCase().includes(q) ?? false;
      if (!matchesName && !matchesDesc) return false;
    }

    // Filtro por estado
    if (filters.status && filters.status !== 'all') {
      if (event.status !== filters.status) return false;
    }

    // Filtro por duración
    if (filters.duration !== undefined && filters.duration !== 'all') {
      if (filters.duration === 'custom') {
        // 'custom' = duraciones no estándar (no están en DURATION_PRESETS)
        if (DURATION_PRESETS.includes(event.duration as (typeof DURATION_PRESETS)[number]))
          return false;
      } else {
        if (event.duration !== Number(filters.duration)) return false;
      }
    }

    // Filtro por fecha de creación (desde)
    if (filters.dateFrom) {
      if (new Date(event.createdAt) < new Date(filters.dateFrom)) return false;
    }

    // Filtro por fecha de creación (hasta)
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59);
      if (new Date(event.createdAt) > to) return false;
    }

    return true;
  });
}

// ─── Generación de ID ──────────────────────────────────────────────────────────

/**
 * Genera un ID único para un nuevo tipo de evento.
 * Formato: 'evt-' + timestamp + random
 */
export function generateEventId(): string {
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Creación de Evento (M03-R04F) ────────────────────────────────────────────

/**
 * Crea un nuevo objeto EventType a partir de los datos del formulario.
 * No modifica ningún estado global — retorna el nuevo objeto.
 *
 * @example
 * createEventType({ name: 'Consulta', description: '', duration: 30, modality: 'presencial', confirmation: 'auto' })
 * // → { id: 'evt-xxx', status: 'active', createdAt: '...', ... }
 */
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

/**
 * Aplica los cambios de edición a un evento existente.
 * Retorna un nuevo objeto (inmutable) sin modificar el original.
 */
export function updateEventType(
  existing: EventType,
  changes: Partial<EventFormData>,
  now: Date = new Date()
): EventType {
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

// ─── Toggle de Estado ─────────────────────────────────────────────────────────

/**
 * Alterna el estado de un evento entre 'active' e 'inactive'.
 * Retorna el nuevo estado resultante.
 */
export function toggleEventStatus(event: EventType): EventType['status'] {
  return event.status === 'active' ? 'inactive' : 'active';
}
