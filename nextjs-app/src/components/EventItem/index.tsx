'use client';
/**
 * EventItem
 * Cubre: US_008, US_014 — Baja lógica (Activo / Inactivo)
 */
interface Props {
  eventName: string;
  initialStatus: 'Activo' | 'Inactivo';
  role: 'invitado' | 'admin';
}

export default function EventItem({ eventName, initialStatus, role }: Props) {
  if (role === 'invitado' && initialStatus === 'Inactivo') {
    return null;
  }

  return (
    <div className="event-row">
      <span>{eventName}</span>
      {role === 'admin' && (
        <span className={`badge ${initialStatus === 'Activo' ? 'badge-active' : 'badge-inactive'}`}>
          {initialStatus}
        </span>
      )}
    </div>
  );
}
