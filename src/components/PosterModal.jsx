import React, { useEffect } from 'react';

export default function PosterModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={onClose} 
          aria-label="Close poster view"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <img src="/assets/sundowner-poster.jpg" alt="Sundowner 2026 Poster Full View" />
      </div>
    </div>
  );
}

