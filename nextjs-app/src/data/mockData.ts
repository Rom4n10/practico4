/**
 * Mock Data - Migración de data.js y booking.js a TypeScript tipado
 */

import type { EventType, BookingConfig, BookingEventType } from '@/types';

// ─── Configuración de Reservas ─────────────────────────────────────────────────

export const BOOKING_CONFIG: BookingConfig = {
  sessionTimeoutMs: 5 * 60 * 1000,    // 5 minutos (M04-R01NF)
  pollingIntervalMs: 30 * 1000,        // 30 segundos (M04-R09F)
  idleTimeoutMs: 60 * 1000,           // 60 seg sin interacción
  warningThresholdMs: 2 * 60 * 1000,  // 2 min restantes → advertencia
  criticalThresholdMs: 60 * 1000,     // 1 min restante → crítico
  minAdvanceHours: 2,                  // Antelación mínima de reserva
  maxBookingsPerDay: 20,
  slotIntervalMinutes: 15,
  workStart: 8,                        // Hora inicio laboral
  workEnd: 18,                         // Hora fin laboral
  blockedDays: [0],                    // Domingo bloqueado (0=Dom)
  blockedDates: ['2026-04-20', '2026-05-01', '2026-05-25'],
};

// ─── Tipos de Evento para Booking ─────────────────────────────────────────────

export const BOOKING_EVENT_TYPES: BookingEventType[] = [
  {
    id: 'evt-001',
    name: 'Consulta General',
    description: 'Evaluación de síntomas y seguimiento.',
    duration: 30,
    modality: 'presencial',
    icon: '🏥',
  },
  {
    id: 'evt-002',
    name: 'Teleconsulta',
    description: 'Consulta virtual por videollamada.',
    duration: 15,
    modality: 'virtual',
    icon: '💻',
  },
  {
    id: 'evt-003',
    name: 'Cirugía Programada',
    description: 'Intervención quirúrgica programada.',
    duration: 60,
    modality: 'presencial',
    icon: '⚕️',
  },
  {
    id: 'evt-004',
    name: 'Control Post-quirúrgico',
    description: 'Seguimiento posterior a cirugía.',
    duration: 30,
    modality: 'ambas',
    icon: '📋',
  },
  {
    id: 'evt-005',
    name: 'Evaluación Psicológica',
    description: 'Sesión de salud mental.',
    duration: 45,
    modality: 'virtual',
    icon: '🧠',
  },
];

// ─── Tipos de Evento del Admin (M03) ──────────────────────────────────────────

export const EVENT_TYPES_DATA: EventType[] = [
  {
    id: 'evt-001',
    name: 'Consulta General',
    description: 'Consulta médica general para evaluación de síntomas.',
    duration: 30,
    modality: 'presencial',
    confirmation: 'auto',
    status: 'active',
    createdAt: '2026-01-15T10:30:00',
    updatedAt: '2026-03-20T14:00:00',
    mediaFiles: [],
  },
  {
    id: 'evt-002',
    name: 'Teleconsulta',
    description: 'Consulta médica virtual a través de videollamada.',
    duration: 15,
    modality: 'virtual',
    confirmation: 'auto',
    status: 'active',
    createdAt: '2026-02-01T09:00:00',
    updatedAt: '2026-03-18T11:30:00',
    mediaFiles: [],
  },
  {
    id: 'evt-003',
    name: 'Cirugía Programada',
    description: 'Intervención quirúrgica que requiere preparación previa.',
    duration: 60,
    modality: 'presencial',
    confirmation: 'manual',
    status: 'active',
    createdAt: '2026-01-20T08:00:00',
    updatedAt: '2026-04-01T16:45:00',
    mediaFiles: [],
  },
  {
    id: 'evt-004',
    name: 'Evaluación Psicológica',
    description: 'Sesión de evaluación psicológica para salud mental.',
    duration: 45,
    modality: 'virtual',
    confirmation: 'manual',
    status: 'active',
    createdAt: '2026-02-15T14:30:00',
    updatedAt: '2026-04-05T09:00:00',
    mediaFiles: [],
  },
  {
    id: 'evt-005',
    name: 'Revisión de Estudios',
    description: 'Consulta para análisis de resultados de laboratorio.',
    duration: 30,
    modality: 'virtual',
    confirmation: 'auto',
    status: 'inactive',
    createdAt: '2026-01-10T13:00:00',
    updatedAt: '2026-02-28T17:00:00',
    mediaFiles: [],
  },
  {
    id: 'evt-006',
    name: 'Vacunación',
    description: 'Aplicación de vacunas según calendario.',
    duration: 15,
    modality: 'presencial',
    confirmation: 'auto',
    status: 'active',
    createdAt: '2026-03-10T08:30:00',
    updatedAt: '2026-04-12T10:00:00',
    mediaFiles: [],
  },
];

// ─── Slots Ocupados Mock ───────────────────────────────────────────────────────

export const MOCK_BOOKED_SLOTS: Record<string, string[]> = {
  '2026-04-14': ['09:00', '09:30', '10:00', '14:00', '14:30'],
  '2026-04-15': ['08:00', '08:30', '11:00', '11:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
  '2026-04-16': ['09:00', '10:30', '13:00'],
};

// ─── Constantes de UI ─────────────────────────────────────────────────────────

export const DURATION_PRESETS = [15, 30, 45, 60] as const;

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
] as const;

export const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const;
