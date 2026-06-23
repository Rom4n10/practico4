'use client';
/**
 * EventCreationForm
 * Cubre: US_003, US_004, US_006 — Creación de Tipos de Eventos
 */
import { useState } from 'react';

const DURATION_PRESETS = [15, 30, 45, 60] as const;
type DurationUnit = 'minutes' | 'hours';

export interface EventFormInitialData {
  id?: string;
  name?: string;
  description?: string;
  duration?: number;
}

interface Props {
  existingNames?: string[];
  initialData?: EventFormInitialData;
  onSave?: (data: { name: string; description: string; duration: number }) => void;
}

function initFromMinutes(minutes: number) {
  if ((DURATION_PRESETS as readonly number[]).includes(minutes)) {
    return {
      preset: minutes,
      custom: false,
      unit: 'minutes' as DurationUnit,
      value: String(minutes),
    };
  }
  if (minutes % 60 === 0 && minutes >= 60) {
    return {
      preset: null,
      custom: true,
      unit: 'hours' as DurationUnit,
      value: String(minutes / 60),
    };
  }
  return {
    preset: null,
    custom: true,
    unit: 'minutes' as DurationUnit,
    value: String(minutes),
  };
}

export default function EventCreationForm({
  existingNames = [],
  initialData,
  onSave,
}: Props) {
  const initialDuration = initialData?.duration
    ? initFromMinutes(initialData.duration)
    : { preset: null, custom: false, unit: 'minutes' as DurationUnit, value: '' };

  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [status, setStatus] = useState<'Activo' | 'Borrador' | null>(null);
  const [error, setError] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(initialDuration.preset);
  const [customMode, setCustomMode] = useState(initialDuration.custom);
  const [durationUnit, setDurationUnit] = useState<DurationUnit>(initialDuration.unit);
  const [durationValue, setDurationValue] = useState(initialDuration.value);

  function getDurationMinutes(): number | null {
    if (selectedPreset && !customMode) return selectedPreset;
    if (!durationValue.trim()) return null;
    const val = Number(durationValue);
    if (!Number.isFinite(val) || val <= 0) return null;
    return durationUnit === 'hours' ? val * 60 : val;
  }

  function selectPreset(minutes: number) {
    setCustomMode(false);
    setSelectedPreset(minutes);
    setDurationUnit('minutes');
    setDurationValue(String(minutes));
  }

  function selectCustom() {
    setCustomMode(true);
    setSelectedPreset(null);
    if (!durationValue) setDurationValue('');
  }

  function handleDurationValueChange(value: string) {
    setDurationValue(value);
    setSelectedPreset(null);
    setCustomMode(true);
  }

  function handleSave() {
    setError('');
    setStatus(null);

    const trimmedName = name.trim();
    const duplicate = existingNames.some(
      (existing) =>
        existing.toLowerCase() === trimmedName.toLowerCase() &&
        existing.toLowerCase() !== (initialData?.name ?? '').toLowerCase()
    );

    if (duplicate) {
      setError('Ya hay un evento con este nombre. Por favor elija uno diferente');
      return;
    }

    const durationMinutes = getDurationMinutes();

    if (trimmedName && durationMinutes) {
      setStatus('Activo');
      onSave?.({ name: trimmedName, description: description.trim(), duration: durationMinutes });
    } else {
      setStatus('Borrador');
    }
  }

  const showCustomInputs = customMode || selectedPreset === null;

  return (
    <div className="card">
      {error && (
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      )}
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
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          className="form-textarea input"
          rows={3}
          placeholder="Describe este tipo de evento..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <span className="form-label">Duración estimada</span>
        <div className="duration-selector">
          {DURATION_PRESETS.map((minutes) => (
            <button
              key={minutes}
              type="button"
              className={`duration-pill ${!customMode && selectedPreset === minutes ? 'active' : ''}`}
              onClick={() => selectPreset(minutes)}
            >
              {minutes === 60 ? '1 hora' : `${minutes} min`}
            </button>
          ))}
          <button
            type="button"
            className={`duration-pill ${customMode ? 'custom-active' : ''}`}
            onClick={selectCustom}
          >
            Personalizada
          </button>
        </div>

        <div className={`duration-custom-input ${showCustomInputs ? 'visible' : ''}`}>
          <select
            className="form-select"
            aria-label="Unidad de tiempo"
            value={durationUnit}
            onChange={(e) => setDurationUnit(e.target.value as DurationUnit)}
          >
            <option value="minutes">Minutos</option>
            <option value="hours">Horas</option>
          </select>
          <label htmlFor="duracion" className="sr-only">
            Duración
          </label>
          <input
            id="duracion"
            className="form-input input"
            type="number"
            min={durationUnit === 'hours' ? 1 : 5}
            max={durationUnit === 'hours' ? 8 : 480}
            step={durationUnit === 'hours' ? 1 : 5}
            placeholder={durationUnit === 'hours' ? 'Horas' : 'Min'}
            value={durationValue}
            onChange={(e) => handleDurationValueChange(e.target.value)}
          />
          <span className="text-sm text-secondary">
            {durationUnit === 'hours' ? 'horas' : 'minutos'}
          </span>
        </div>
      </div>

      <button type="button" className="btn btn-primary" onClick={handleSave}>
        Guardar
      </button>
    </div>
  );
}
