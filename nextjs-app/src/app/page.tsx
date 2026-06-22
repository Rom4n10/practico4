import Link from 'next/link';
import AppNav from '@/components/AppNav';

export default function Home() {
  return (
    <>
      <AppNav />
      <main className="app-main">
        <section className="app-hero">
          <h1>HealthAdmin</h1>
          <p>
            Sistema de gestión hospitalaria para administrar tipos de eventos y
            reservar turnos médicos.
          </p>
        </section>

        <section className="app-cards">
          <article className="app-card">
            <h2>Administración</h2>
            <p>Gestioná tipos de eventos, filtros y creación de nuevos registros.</p>
            <Link href="/admin" className="app-card-link">
              Ir a administración →
            </Link>
          </article>

          <article className="app-card">
            <h2>Reservas</h2>
            <p>Consultá turnos disponibles y completá el flujo de reserva.</p>
            <Link href="/reservas" className="app-card-link">
              Ir a reservas →
            </Link>
          </article>
        </section>
      </main>
    </>
  );
}
