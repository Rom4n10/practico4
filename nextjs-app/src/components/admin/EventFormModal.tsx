'use client';

import EventCreationForm, { type EventFormInitialData } from '@/components/EventCreationForm';

interface Props {
  open: boolean;
  onClose: () => void;
  existingNames: string[];
  initialData?: EventFormInitialData;
  onSave?: (data: { name: string; description: string; duration: number }) => void;
}

export default function EventFormModal({
  open,
  onClose,
  existingNames,
  initialData,
  onSave,
}: Props) {
  if (!open) return null;

  const isEdit = Boolean(initialData?.id);
  const title = isEdit ? 'Editar Tipo de Evento' : 'Nuevo Tipo de Evento';

  return (
    <div
      className="modal-backdrop form-modal open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal modal-lg">
        <div className="modal-header">
          <h2 id="form-modal-title" className="modal-title">
            {title}
          </h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="form-section">
            <h3 className="form-section-title">Información Básica</h3>
            <EventCreationForm
              key={initialData?.id ?? 'new'}
              existingNames={existingNames}
              initialData={initialData}
              onSave={(data) => {
                onSave?.(data);
                onClose();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
