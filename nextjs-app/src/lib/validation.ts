import type { GuestData, EventFormData, ValidationResult, EventType } from '@/types';

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateName(name: string): boolean {
  return name.trim().length >= 3;
}

export function validateDuration(duration: number): boolean {
  return Number.isInteger(duration) && duration > 0;
}

export function validatePhone(phone: string): boolean {
  if (phone.trim() === '') return true;
  return /^[\d\s\+\-\(\)]{7,15}$/.test(phone.trim());
}

export function isGuestFormValid(guestData: GuestData): boolean {
  return validateName(guestData.fullName) && validateEmail(guestData.email);
}

export function validateEventForm(
  data: EventFormData,
  existingEvents: EventType[],
  editingId?: string
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim() === '') {
    errors['name'] = 'El nombre es obligatorio';
  } else {
    const duplicate = existingEvents.find(
      (e) => e.name.toLowerCase() === data.name.trim().toLowerCase() && e.id !== editingId
    );
    if (duplicate) {
      errors['name'] = 'Ya existe un tipo de evento con este nombre';
    }
  }

  if (!validateDuration(data.duration)) {
    errors['duration'] = 'La duración debe ser un número positivo';
  }

  if (!data.modality) {
    errors['modality'] = 'Debes seleccionar una modalidad';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
