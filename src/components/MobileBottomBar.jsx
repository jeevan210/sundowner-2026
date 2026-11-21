import React from 'react';

export default function MobileBottomBar({ onRegisterClick }) {
  return (
    <div className="mobile-bottom-bar">
      <div className="mobile-bar-info">
        <span className="mobile-bar-title">SUNDOWNER 2026</span>
        <span className="mobile-bar-sub">29 Nov &bull; Orchard Resort</span>
      </div>
      <button 
        type="button" 
        className="btn btn-primary btn-sm btn-pulse" 
        onClick={onRegisterClick}
      >
        <i className="fa-solid fa-ticket"></i> Book VIP Pass
      </button>
    </div>
  );
}
