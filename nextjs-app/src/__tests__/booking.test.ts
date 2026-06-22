/**
 * ============================================================
 *  EJEMPLO DE PRUEBA UNITARIA #1
 *  Módulo:      lib/booking.ts
 *  Función:     isDateBlocked + generateTimeSlots
 *  Requerimiento: M04-R03F
 *  Historia de Usuario:
 *    "Como paciente, quiero ver solo los horarios disponibles
 *     para no poder reservar en días bloqueados o feriados."
 * ============================================================
 *
 *  ¿Cómo leer este archivo?
 *  ─────────────────────────
 *  1. Cada `describe()` agrupa tests relacionados a UNA función.
 *  2. Cada `it()` o `test()` es UNA prueba unitaria individual.
 *  3. Las pruebas siguen el patrón AAA:
 *       Arrange  → preparar datos de entrada
 *       Act      → llamar a la función
 *       Assert   → verificar el resultado con expect()
 *
 *  Para agregar tu propia prueba:
 *  ─────────────────────────────
 *  Copiá uno de los bloques it('...', () => { }) de abajo,
 *  cambiá el escenario y los datos, y ejecutá:
 *
 *    npm test
 *
 * ============================================================
 */

import { isDateBlocked, generateTimeSlots, formatTime12h, formatDateKey } from '@/lib/booking';
import { BOOKING_CONFIG } from '@/data/mockData';
import type { BookingEventType } from '@/types';

// ─── Datos de prueba compartidos ──────────────────────────────────────────────

/** Evento de 30 minutos usado en varios tests */
const EVENTO_CONSULTA_30MIN: BookingEventType = {
  id: 'evt-001',
  name: 'Consulta General',
  description: 'Consulta de prueba',
  duration: 30,
  modality: 'presencial',
  icon: '🏥',
};

/** Configuración base del sistema (importada de mockData) */
const CONFIG = BOOKING_CONFIG;

// ─── Tests de isDateBlocked ────────────────────────────────────────────────────

describe('isDateBlocked()', () => {
  /**
   * PRUEBA UNITARIA DE EJEMPLO #1
   * ─────────────────────────────────────────────────────────────────────────────
   * Qué verifica: Que los domingos (día 0) estén bloqueados automáticamente.
   * Por qué importa: El sistema no debe mostrar domingos como disponibles (M04-R03F).
   *
   * Nota: El domingo 19 de abril de 2026 es día 0 (getDay() === 0).
   * BOOKING_CONFIG.blockedDays = [0] → bloquea todos los domingos.
   */
  it('debe retornar true para un domingo (día bloqueado por configuración)', () => {
    // ── Arrange ──────────────────────────────────────────────────────────────
    // Domingo 19 de abril de 2026 → getDay() === 0 → está en blockedDays
    const domingo = new Date(2026, 3, 19); // mes es 0-indexed: 3 = abril

    // ── Act ───────────────────────────────────────────────────────────────────
    const resultado = isDateBlocked(domingo, CONFIG);

    // ── Assert ────────────────────────────────────────────────────────────────
    expect(resultado).toBe(true);
    //
    // Si el test falla aquí, significa que isDateBlocked() no está leyendo
    // correctamente la propiedad blockedDays de la configuración.
  });

  it('debe retornar true para una fecha feriado (1 de mayo)', () => {
    // Arrange
    const feriado = new Date(2026, 4, 1); // 1 de mayo de 2026 (en blockedDates)

    // Act
    const resultado = isDateBlocked(feriado, CONFIG);

    // Assert
    expect(resultado).toBe(true);
  });

  it('debe retornar false para un lunes hábil que no es feriado', () => {
    // Arrange
    const lunesHabil = new Date(2026, 3, 27); // Lunes 27 de abril 2026

    // Act
    const resultado = isDateBlocked(lunesHabil, CONFIG);

    // Assert
    expect(resultado).toBe(false);
  });
});

// ─── Tests de generateTimeSlots ───────────────────────────────────────────────

