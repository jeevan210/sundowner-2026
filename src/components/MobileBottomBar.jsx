import React from 'react';

export default function MobileBottomBar({ onRegisterClick }) {
  return (
    <div className="mobile-bottom-bar">
      <div className="mobile-bar-meta">
        <span className="mobile-bar-title">SUNDOWNER 2026</span>
        <span className="mobile-bar-sub">&#8377;699 &bull; 29 Nov &bull; Resort</span>
      </div>
      <div className="mobile-bar-actions">
        <a 
          href="tel:918151090944" 
          className="mobile-bar-call-btn" 
          title="Call Coordinator Sonika"
          aria-label="Call Coordinator Sonika"
        >
          <i className="fa-solid fa-phone"></i>
        </a>
        <button 
          type="button" 
          className="mobile-bar-book-btn btn-pulse" 
          onClick={onRegisterClick}
        >
          <i className="fa-solid fa-ticket"></i>
          <span>Book Pass &bull; &#8377;699</span>
        </button>
      </div>
    </div>
  );
}
