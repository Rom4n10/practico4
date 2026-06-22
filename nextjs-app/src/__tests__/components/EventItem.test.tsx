/**
 * Tests: US_008, US_014 — Estados Activo / Inactivo (Baja lógica)
 * Componente: EventItem
 *
 * US_008: Un evento inactivo no aparece en la vista de invitados (baja lógica).
 * US_014: El administrador siempre ve el estado del evento (etiqueta "Inactivo").
 */
import { render, screen } from '@testing-library/react';
import EventItem from '../../components/EventItem';

describe('US_008, US_014: Estados Activo/Inactivo', () => {

  it('10. La baja lógica oculta el evento del menú de invitados', () => {
    // Primero renderizamos Activo para invitado…
    const { container } = render(
      <EventItem eventName="Yoga" initialStatus="Activo" role="invitado" />
    );
    // …luego re-renderizamos como Inactivo en el mismo contenedor
    render(
      <EventItem eventName="Yoga" initialStatus="Inactivo" role="invitado" />,
      { container }
    );

    // El evento NO debe aparecer en el documento para el invitado
    expect(screen.queryByText('Yoga')).not.toBeInTheDocument();
  });

  it('11. Muestra la etiqueta visual "Inactivo" en el panel de administrador', () => {
    render(<EventItem eventName="Yoga" initialStatus="Inactivo" role="admin" />);

    // El admin ve la etiqueta de estado
    expect(screen.getByText(/inactivo/i)).toBeInTheDocument();
  });

  it('12. Reactivar el evento lo vuelve a mostrar en el flujo público', () => {
    // Primero renderizamos como Inactivo para invitado…
    const { container } = render(
      <EventItem eventName="Yoga" initialStatus="Inactivo" role="invitado" />
    );
    // …luego re-renderizamos como Activo (reactivado)
    render(
      <EventItem eventName="Yoga" initialStatus="Activo" role="invitado" />,
      { container }
    );

    // El evento debe volver a ser visible
    expect(screen.getByText('Yoga')).toBeInTheDocument();
  });

});
