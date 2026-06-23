'use client';

import { useMemo, useState } from 'react';
import type { EventType } from '@/types';
import { EVENT_TYPES_DATA } from '@/data/mockData';
import { filterEventTypes } from '@/lib/eventTypes';
import { formatDuration, formatEventDate } from '@/lib/format';
import EventFormModal from './EventFormModal';

const MODALITY_LABELS = { presencial: 'Presencial', virtual: 'Virtual', ambas: 'Ambas' } as const;
const CONFIRM_LABELS = { auto: 'Automática', manual: 'Manual' } as const;

export default function EventTypesView() {
  const [events, setEvents] = useState<EventType[]>(EVENT_TYPES_DATA);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [duration, setDuration] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(
    () =>
      filterEventTypes(events, {
        search,
        status,
        duration: duration === 'all' ? 'all' : duration === 'custom' ? 'custom' : Number(duration),
        dateFrom,
        dateTo,
      }),
    [events, search, status, duration, dateFrom, dateTo]
  );

  function toggleStatus(id: string) {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: e.status === 'active' ? 'inactive' : 'active' } : e
      )
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Tipos de Evento</h1>
          <p className="page-subtitle">Administra los tipos de evento disponibles para la agenda médica</p>
        </div>
        <div className="page-actions" style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo Tipo de Evento
          </button>
        </div>
      </div>

      <div className="filters-panel">
        <div className="filters-search">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por nombre o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-divider" />
        <div className="filter-group">
          <span className="filter-label">Estado</span>
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">Duración</span>
          <select className="form-select" value={duration} onChange={(e) => setDuration(e.target.value)}>
            <option value="all">Todas</option>
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="45">45 min</option>
            <option value="60">60 min</option>
            <option value="custom">Personalizada</option>
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">Desde</span>
          <input type="date" className="form-input" style={{ width: 150 }} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className="filter-group">
          <span className="filter-label">Hasta</span>
          <input type="date" className="form-input" style={{ width: 150 }} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </div>

      <div className="results-bar">
        <span className="results-count">
          Mostrando {filtered.length} de {events.length} tipos de evento
        </span>
        <div className="view-toggle">
          <button
            type="button"
            className={`view-toggle-btn ${view === 'table' ? 'active' : ''}`}
            title="Vista tabla"
            onClick={() => setView('table')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${view === 'grid' ? 'active' : ''}`}
            title="Vista tarjetas"
            onClick={() => setView('grid')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>Sin resultados encontrados</p>
        </div>
      ) : view === 'table' ? (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Duración</th>
                <th>Modalidad</th>
                <th>Confirmación</th>
                <th>Estado</th>
                <th>Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="stagger-children">
              {filtered.map((event) => (
                <tr key={event.id} data-id={event.id}>
                  <td>
                    <div className="cell-name">
                      <span className="event-name">{event.name}</span>
                      {event.description && <span className="event-desc">{event.description}</span>}
                    </div>
                  </td>
                  <td>
                    <div className="cell-duration">
                      <svg className="duration-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {formatDuration(event.duration)}
                    </div>
                  </td>
                  <td><span className={`badge badge-${event.modality}`}>{MODALITY_LABELS[event.modality]}</span></td>
                  <td><span className={`badge badge-${event.confirmation}`}>{CONFIRM_LABELS[event.confirmation]}</span></td>
                  <td>
                    <span className={`badge badge-${event.status}`}>
                      <span className="badge-dot" />
                      {event.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td><span className="cell-date">{formatEventDate(event.createdAt)}</span></td>
                  <td>
                    <div className="cell-actions">
                      <button type="button" className="btn btn-ghost btn-icon btn-sm" title="Editar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button type="button" className="btn btn-ghost btn-icon btn-sm" title="Duplicar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                      </button>
                      <button
                        type="button"
                        className={`btn btn-ghost btn-icon btn-sm ${event.status === 'active' ? 'danger-hover' : ''}`}
                        title={event.status === 'active' ? 'Dar de baja' : 'Reactivar'}
                        onClick={() => toggleStatus(event.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="events-grid stagger-children">
          {filtered.map((event) => (
            <div key={event.id} className="event-card" data-id={event.id}>
              <div className="event-card-header">
                <span className={`badge badge-${event.status}`}>
                  <span className="badge-dot" />
                  {event.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <h3 className="event-card-title">{event.name}</h3>
              <p className="event-card-desc">{event.description}</p>
              <div className="event-card-meta">
                <span>{formatDuration(event.duration)}</span>
                <span className={`badge badge-${event.modality}`}>{MODALITY_LABELS[event.modality]}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <EventFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        existingNames={events.map((e) => e.name)}
      />
    </>
  );
}
