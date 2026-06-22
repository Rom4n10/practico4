/**
 * Tests 4, 5, 6 — US_015, US_016, US_019: Formulario de Datos del Paciente
 * Componente: GuestDataForm (Paso 3 del flujo de reserva)
 *
 * US_015: El sistema valida el formato del email en tiempo real.
 *         Si el email no tiene formato válido, se muestra un mensaje de error.
 *
 * US_016: El nombre del paciente debe tener al menos 3 caracteres.
 *         Si se ingresa un nombre muy corto, se muestra un mensaje de error.
 *
 * US_019: El botón "Siguiente" permanece deshabilitado hasta que
 *         todos los campos requeridos sean válidos.
 *         Solo se habilita cuando nombre ≥ 3 chars Y email correcto.
 *
 * ¿Por qué estos tests?
 * ─────────────────────
 * El formulario de datos del paciente es el Paso 3 del flujo de reserva.
 * Sin validación correcta, un paciente podría avanzar con datos inválidos,
 * generando reservas sin contacto ni identificación válida.
 * Estas 3 pruebas garantizan que las reglas de negocio se respeten en la UI.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import GuestDataForm from '../../components/GuestDataForm';

describe('US_015, US_016, US_019: Formulario de Datos del Paciente', () => {

  /**
   * Test 4 — US_015
   * Verifica que al ingresar un email con formato incorrecto (sin @),
   * el sistema muestre un mensaje de error en tiempo real.
   */
  it('4. Muestra error si el email ingresado no tiene formato válido', () => {
    // Arrange
    render(<GuestDataForm />);

    // Act — ingresamos un email sin el símbolo @
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'correo-sin-arroba.com' },
    });

    // Assert — debe aparecer el mensaje de error de formato
    expect(
      screen.getByText(/el email no tiene un formato válido/i)
    ).toBeInTheDocument();
  });

  /**
   * Test 5 — US_016
   * Verifica que al ingresar un nombre con menos de 3 caracteres,
   * el sistema muestre un mensaje de error indicando el mínimo requerido.
   */
  it('5. Muestra error si el nombre tiene menos de 3 caracteres', () => {
    // Arrange
    render(<GuestDataForm />);

    // Act — ingresamos un nombre de solo 2 caracteres
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'Jo' },
    });

    // Assert — debe aparecer el mensaje de mínimo de caracteres
    expect(
      screen.getByText(/el nombre debe tener al menos 3 caracteres/i)
    ).toBeInTheDocument();
  });

  /**
   * Test 6 — US_019
   * Verifica que el botón "Siguiente" esté DESHABILITADO al inicio
   * y se HABILITE solo cuando nombre y email son ambos válidos.
   *
   * Este test cubre el "happy path" completo:
   *   inicio → botón deshabilitado
   *   completar nombre válido + email válido → botón habilitado
   */
  it('6. El botón "Siguiente" se habilita solo cuando nombre y email son válidos', () => {
    // Arrange
    render(<GuestDataForm />);

    // Al inicio, el formulario está vacío → botón debe estar deshabilitado
    expect(screen.getByRole('button', { name: /siguiente/i })).toBeDisabled();

    // Act — completamos el nombre con 3+ caracteres
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'María García' },
    });

    // Solo nombre → todavía deshabilitado (falta email)
    expect(screen.getByRole('button', { name: /siguiente/i })).toBeDisabled();

    // Act — completamos el email con formato válido
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'maria@clinica.com' },
    });

    // Assert — ahora sí, ambos campos válidos → botón habilitado
    expect(screen.getByRole('button', { name: /siguiente/i })).not.toBeDisabled();
  });

});
