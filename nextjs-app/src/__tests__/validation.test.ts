/**
 * ============================================================
 *  EJEMPLO DE PRUEBA UNITARIA #2
 *  Módulo:      lib/validation.ts + lib/eventTypes.ts
 *  Funciones:   validateEmail, isGuestFormValid, validateEventForm,
 *               filterEventTypes
 *  Requerimientos: M03-R01F, M03-R03F, M03-R04F, M04-R06F
 *  Historias de Usuario:
 *    "Como paciente, quiero que me avisen si mi email es inválido."
 *    "Como admin, quiero filtrar eventos por nombre y estado."
 *    "Como admin, no quiero poder crear eventos con nombre vacío."
 * ============================================================
 *
 *  GUÍA PARA EL EQUIPO — cómo agregar tus propias pruebas
 *  ────────────────────────────────────────────────────────
 *  1. Elegí una función de src/lib/ que quieras testear.
 *  2. Importála arriba junto a sus tipos.
 *  3. Creá un bloque describe('nombreFuncion()', () => { ... }).
 *  4. Dentro, agregá tus tests con it('debe...', () => { ... }).
 *  5. Usá el patrón Arrange / Act / Assert.
 *  6. Corré `npm test` para ver si pasan.
 *
 *  Funciones disponibles para testear:
 *  ────────────────────────────────────
 *  src/lib/validation.ts:
 *    - validateEmail(email)
 *    - validateName(name)
 *    - validateDuration(duration)
 *    - validatePhone(phone)
 *    - isGuestFormValid(guestData)
 *    - validateEventForm(data, existingEvents, editingId?)
 *
 *  src/lib/eventTypes.ts:
 *    - filterEventTypes(events, filters)
 *    - createEventType(data)
 *    - updateEventType(existing, changes)
 *    - toggleEventStatus(event)
 *
 *  src/lib/booking.ts:
 *    - isDateBlocked(date, config)
 *    - generateTimeSlots(dateStr, eventType, config, booked, now)
 *    - findNearestSuggestions(...)
 *    - formatTime12h(timeStr)
 *    - formatDateKey(date)
 *
 * ============================================================
 */

import { validateEmail, validateName, validateDuration, isGuestFormValid, validateEventForm } from '@/lib/validation';
import { filterEventTypes } from '@/lib/eventTypes';
import { EVENT_TYPES_DATA } from '@/data/mockData';
import type { GuestData, EventFormData } from '@/types';

// ─── Tests de validateEmail (M04-R06F) ────────────────────────────────────────

