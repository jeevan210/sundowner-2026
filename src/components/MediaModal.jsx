import React, { useEffect } from 'react';

export default function MediaModal({ mediaSrc, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (mediaSrc) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [mediaSrc, onClose]);

  if (!mediaSrc) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="modal-close-x" 
          onClick={onClose} 
          aria-label="Close modal view"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <img src={mediaSrc} alt="Sundowner Event Preview" />
      </div>
    </div>
  );
}

