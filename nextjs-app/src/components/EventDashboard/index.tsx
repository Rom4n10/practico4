'use client';
/**
 * EventDashboard
 * Cubre: US_009, US_010 — Filtrado de tipos de eventos
 *
 * Props:
 *   events: lista de eventos a mostrar
 *
 * Lógica:
 *   - Filtro por estado ("Activo" | "Inactivo")
 *   - Filtro por duración (número exacto en minutos)
 *   - "Sin resultados encontrados" si ningún evento pasa los filtros
 *   - Botón "Limpiar Filtros" resetea todos los filtros
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
  const [statusFilter, setStatusFilter]     = useState('');
  const [durationFilter, setDurationFilter] = useState('');

  // Aplicar filtros
  const filtered = events.filter((e) => {
    if (statusFilter   && e.status !== statusFilter)          return false;
    if (durationFilter && e.duration !== Number(durationFilter)) return false;
    return true;
  });

  function clearFilters() {
    setStatusFilter('');
    setDurationFilter('');
  }

  return (
    <div>
      {/* Filtro por estado */}
      <div>
        <label htmlFor="estado">Estado</label>
        <select
          id="estado"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>

      {/* Filtro por duración */}
      <div>
        <label htmlFor="duracion">Duración</label>
        <input
          id="duracion"
          type="number"
          value={durationFilter}
          onChange={(e) => setDurationFilter(e.target.value)}
          placeholder="Minutos"
        />
      </div>

      {/* Botón limpiar */}
      <button type="button" onClick={clearFilters}>
        Limpiar Filtros
      </button>

      {/* Lista de eventos o mensaje vacío */}
      {filtered.length === 0 ? (
        <p>Sin resultados encontrados</p>
      ) : (
        <ul>
          {filtered.map((e) => (
            <li key={e.id}>{e.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
