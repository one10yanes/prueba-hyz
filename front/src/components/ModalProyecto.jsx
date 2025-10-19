import React from 'react';
import FormularioProyecto from './FormularioProyecto';
import './ModalProyecto.css';

function ModalProyecto({ isOpen, onClose, onAdd, editProyecto, onSaveEdit }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <FormularioProyecto
          onAdd={() => { onAdd(); onClose(); }}
          editProyecto={editProyecto}
          onSaveEdit={(form) => { onSaveEdit(form); onClose(); }}
        />
      </div>
    </div>
  );
}

export default ModalProyecto;
