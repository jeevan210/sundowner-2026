import React, { useState, useEffect } from 'react';

export default function Navbar({ onOpenTickets, onOpenAdmin, currentTheme, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);

    const handleFs = () => {
      setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFs);
    document.addEventListener('webkitfullscreenchange', handleFs);

    const handlePrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('fullscreenchange', handleFs);
      document.removeEventListener('webkitfullscreenchange', handleFs);
      window.removeEventListener('beforeinstallprompt', handlePrompt);
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

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice && choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      handleToggleFullscreen();
    }
  };

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`top-navbar ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="navbar-container">
        
        {/* Brand Logo with Striped Sunset Icon */}
        <a 
          href="#hero" 
          onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }} 
          className="brand-block"
        >
          {/* Retro striped sunset sun */}
          <div className="sun-retro-icon">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <defs>
                <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFA600" />
                  <stop offset="100%" stopColor="#FF4A00" />
                </linearGradient>
                <mask id="sunMask">
                  <circle cx="18" cy="18" r="16" fill="white" />
                  <rect x="0" y="15" width="36" height="2" fill="black" />
                  <rect x="0" y="19" width="36" height="2.5" fill="black" />
                  <rect x="0" y="23.5" width="36" height="3" fill="black" />
                  <rect x="0" y="28.5" width="36" height="3.5" fill="black" />
                </mask>
              </defs>
              <circle cx="18" cy="18" r="16" fill="url(#sunGrad)" mask="url(#sunMask)" />
            </svg>
          </div>

          <div className="brand-text-stack">
            <span className="brand-title">SUNDOWNER</span>
            <span className="brand-year">2026</span>
          </div>
        </a>

        {/* Center Nav Links (Clean without About) */}
        <nav className="desktop-nav">
          <ul className="nav-item-list">
            <li>
              <a 
                className={`nav-btn-link ${activeTab === 'hero' ? 'active' : ''}`}
                onClick={() => handleNavClick('hero')}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                className={`nav-btn-link ${activeTab === 'highlights' ? 'active' : ''}`}
                onClick={() => handleNavClick('highlights')}
              >
                Highlights
              </a>
            </li>
            <li>
              <a 
                className={`nav-btn-link ${activeTab === 'showcase' ? 'active' : ''}`}
                onClick={() => handleNavClick('showcase')}
              >
                Resort & Pool
              </a>
            </li>
            <li>
              <a 
                className={`nav-btn-link ${activeTab === 'snapshot' ? 'active' : ''}`}
                onClick={() => handleNavClick('snapshot')}
              >
                Snapshot
              </a>
            </li>
            <li>
              <a 
                className={`nav-btn-link ${activeTab === 'rules' ? 'active' : ''}`}
                onClick={() => handleNavClick('rules')}
              >
                Rules
              </a>
            </li>
            <li>
              <a 
                className={`nav-btn-link ${activeTab === 'venue' ? 'active' : ''}`}
                onClick={() => handleNavClick('venue')}
              >
                Venue
              </a>
            </li>
          </ul>
        </nav>

        {/* Right CTA Button, Theme Switcher & Admin Access */}
        <div className="navbar-right">
          
          {/* Theme Switcher Button */}
          <button
            type="button"
            className="btn-theme-toggle"
            onClick={onToggleTheme}
            title={`Switch to ${currentTheme === 'sunset' ? 'Midnight Neon' : 'Sunset Gold'} Theme`}
          >
            {currentTheme === 'sunset' ? (
              <><i className="fa-solid fa-moon"></i> <span>Midnight</span></>
            ) : (
              <><i className="fa-solid fa-sun text-orange"></i> <span>Sunset</span></>
            )}
          </button>

          {/* Primary Book Pass CTA */}
          <button 
            type="button" 
            className="btn-book-pass"
            onClick={onOpenTickets}
          >
            <i className="fa-solid fa-ticket"></i> Book Pass
          </button>

          {/* Mobile Hamburger */}
          <button 
            type="button" 
            className="mobile-hamburger" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>

      </div>

      {/* Mobile Slide Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <a className="mobile-link" onClick={() => handleNavClick('hero')}>
            <i className="fa-solid fa-house text-orange"></i> Home
          </a>
          <a className="mobile-link" onClick={() => handleNavClick('highlights')}>
            <i className="fa-solid fa-star text-orange"></i> Highlights
          </a>
          <a className="mobile-link" onClick={() => handleNavClick('showcase')}>
            <i className="fa-solid fa-water-ladder text-orange"></i> Resort & Pool Showcase
          </a>
          <a className="mobile-link" onClick={() => handleNavClick('snapshot')}>
            <i className="fa-solid fa-clipboard-list text-orange"></i> Event Snapshot
          </a>
          <a className="mobile-link" onClick={() => handleNavClick('rules')}>
            <i className="fa-solid fa-shield-halved text-orange"></i> Rules & Guidelines
          </a>
          <a className="mobile-link" onClick={() => handleNavClick('venue')}>
            <i className="fa-solid fa-location-dot text-orange"></i> Venue & Team
          </a>

          {/* Mobile Theme Toggle & Fullscreen App Action */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginTop: '0.5rem' }}>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={onToggleTheme}
              style={{ justifyContent: 'center' }}
            >
              {currentTheme === 'sunset' ? (
                <><i className="fa-solid fa-moon"></i> Midnight Vibe</>
              ) : (
                <><i className="fa-solid fa-sun text-orange"></i> Sunset Vibe</>
              )}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => { setMobileMenuOpen(false); handleInstallApp(); }}
              style={{ justifyContent: 'center' }}
              title="Fullscreen App View"
            >
              <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'} text-orange`}></i> {isFullscreen ? 'Exit Full' : 'Full Screen'}
            </button>
          </div>

          <button 
            type="button" 
            className="btn-book-pass" 
            style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center', padding: '0.85rem' }}
            onClick={() => { setMobileMenuOpen(false); onOpenTickets(); }}
          >
            <i className="fa-solid fa-ticket"></i> Book Pass Now
          </button>
        </div>
      )}
    </header>
  );
}
