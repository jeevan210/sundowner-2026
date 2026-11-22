import React, { useState, useEffect } from 'react';

export default function MobileBottomBar({ onRegisterClick }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFs = () => {
      setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFs);
    document.addEventListener('webkitfullscreenchange', handleFs);
    return () => {
      document.removeEventListener('fullscreenchange', handleFs);
      document.removeEventListener('webkitfullscreenchange', handleFs);
    };
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    } catch (e) {
      console.log('Fullscreen request prevented:', e.message);
    }
  };

  return (
    <div className="mobile-bottom-bar">
      <div className="mobile-bar-meta">
        <span className="mobile-bar-title">SUNDOWNER 2026</span>
        <span className="mobile-bar-sub">&#8377;699 &bull; 29 Nov &bull; Resort</span>
      </div>
      <div className="mobile-bar-actions">
        <button
          type="button"
          onClick={handleToggleFullscreen}
          className="mobile-bar-call-btn"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen App Mode"}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen App Mode"}
          style={{ background: 'rgba(255, 94, 0, 0.15)', borderColor: 'rgba(255, 94, 0, 0.35)', color: '#FF8A00' }}
        >
          <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
        </button>
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
