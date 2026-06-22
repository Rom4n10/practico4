/**
 * Tests: US_003, US_004, US_006 — Creación de Tipos de Eventos
 * Componente: EventCreationForm
 *
 * US_003: Un evento creado con todos los campos obligatorios queda en estado Activo.
 * US_004: Si faltan campos obligatorios (duración), el evento queda como Borrador.
 * US_006: No se puede crear un evento con nombre duplicado.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import EventCreationForm from '../../components/EventCreationForm';

describe('US_003, US_004, US_006: Creación de Tipos de Eventos', () => {

  it('1. Crea un evento en estado Activo si todos los campos obligatorios están llenos', () => {
    render(<EventCreationForm />);

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Consulta General' } });
    fireEvent.change(screen.getByLabelText(/duración/i), { target: { value: '30' } });
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    expect(screen.getByText(/estado: activo/i)).toBeInTheDocument();
  });

  it('2. Guarda como Borrador si falta la duración o modalidad', () => {
    render(<EventCreationForm />);

    // Solo se llena el nombre — falta duración
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Consulta Incompleta' } });
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    expect(screen.getByText(/estado: borrador/i)).toBeInTheDocument();
  });

  it('3. Frena la carga y muestra error al detectar un nombre duplicado', () => {
    render(<EventCreationForm existingNames={['Terapia Física']} />);

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Terapia Física' } });
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    expect(
      screen.getByText(/ya hay un evento con este nombre. por favor elija uno diferente/i)
    ).toBeInTheDocument();
  });

});
