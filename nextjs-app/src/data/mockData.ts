import type { EventType, BookingConfig, BookingEventType } from '@/types';

export const BOOKING_CONFIG: BookingConfig = {
  sessionTimeoutMs: 5 * 60 * 1000,
  pollingIntervalMs: 30 * 1000,
  idleTimeoutMs: 60 * 1000,
  warningThresholdMs: 2 * 60 * 1000,
  criticalThresholdMs: 60 * 1000,
  minAdvanceHours: 2,
  maxBookingsPerDay: 20,
  slotIntervalMinutes: 15,
  workStart: 8,
  workEnd: 18,
  blockedDays: [0],
  blockedDates: ['2026-04-20', '2026-05-01', '2026-05-25'],
};

export const BOOKING_EVENT_TYPES: BookingEventType[] = [
  { id: 'evt-001', name: 'Reunión General', description: 'Encuentro presencial de seguimiento.', duration: 30, modality: 'presencial', icon: '📅' },
  { id: 'evt-002', name: 'Videollamada', description: 'Reunión virtual en línea.', duration: 15, modality: 'virtual', icon: '💻' },
  { id: 'evt-003', name: 'Workshop Presencial', description: 'Sesión presencial de trabajo en grupo.', duration: 60, modality: 'presencial', icon: '🎯' },
  { id: 'evt-004', name: 'Seguimiento', description: 'Revisión posterior a un evento.', duration: 30, modality: 'ambas', icon: '📋' },
  { id: 'evt-005', name: 'Coaching 1:1', description: 'Sesión individual de acompañamiento.', duration: 45, modality: 'virtual', icon: '💬' },
];

export const EVENT_TYPES_DATA: EventType[] = [
  { id: 'evt-001', name: 'Reunión General', description: 'Encuentro presencial de seguimiento.', duration: 30, modality: 'presencial', confirmation: 'auto', status: 'active', createdAt: '2026-01-15T10:30:00', updatedAt: '2026-03-20T14:00:00', mediaFiles: [] },
  { id: 'evt-002', name: 'Videollamada', description: 'Reunión virtual en línea.', duration: 15, modality: 'virtual', confirmation: 'auto', status: 'active', createdAt: '2026-02-01T09:00:00', updatedAt: '2026-03-18T11:30:00', mediaFiles: [] },
  { id: 'evt-003', name: 'Workshop Presencial', description: 'Sesión presencial de trabajo en grupo.', duration: 60, modality: 'presencial', confirmation: 'manual', status: 'active', createdAt: '2026-01-20T08:00:00', updatedAt: '2026-04-01T16:45:00', mediaFiles: [] },
  { id: 'evt-004', name: 'Coaching 1:1', description: 'Sesión individual de acompañamiento.', duration: 45, modality: 'virtual', confirmation: 'manual', status: 'active', createdAt: '2026-02-15T14:30:00', updatedAt: '2026-04-05T09:00:00', mediaFiles: [] },
  { id: 'evt-005', name: 'Revisión de Informes', description: 'Análisis de documentación compartida.', duration: 30, modality: 'virtual', confirmation: 'auto', status: 'inactive', createdAt: '2026-01-10T13:00:00', updatedAt: '2026-02-28T17:00:00', mediaFiles: [] },
  { id: 'evt-006', name: 'Capacitación Express', description: 'Sesión breve de formación.', duration: 15, modality: 'presencial', confirmation: 'auto', status: 'active', createdAt: '2026-03-10T08:30:00', updatedAt: '2026-04-12T10:00:00', mediaFiles: [] },
];

export const MOCK_BOOKED_SLOTS: Record<string, string[]> = {
  '2026-04-14': ['09:00', '09:30', '10:00', '14:00', '14:30'],
  '2026-04-15': ['08:00', '08:30', '11:00', '11:30', '15:00'],
  '2026-04-16': ['09:00', '10:30', '13:00'],
};

export const DURATION_PRESETS = [15, 30, 45, 60] as const;
export const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'] as const;
export const DAY_NAMES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'] as const;
