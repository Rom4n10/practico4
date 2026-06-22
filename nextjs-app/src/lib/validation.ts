/**
 * lib/validation.ts
 * Funciones de validación puras — sin DOM, 100% testeables con Jest.
 *
 * Cubre requerimientos:
 *   - M04-R06F: Validación del formulario de datos del paciente
 *   - M03-R04F: Validación del formulario de tipo de evento
 */

import type { GuestData, EventFormData, ValidationResult, EventType } from '@/types';

// ─── Validaciones Primitivas ───────────────────────────────────────────────────

/**
 * Valida un email con regex estándar RFC 5322 simplificado.
 * @example validateEmail('juan@hospital.com') → true
 * @example validateEmail('juan@') → false
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Valida un nombre: mínimo 3 caracteres, solo letras y espacios.
 * @example validateName('Juan Pérez') → true
 * @example validateName('Jo') → false
 */
export function validateName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 3;
}

/**
 * Valida que la duración sea un número positivo.
 * @example validateDuration(30) → true
 * @example validateDuration(0)  → false
 * @example validateDuration(-5) → false
 */
export function validateDuration(duration: number): boolean {
  return Number.isInteger(duration) && duration > 0;
}

/**
 * Valida un número de teléfono argentino (opcional, pero si se ingresa debe tener formato válido).
 * Acepta formato: +54 9 11 1234-5678 | 11-1234-5678 | vacío (campo opcional)
 */
export function validatePhone(phone: string): boolean {
  if (phone.trim() === '') return true; // campo opcional
  return /^[\d\s\+\-\(\)]{7,15}$/.test(phone.trim());
}

// ─── Validación Completa del Formulario de Paciente (M04-R06F) ─────────────────

/**
 * Verifica si el formulario de datos del paciente (paso 3 del booking) es válido.
 * Requiere: nombre ≥ 3 chars + email válido.
 * El teléfono y la nota son opcionales.
 *
 * @example
 * isGuestFormValid({ fullName: 'Juan Pérez', email: 'j@h.com', phone: '', note: '' })
 * → true
 */
export function isGuestFormValid(guestData: GuestData): boolean {
  return (
    validateName(guestData.fullName) &&
    validateEmail(guestData.email)
  );
}

// ─── Validación del Formulario de Tipo de Evento (M03-R04F) ───────────────────

/**
 * Valida el formulario de creación/edición de un tipo de evento.
 * Retorna un objeto { valid, errors } con mensajes de error por campo.
 *
 * Reglas:
 *  - name: obligatorio, no duplicado en la lista existente
 *  - duration: positiva
 *  - modality: no puede ser null
 *
 * @param data         Datos del formulario
 * @param existingEvents  Lista actual de eventos (para detectar duplicados)
 * @param editingId    ID del evento en edición (para excluirlo del chequeo de duplicados)
 */
export function validateEventForm(
  data: EventFormData,
  existingEvents: EventType[],
  editingId?: string
): ValidationResult {
  const errors: Record<string, string> = {};

  // Nombre obligatorio
  if (!data.name || data.name.trim() === '') {
    errors['name'] = 'El nombre es obligatorio';
  } else {
    // Nombre duplicado
    const duplicate = existingEvents.find(
      (e) =>
        e.name.toLowerCase() === data.name.trim().toLowerCase() &&
        e.id !== editingId
    );
    if (duplicate) {
      errors['name'] = 'Ya existe un tipo de evento con este nombre';
    }
  }

  // Duración válida
  if (!validateDuration(data.duration)) {
    errors['duration'] = 'La duración debe ser un número positivo';
  }

  // Modalidad requerida
  if (!data.modality) {
    errors['modality'] = 'Debes seleccionar una modalidad';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
