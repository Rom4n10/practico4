'use client';
/**
 * EventCreationForm
 * Cubre: US_003, US_004, US_006 — Creación de Tipos de Eventos
 *
 * Props:
 *   existingNames: lista de nombres ya existentes para detectar duplicados
 *
 * Lógica de estado:
 *   - nombre + duración completos → status "Activo"
 *   - falta duración → status "Borrador"
 *   - nombre duplicado → muestra error, no guarda
 */
import { useState } from 'react';

interface Props {
  existingNames?: string[];
}

export default function EventCreationForm({ existingNames = [] }: Props) {
  const [name, setName]         = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus]     = useState<'Activo' | 'Borrador' | null>(null);
  const [error, setError]       = useState('');

  function handleSave() {
    setError('');
    setStatus(null);

    // US_006: Detectar nombre duplicado
    if (existingNames.includes(name.trim())) {
      setError('Ya existe un evento con este nombre. Por favor elija uno diferente');
      return;
    }

    // US_003: Activo si nombre + duración presentes
    // US_004: Borrador si falta duración
    if (name.trim() && duration.trim()) {
      setStatus('Activo');
    } else {
      setStatus('Borrador');
    }
  }

  return (
    <div>
      {/* Mensaje de error por duplicado */}
      {error && <p role="alert">{error}</p>}

      {/* Estado resultante tras guardar */}
      {status && <p>Estado: {status}</p>}

      <div>
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="duracion">Duración</label>
        <input
          id="duracion"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      <button type="button" onClick={handleSave}>
        Guardar
      </button>
    </div>
  );
}
