'use client';
/**
 * EventDashboard
 * Cubre: US_009, US_010 — Filtrado de tipos de eventos
 */
import { useState } from 'react';

interface EventItem {
  id: number;
  name: string;
  status: string;
  duration: number;
}

interface Props {
  events: EventItem[];
}

export default function EventDashboard({ events }: Props) {
  const [statusFilter, setStatusFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');

  const filtered = events.filter((e) => {
    if (statusFilter && e.status !== statusFilter) return false;
    if (durationFilter && e.duration !== Number(durationFilter)) return false;
    return true;
  });

  function clearFilters() {
    setStatusFilter('');
    setDurationFilter('');
  }

  return (
    <div className="card">
      <div className="filter-panel">
        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            className="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="duracion">Duración</label>
          <input
            id="duracion"
            className="input"
            type="number"
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            placeholder="Minutos"
          />
        </div>

        <button type="button" className="btn" onClick={clearFilters}>
          Limpiar Filtros
        </button>
      </div>

      {filtered.length === 0 ? (
        <p>Sin resultados encontrados</p>
      ) : (
        <ul className="event-list">
          {filtered.map((e) => (
            <li key={e.id} className="event-list-item">
              <div className="event-row">
                <span>{e.name}</span>
                <span className={`badge ${e.status === 'Activo' ? 'badge-active' : 'badge-inactive'}`}>
                  {e.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
