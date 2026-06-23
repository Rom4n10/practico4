'use client';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function AdminShell({ children }: Props) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">H</div>
          <span className="sidebar-brand-text">HealthAdmin</span>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-title">Principal</span>
          <a className="sidebar-nav-item active" href="/">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="sidebar-nav-label">Tipos de Evento</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="sidebar-toggle" aria-label="Colapsar menú">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="main-header">
          <div className="header-left">
            <div className="header-breadcrumb">
              <span>Gestión</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span className="current">Tipos de Evento</span>
            </div>
          </div>
          <div className="header-right">
            <button type="button" className="header-icon-btn" title="Personalizar interfaz">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
              </svg>
            </button>
            <button type="button" className="header-icon-btn" title="Notificaciones">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="notification-dot" />
            </button>
            <div className="header-user">
              <div className="header-user-avatar">DM</div>
              <div className="header-user-info">
                <span className="header-user-name">Dr. Martínez</span>
                <span className="header-user-role">Administrador</span>
              </div>
            </div>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
