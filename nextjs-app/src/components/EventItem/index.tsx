'use client';
/**
 * EventItem
 * Cubre: US_008, US_014 — Baja lógica (Activo / Inactivo)
 *
 * Props:
 *   eventName:     nombre del evento
 *   initialStatus: 'Activo' | 'Inactivo'
 *   role:          'invitado' | 'admin'
 *
 * Lógica:
 *   - role="invitado" + Inactivo → no renderiza nada (baja lógica oculta el evento)
 *   - role="invitado" + Activo   → muestra el nombre del evento
 *   - role="admin"   + cualquier → siempre muestra nombre y etiqueta de estado
 */

interface Props {
  eventName: string;
  initialStatus: 'Activo' | 'Inactivo';
  role: 'invitado' | 'admin';
}

export default function EventItem({ eventName, initialStatus, role }: Props) {
  // US_008: Baja lógica — los invitados no ven eventos inactivos
  if (role === 'invitado' && initialStatus === 'Inactivo') {
    return null;
  }

  return (
    <div>
      <span>{eventName}</span>

      {/* US_014: El admin ve la etiqueta de estado siempre */}
      {role === 'admin' && (
        <span>{initialStatus}</span>
      )}
    </div>
  );
}