describe('validateEmail()', () => {
  /**
   * PRUEBA UNITARIA DE EJEMPLO #3
   * ─────────────────────────────────────────────────────────────────────────────
   * Qué verifica: Que emails con formato correcto sean aceptados.
   * Escenario positivo (happy path): el campo tiene un email bien formado.
   */
  it('debe retornar true para un email con formato válido', () => {
    // Arrange
    const emailValido = 'juan.perez@hospital.com';

    // Act
    const resultado = validateEmail(emailValido);

    // Assert
    expect(resultado).toBe(true);
    //
    // Si este test falla, revisá la regex en src/lib/validation.ts
    // El patrón es: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  });

  it('debe retornar false para un email sin arroba (@)', () => {
    // Arrange
    const emailInvalido = 'juanhospital.com'; // sin @

    // Act
    const resultado = validateEmail(emailInvalido);

    // Assert
    expect(resultado).toBe(false);
  });

  it('debe retornar false para un email sin dominio después del punto', () => {
    expect(validateEmail('juan@hospital.')).toBe(false);
  });

  it('debe retornar false para un string vacío', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('debe retornar true para email con subdominio', () => {
    expect(validateEmail('medico@mail.hospital.org')).toBe(true);
  });
});

// ─── Tests de validateName ────────────────────────────────────────────────────

describe('validateName()', () => {
  it('debe retornar true para nombres de 3 o más caracteres', () => {
    expect(validateName('Ana')).toBe(true);
    expect(validateName('Juan Pérez')).toBe(true);
  });

  it('debe retornar false para nombres de menos de 3 caracteres', () => {
    expect(validateName('Jo')).toBe(false);
    expect(validateName('')).toBe(false);
  });

  it('debe ignorar espacios iniciales y finales al contar caracteres', () => {
    // '  A  ' después de trim() tiene 1 char → inválido
    expect(validateName('  A  ')).toBe(false);
  });
});

// ─── Tests de validateDuration ────────────────────────────────────────────────

describe('validateDuration()', () => {
  it('debe retornar true para duraciones positivas enteras', () => {
    expect(validateDuration(15)).toBe(true);
    expect(validateDuration(30)).toBe(true);
    expect(validateDuration(60)).toBe(true);
  });

  it('debe retornar false para duración 0', () => {
    expect(validateDuration(0)).toBe(false);
  });

  it('debe retornar false para duración negativa', () => {
    expect(validateDuration(-10)).toBe(false);
  });
});

// ─── Tests de isGuestFormValid (M04-R06F) ─────────────────────────────────────

describe('isGuestFormValid()', () => {
  /**
   * PRUEBA UNITARIA DE EJEMPLO #4
   * ─────────────────────────────────────────────────────────────────────────────
   * Qué verifica: Que el formulario del paciente (paso 3) sea válido
   *               cuando nombre y email cumplen los criterios mínimos.
   * Importancia: Sin validación correcta, el paciente puede avanzar con datos
   *              incompletos o incorrectos (M04-R06F).
   */
  it('debe retornar true cuando nombre y email son válidos', () => {
    // ── Arrange ──────────────────────────────────────────────────────────────
    const datosValidos: GuestData = {
      fullName: 'María García',   // ≥ 3 chars ✓
      email: 'maria@clinica.com', // formato válido ✓
      phone: '',                  // opcional
      note: '',                   // opcional
    };

    // ── Act ───────────────────────────────────────────────────────────────────
    const esValido = isGuestFormValid(datosValidos);

    // ── Assert ────────────────────────────────────────────────────────────────
    expect(esValido).toBe(true);
  });

  it('debe retornar false si el nombre tiene menos de 3 caracteres', () => {
    // Arrange: nombre demasiado corto
    const datosInvalidos: GuestData = {
      fullName: 'Ma',             // solo 2 chars ✗
      email: 'ma@clinica.com',
      phone: '',
      note: '',
    };

    // Act + Assert
    expect(isGuestFormValid(datosInvalidos)).toBe(false);
  });

  it('debe retornar false si el email es inválido aunque el nombre sea correcto', () => {
    const datos: GuestData = {
      fullName: 'Juan Pérez',
      email: 'no-es-un-email', // formato inválido ✗
      phone: '',
      note: '',
    };
    expect(isGuestFormValid(datos)).toBe(false);
  });
});

// ─── Tests de filterEventTypes (M03-R01F, R02F, R03F) ────────────────────────

describe('filterEventTypes()', () => {
  /** Usamos los datos mock reales del sistema */
  const eventos = EVENT_TYPES_DATA;

  it('debe devolver solo eventos activos al filtrar por status: active', () => {
    // Arrange
    const filtros = { status: 'active' as const };

    // Act
    const resultado = filterEventTypes(eventos, filtros);

    // Assert
    // Todos los resultados deben tener status === 'active'
    expect(resultado.every((e) => e.status === 'active')).toBe(true);

    // No deben aparecer eventos inactivos
    const hayInactivos = resultado.some((e) => e.status === 'inactive');
    expect(hayInactivos).toBe(false);
  });

  it('debe filtrar por duración exacta (30 minutos)', () => {
    // Arrange
    const filtros = { duration: 30 };

    // Act
    const resultado = filterEventTypes(eventos, filtros);

    // Assert
    expect(resultado.every((e) => e.duration === 30)).toBe(true);
    expect(resultado.length).toBeGreaterThan(0);
  });

  it('debe encontrar eventos que coincidan con la búsqueda "consulta"', () => {
    // Arrange: 'consulta' aparece en varios nombres
    const filtros = { search: 'consulta' };

    // Act
    const resultado = filterEventTypes(eventos, filtros);

    // Assert: al menos uno debe tener 'consulta' en el nombre o descripción
    expect(resultado.length).toBeGreaterThan(0);
    resultado.forEach((e) => {
      const enNombre = e.name.toLowerCase().includes('consulta');
      const enDesc = e.description?.toLowerCase().includes('consulta') ?? false;
      expect(enNombre || enDesc).toBe(true);
    });
  });

  it('debe devolver todos los eventos si no se aplica ningún filtro', () => {
    const resultado = filterEventTypes(eventos, {});
    expect(resultado.length).toBe(eventos.length);
  });

  it('debe devolver array vacío si la búsqueda no matchea nada', () => {
    const resultado = filterEventTypes(eventos, { search: 'zzz-no-existe' });
    expect(resultado).toHaveLength(0);
  });
});

// ─── Tests de validateEventForm (M03-R04F) ────────────────────────────────────

describe('validateEventForm()', () => {
  const eventosExistentes = EVENT_TYPES_DATA;

  it('debe ser válido con datos correctos y sin duplicados', () => {
    // Arrange
    const datos: EventFormData = {
      name: 'Nuevo Servicio Único',
      description: 'Un servicio nuevo',
      duration: 45,
      modality: 'presencial',
      confirmation: 'auto',
    };

    // Act
    const { valid, errors } = validateEventForm(datos, eventosExistentes);

    // Assert
    expect(valid).toBe(true);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('debe fallar si el nombre está vacío', () => {
    const datos: EventFormData = {
      name: '',            // ← vacío
      description: '',
      duration: 30,
      modality: 'presencial',
      confirmation: 'auto',
    };

    const { valid, errors } = validateEventForm(datos, eventosExistentes);

    expect(valid).toBe(false);
    expect(errors['name']).toBeDefined();
    expect(errors['name']).toContain('obligatorio');
  });

  it('debe fallar si hay un nombre duplicado en la lista existente', () => {
    // 'Consulta General' ya existe en EVENT_TYPES_DATA
    const datos: EventFormData = {
      name: 'Consulta General', // ← duplicado
      description: '',
      duration: 30,
      modality: 'presencial',
      confirmation: 'auto',
    };

    const { valid, errors } = validateEventForm(datos, eventosExistentes);

    expect(valid).toBe(false);
    expect(errors['name']).toContain('Ya existe');
  });

  it('debe fallar si la duración es 0 o negativa', () => {
    const datos: EventFormData = {
      name: 'Servicio Nuevo',
      description: '',
      duration: 0,  // ← inválido
      modality: 'presencial',
      confirmation: 'auto',
    };

    const { valid, errors } = validateEventForm(datos, eventosExistentes);

    expect(valid).toBe(false);
    expect(errors['duration']).toBeDefined();
  });

  it('debe fallar si la modalidad es null', () => {
    const datos: EventFormData = {
      name: 'Servicio Sin Modalidad',
      description: '',
      duration: 30,
      modality: null,  // ← no seleccionada
      confirmation: 'auto',
    };

    const { valid, errors } = validateEventForm(datos, eventosExistentes);

    expect(valid).toBe(false);
    expect(errors['modality']).toBeDefined();
  });

  it('no debe detectar duplicado si es el mismo evento en edición (editingId)', () => {
    // Si estamos EDITANDO 'Consulta General' (id: evt-001), no debe fallar por duplicado
    const datos: EventFormData = {
      name: 'Consulta General', // mismo nombre
      description: 'Actualizado',
      duration: 30,
      modality: 'presencial',
      confirmation: 'auto',
    };

    const { valid } = validateEventForm(datos, eventosExistentes, 'evt-001');

    expect(valid).toBe(true);
  });
});
