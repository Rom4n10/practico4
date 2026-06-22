/**
 * Tests: US_017, US_018 — Calendario y Turnos
 * Componente: BookingCalendar
 *
 * US_017: El calendario no muestra horarios cronológicamente pasados.
 * US_018: Si un día no tiene turnos disponibles se muestra un aviso.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import BookingCalendar from '../../components/BookingCalendar';

const mockSlots = [
  { time: '08:00', isPast: true,  available: true  }, // pasado → no debe mostrarse
  { time: '14:00', isPast: false, available: true  }, // disponible → debe mostrarse
  { time: '15:00', isPast: false, available: false }, // ocupado → no visible
];

describe('US_017, US_018: Calendario y Turnos', () => {

  it('13. Omite renderizar horarios que ya pasaron cronológicamente', () => {
    render(<BookingCalendar slots={mockSlots} date="2026-04-19" />);

    // El slot pasado NO debe renderizarse
    expect(screen.queryByText('08:00')).not.toBeInTheDocument();

    // El slot futuro disponible SÍ debe renderizarse
    expect(screen.getByText('14:00')).toBeInTheDocument();
  });

  it('14. Muestra los horarios disponibles al seleccionar un día válido', () => {
    render(<BookingCalendar slots={mockSlots} date="2026-04-19" />);

    // Simular click en el día 19
    fireEvent.click(screen.getByText('19'));

    // El horario disponible sigue visible tras seleccionar el día
    expect(screen.getByText('14:00')).toBeInTheDocument();
  });

  it('15. Muestra aviso cuando el día no tiene ningún turno disponible', () => {
    // Solo hay un slot y está ocupado (available: false)
    render(
      <BookingCalendar
        slots={[{ time: '15:00', isPast: false, available: false }]}
        date="2026-04-20"
      />
    );

    fireEvent.click(screen.getByText('20'));

    expect(screen.getByText(/no hay turnos disponibles/i)).toBeInTheDocument();
  });

});
