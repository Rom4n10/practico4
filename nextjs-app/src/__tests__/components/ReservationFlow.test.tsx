/**
 * Tests: US_020, US_022, US_023 — Flujo de Reservas y Concurrencia
 * Componente: ReservationFlow
 *
 * US_020: Un turno bloqueado temporalmente no puede seleccionarse de nuevo.
 * US_022: Al confirmar una reserva exitosa se muestra el modal de confirmación.
 * US_023: Si hubo colisión de concurrencia se muestra alerta y se aborta.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import ReservationFlow from '../../components/ReservationFlow';

describe('US_020, US_022, US_023: Flujo de Reservas y Concurrencia', () => {

  it('16. Bloquea el turno en el front-end impidiendo que se seleccione de nuevo', () => {
    render(<ReservationFlow isLockedTemp={true} />);

    // El botón del turno debe estar deshabilitado
    const slotButton = screen.getByRole('button', { name: '10:00' });
    expect(slotButton).toBeDisabled();
  });

  it('17. Muestra el modal de confirmación exitosa con los datos de la cita', () => {
    render(
      <ReservationFlow
        success={true}
        eventName="Masaje"
        date="2026-04-19"
        time="14:00"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /aceptar/i }));

    expect(screen.getByText(/se ha confirmado con éxito/i)).toBeInTheDocument();
  });

  it('18. Aborta y muestra alerta si hubo colisión de concurrencia al guardar', () => {
    render(<ReservationFlow concurrencyConflict={true} />);

    fireEvent.click(screen.getByRole('button', { name: /aceptar/i }));

    expect(
      screen.getByText(/este horario ya fue reservado. por favor, seleccione otro/i)
    ).toBeInTheDocument();
  });

});
