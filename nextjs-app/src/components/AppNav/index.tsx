import Link from 'next/link';

export default function AppNav() {
  return (
    <nav className="app-nav" aria-label="Navegación principal">
      <Link href="/" className="app-nav-brand">
        <span className="app-nav-logo" aria-hidden="true">H</span>
        HealthAdmin
      </Link>
      <div className="app-nav-links">
        <Link href="/">Inicio</Link>
        <Link href="/admin">Administración</Link>
        <Link href="/reservas">Reservas</Link>
      </div>
    </nav>
  );
}
