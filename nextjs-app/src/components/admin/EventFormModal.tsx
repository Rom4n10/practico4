'use client';

import EventCreationForm from '@/components/EventCreationForm';

interface Props {
  open: boolean;
  onClose: () => void;
  existingNames: string[];
}

export default function EventFormModal({ open, onClose, existingNames }: Props) {
  if (!open) return null;

  return (
    <div className="modal-backdrop form-modal open" role="dialog" aria-modal="true" aria-labelledby="form-modal-title">
      <div className="modal modal-lg">
        <div className="modal-header">
          <h2 id="form-modal-title" className="modal-title">Nuevo Tipo de Evento</h2>
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
            <EventCreationForm existingNames={existingNames} />
          </div>
        </div>
      </div>
    </div>
  );
}