describe('generateTimeSlots()', () => {
  /**
   * PRUEBA UNITARIA DE EJEMPLO #2
   * ─────────────────────────────────────────────────────────────────────────────
   * Qué verifica: Que se generen slots disponibles para una fecha futura válida
   *               cuando no hay ningún slot ocupado.
   * Por qué importa: La generación de horarios es el núcleo del flujo de reserva.
   *
   * Técnica usada: "Inyección de 'now'"
   *   Como la función usa la hora actual para filtrar slots pasados, le pasamos
   *   una fecha fija como parámetro `now`. Esto hace que el test sea DETERMINISTA
   *   (siempre devuelve el mismo resultado sin importar cuándo se ejecuta).
   */
  it('debe generar slots disponibles cuando no hay horarios ocupados', () => {
    // ── Arrange ──────────────────────────────────────────────────────────────
    const fechaFutura = '2026-07-15'; // Miércoles hábil en el futuro
    const sinReservas: string[] = []; // No hay horarios ocupados ese día

    // Fijamos "ahora" a las 06:00 del mismo día para que todos los slots
    // laborales (08:00-17:30) sean futuros y superen la antelación mínima de 2h
    const ahoraFijo = new Date(2026, 6, 15, 6, 0, 0); // 15 julio 2026 06:00

    // ── Act ───────────────────────────────────────────────────────────────────
    const slots = generateTimeSlots(fechaFutura, EVENTO_CONSULTA_30MIN, CONFIG, sinReservas, ahoraFijo);

    // ── Assert ────────────────────────────────────────────────────────────────
    // Todos los slots generados deben estar disponibles
    expect(slots.length).toBeGreaterThan(0);
    expect(slots.every((s) => s.available)).toBe(true);

    // El primer slot debería ser 08:00 (inicio de jornada)
    expect(slots[0].time).toBe('08:00');

    // El último slot de 30 min debería ser 17:30
    // (17:30 + 30 min = 18:00, que es exactamente workEnd)
    const ultimoSlot = slots[slots.length - 1];
    expect(ultimoSlot.time).toBe('17:30');
  });

  it('debe marcar como no disponible un slot que está en la lista de ocupados', () => {
    // Arrange
    const fecha = '2026-07-20';
    const slotsOcupados = ['09:00', '09:15']; // estos dos están reservados
    const ahoraFijo = new Date(2026, 6, 20, 6, 0, 0);

    // Act
    const slots = generateTimeSlots(fecha, EVENTO_CONSULTA_30MIN, CONFIG, slotsOcupados, ahoraFijo);

    // Assert
    const slot0900 = slots.find((s) => s.time === '09:00');
    expect(slot0900).toBeDefined();
    expect(slot0900!.available).toBe(false);
  });

  it('debe devolver array vacío si no hay fecha o evento válido (string vacío)', () => {
    // Si la fecha está malformada, generateTimeSlots devuelve []
    // porque new Date() falla y no se generan slots
    const slots = generateTimeSlots(
      '', // fecha inválida
      EVENTO_CONSULTA_30MIN,
      CONFIG,
      [],
      new Date(2026, 6, 1, 6, 0, 0)
    );
    expect(slots).toHaveLength(0);
  });
});

// ─── Tests de formatTime12h ───────────────────────────────────────────────────

describe('formatTime12h()', () => {
  it('debe convertir 14:30 a 2:30 PM', () => {
    const resultado = formatTime12h('14:30');
    expect(resultado.time).toBe('2:30');
    expect(resultado.period).toBe('PM');
  });

  it('debe convertir 08:00 a 8:00 AM', () => {
    const resultado = formatTime12h('08:00');
    expect(resultado.time).toBe('8:00');
    expect(resultado.period).toBe('AM');
  });
});

// ─── Tests de formatDateKey ───────────────────────────────────────────────────

describe('formatDateKey()', () => {
  it('debe formatear una fecha al formato YYYY-MM-DD', () => {
    const fecha = new Date(2026, 3, 15); // 15 de abril 2026
    expect(formatDateKey(fecha)).toBe('2026-04-15');
  });
});
