'use client';

import AppNav from '@/components/AppNav';
import EventCreationForm from '@/components/EventCreationForm';
import EventDashboard from '@/components/EventDashboard';
import EventItem from '@/components/EventItem';
import { EVENT_TYPES_DATA } from '@/data/mockData';
import { toDashboardEvents } from '@/lib/adapters';

const dashboardEvents = toDashboardEvents(EVENT_TYPES_DATA);
const existingNames = EVENT_TYPES_DATA.map((event) => event.name);

export default function AdminPage() {
  return (
    <>
      <AppNav />
      <main className="app-main">
        <h1 className="app-page-title">Administración de tipos de evento</h1>
        <p className="app-subtitle">
          Gestioná el catálogo de servicios, filtros y estados de cada tipo de evento.
        </p>

        <section className="app-section">
          <div className="app-section-header">
            <h2>Panel de eventos</h2>
          </div>
          <EventDashboard events={dashboardEvents} />
        </section>

        <section className="app-section">
          <div className="app-section-header">
            <h2>Crear tipo de evento</h2>
          </div>
          <EventCreationForm existingNames={existingNames} />
        </section>

        <section className="app-section">
          <div className="app-section-header">
            <h2>Estado de eventos (vista admin)</h2>
          </div>
          <ul className="app-list">
            {EVENT_TYPES_DATA.map((event) => (
              <li key={event.id}>
                <EventItem
                  eventName={event.name}
                  initialStatus={event.status === 'active' ? 'Activo' : 'Inactivo'}
                  role="admin"
                />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
