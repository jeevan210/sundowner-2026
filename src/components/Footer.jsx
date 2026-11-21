import React from 'react';

export default function Footer({ onOpenAdmin }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900 }}>
              SUNDOWNER <span className="gradient-text">2026</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              The Sunset. The Music. The Vibe. | 29 Nov 2026 | Orchard Resort, Navge Cross, Belagavi
            </p>
          </div>

          <ul className="footer-nav">
            <li><a onClick={() => scrollTo('hero')} style={{ cursor: 'pointer' }}>Home</a></li>
            <li><a onClick={() => scrollTo('highlights')} style={{ cursor: 'pointer' }}>Highlights</a></li>
            <li><a onClick={() => scrollTo('showcase')} style={{ cursor: 'pointer' }}>Resort Pool</a></li>
            <li><a onClick={() => scrollTo('snapshot')} style={{ cursor: 'pointer' }}>Snapshot</a></li>
            <li><a onClick={() => scrollTo('rules')} style={{ cursor: 'pointer' }}>Rules</a></li>
            <li><a onClick={() => scrollTo('tickets')} style={{ cursor: 'pointer' }}>Book Pass</a></li>
          </ul>
        </div>

        <div className="footer-copyright">
          <div>
            &copy; 2026 Sundowner Event. All rights reserved. Orchard Resort, Navge Cross, Belagavi.
          </div>
          <div>
            <span>Coordinators: Sonika, Arzoo, Krupa &amp; Kuber</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
