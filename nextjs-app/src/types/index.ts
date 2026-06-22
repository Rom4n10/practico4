/**
 * Tipos principales del Sistema de Gestión Hospitalaria ICS
 */

export type Modality = 'presencial' | 'virtual' | 'ambas';
export type ConfirmationType = 'auto' | 'manual';
export type EventStatus = 'active' | 'inactive';

export interface EventType {
  id: string;
  name: string;
  description: string;
  duration: number;
  modality: Modality;
  confirmation: ConfirmationType;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
  mediaFiles: MediaFile[];
}

export interface MediaFile {
  name: string;
  type: string;
  url: string;
}

export interface EventFilters {
  search: string;
  status: EventStatus | 'all';
  duration: number | 'all' | 'custom';
  dateFrom: string;
  dateTo: string;
}

export interface BookingConfig {
  sessionTimeoutMs: number;
  pollingIntervalMs: number;
  idleTimeoutMs: number;
  warningThresholdMs: number;
  criticalThresholdMs: number;
  minAdvanceHours: number;
  maxBookingsPerDay: number;
  slotIntervalMinutes: number;
  workStart: number;
  workEnd: number;
  blockedDays: number[];
  blockedDates: string[];
}

export interface TimeSlot {
  time: string;
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

export interface GuestData {
  fullName: string;
  email: string;
  phone: string;
  note: string;
}

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

export interface SlotSuggestion {
  date: string;
  time: string;
  displayDate: string;
  displayTime: string;
}
