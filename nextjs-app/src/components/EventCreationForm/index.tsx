'use client';
/**
 * EventCreationForm
 * Cubre: US_003, US_004, US_006 — Creación de Tipos de Eventos
 */
import { useState } from 'react';

interface Props {
  existingNames?: string[];
}

export default function EventCreationForm({ existingNames = [] }: Props) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState<'Activo' | 'Borrador' | null>(null);
  const [error, setError] = useState('');

  function handleSave() {
    setError('');
    setStatus(null);

    if (existingNames.includes(name.trim())) {
      setError('Ya hay un evento con este nombre. Por favor elija uno diferente');
      return;
    }

    if (name.trim() && duration.trim()) {
      setStatus('Activo');
    } else {
      setStatus('Borrador');
    }
  }

  return (
    <div className="card">
      {error && <p className="alert alert-error" role="alert">{error}</p>}
      {status && <p className="status-message">Estado: {status}</p>}

      <div className="form-group">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="duracion">Duración</label>
        <input
          id="duracion"
          className="input"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      <button type="button" className="btn btn-primary" onClick={handleSave}>
        Guardar
      </button>
    </div>
  );
}
