/**
 * Tests: US_009, US_010 — Filtrado de tipos de eventos
 * Componente: EventDashboard
 *
 * US_009: Se puede filtrar la tabla por estado (Activo/Inactivo).
 * US_010: Existe un botón para limpiar los filtros y restaurar la vista original.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import EventDashboard from '../../components/EventDashboard';

const mockEvents = [
  { id: 1, name: 'Reunión',  status: 'Activo',   duration: 30 },
  { id: 2, name: 'Consulta', status: 'Inactivo',  duration: 60 },
];

describe('US_009, US_010: Filtrado de tipos de eventos', () => {

  it('7. Filtra la tabla mostrando únicamente los resultados coincidentes', () => {
    render(<EventDashboard events={mockEvents} />);

    fireEvent.change(screen.getByLabelText(/estado/i), { target: { value: 'Activo' } });

    expect(screen.getByText('Reunión')).toBeInTheDocument();
    expect(screen.queryByText('Consulta')).not.toBeInTheDocument();
  });

  it('8. Muestra "Sin resultados encontrados" si el filtro no devuelve nada', () => {
    render(<EventDashboard events={mockEvents} />);

    // Duración 120 no existe en ningún evento del mock
    fireEvent.change(screen.getByLabelText(/duración/i), { target: { value: '120' } });

    expect(screen.getByText(/sin resultados encontrados/i)).toBeInTheDocument();
  });

  it('9. El botón "Limpiar Filtros" resetea la vista a la lista original completa', () => {
    render(<EventDashboard events={mockEvents} />);

    // Filtrar primero
    fireEvent.change(screen.getByLabelText(/estado/i), { target: { value: 'Activo' } });

    // Limpiar filtros
    fireEvent.click(screen.getByRole('button', { name: /limpiar filtros/i }));

    // Ambos eventos deben estar presentes
    expect(screen.getByText('Reunión')).toBeInTheDocument();
    expect(screen.getByText('Consulta')).toBeInTheDocument();
  });

});
