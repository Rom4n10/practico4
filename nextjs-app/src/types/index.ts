/**
 * Tipos principales del Sistema de Gestión Hospitalaria ICS
 * Migraci贸n desde vanilla JS a TypeScript
 */

// ─── Tipos de Evento ───────────────────────────────────────────────────────────

export type Modality = 'presencial' | 'virtual' | 'ambas';
export type ConfirmationType = 'auto' | 'manual';
export type EventStatus = 'active' | 'inactive';

export interface EventType {
  id: string;
  name: string;
  description: string;
  duration: number; // minutos
  modality: Modality;
  confirmation: ConfirmationType;
  status: EventStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  mediaFiles: MediaFile[];
}

export interface MediaFile {
  name: string;
  type: string;
  url: string;
}

// ─── Filtros de Evento ─────────────────────────────────────────────────────────

export interface EventFilters {
  search: string;
  status: EventStatus | 'all';
  duration: number | 'all' | 'custom';
  dateFrom: string;
  dateTo: string;
}

// ─── Reservas (Booking) ────────────────────────────────────────────────────────

export interface BookingConfig {
  sessionTimeoutMs: number;
  pollingIntervalMs: number;
  idleTimeoutMs: number;
  warningThresholdMs: number;
  criticalThresholdMs: number;
  minAdvanceHours: number;
  maxBookingsPerDay: number;
  slotIntervalMinutes: number;
  workStart: number; // hora (ej: 8)
  workEnd: number;   // hora (ej: 18)
  blockedDays: number[]; // 0=Dom, 1=Lun, etc.
  blockedDates: string[]; // 'YYYY-MM-DD'
}

export interface TimeSlot {
  time: string;      // 'HH:MM'
  available: boolean;
  locked: boolean;
}

export interface BookingEventType {
  id: string;
  name: string;
  description: string;
  duration: number;
  modality: Modality;
  icon: string;
}

// ─── Formulario de Paciente ────────────────────────────────────────────────────

export interface GuestData {
  fullName: string;
  email: string;
  phone: string;
  note: string;
}

// ─── Validaciones ──────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface EventFormData {
  name: string;
  description: string;
  duration: number;
  modality: Modality | null;
  confirmation: ConfirmationType;
}

// ─── Sugerencias ──────────────────────────────────────────────────────────────

export interface SlotSuggestion {
  date: string;         // 'YYYY-MM-DD'
  time: string;         // 'HH:MM'
  displayDate: string;  // 'Lun 15 de Abril'
  displayTime: string;  // '10:00 AM'
}
