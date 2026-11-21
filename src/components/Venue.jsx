import React from 'react';
import Interactive3DCard from './Interactive3DCard';

export default function Venue({ onRegisterClick }) {
  const coordinators = [
    { name: 'Sonika', phoneDisplay: '+91\u00A081510\u00A090944', phoneRaw: '918151090944', initial: 'S', role: 'Event Coordinator' },
    { name: 'Arzoo', phoneDisplay: '+91\u00A06362\u00A0172106', phoneRaw: '916362172106', initial: 'A', role: 'Event Coordinator' },
    { name: 'Krupa', phoneDisplay: '+91\u00A074834\u00A001240', phoneRaw: '917483401240', initial: 'K', role: 'Event Coordinator' },
    { name: 'Kuber', phoneDisplay: '+91\u00A078998\u00A024069', phoneRaw: '917899824069', initial: 'K', role: 'Event Coordinator' }
  ];

  return (
    <section className="section" id="venue">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-head">
          <div className="section-tag">
            <i className="fa-solid fa-compass"></i> Location & Team
          </div>
          <h2 className="section-h2">VENUE & <span className="gradient-text">COORDINATION</span></h2>
          <p className="section-desc">
            Nestled along Chorla Road, Orchard Resort provides the ultimate poolside sanctuary. Reach out to our dedicated coordinators for any queries.
          </p>
        </div>

        <div className="venue-clean-grid">
          
          {/* Venue Details with 3D Tilt */}
          <Interactive3DCard maxTilt={8} depth={15} className="venue-3d-wrap">
            <div className="venue-info-box">
              <div className="venue-card-badge-top layer-3d-float">
                <span className="card-badge">
                  <i className="fa-solid fa-hotel"></i> Official Venue Partner
                </span>
                <span className="venue-timing-tag">
                  <i className="fa-solid fa-clock"></i> 4:00 PM – 8:00 PM
                </span>
              </div>

              <h3 className="layer-3d-float venue-title-h3">
                <i className="fa-solid fa-location-dot text-orange"></i> Orchard Resort
              </h3>
              
              <div className="venue-loc-badge layer-3d-float">
                <p>Navge Cross, Chorla Road, Belagavi, Karnataka</p>
              </div>

              <p className="venue-narrative-p layer-3d-float">
                Surrounded by verdant coconut groves and rolling tropical landscapes, Orchard Resort features a tranquil open-air pool deck, private cabanas, and lawn spaces tailored for an extraordinary golden-hour gathering.
              </p>

              <div className="venue-action-row layer-3d-float">
                <a 
                  href="https://maps.google.com/?q=Orchard+Resort+Navge+Cross+Chorla+Road+Belagavi" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary btn-3d-depth" 
                  style={{ width: '100%' }}
                >
                  <i className="fa-solid fa-map-location-dot"></i> Get Directions on Google Maps <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.72rem' }}></i>
                </a>
              </div>
            </div>
          </Interactive3DCard>

          {/* Coordinators with 3D Tilt */}
          <Interactive3DCard maxTilt={8} depth={15} className="venue-3d-wrap">
            <div className="coord-info-box">
              <div className="venue-card-badge-top layer-3d-float">
                <span className="card-badge">
                  <i className="fa-solid fa-users"></i> Host Team
                </span>
                <span className="venue-timing-tag">
                  <i className="fa-solid fa-headset text-orange"></i> Direct Support
                </span>
              </div>

              <h3 className="layer-3d-float venue-title-h3">
                <i className="fa-solid fa-user-shield text-orange"></i> Guest Coordinators
              </h3>

              <div className="coord-list-stack">
                {coordinators.map((c, i) => (
                  <div key={i} className="coord-item-row layer-3d-float">
                    <div className="coord-left-meta">
                      <div className="coord-avatar">{c.initial}</div>
                      <div className="coord-info-col">
                        <div className="coord-name">{c.name}</div>
                        <div className="coord-phone-text">
                          <i className="fa-solid fa-phone"></i> {c.phoneDisplay}
                        </div>
                      </div>
                    </div>
                    <div className="coord-actions-wrap">
                      <a 
                        href={`tel:${c.phoneRaw}`}
                        className="coord-wa-pill coord-call-pill"
                        title={`Call ${c.name}`}
                      >
                        <i className="fa-solid fa-phone"></i> Call
                      </a>
                      <a 
                        href={`https://wa.me/${c.phoneRaw}?text=Hi%20${c.name},%20I%20have%20a%20question%20about%20Sundowner%202026`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="coord-wa-pill"
                        title={`Chat with ${c.name} on WhatsApp`}
                      >
                        <i className="fa-brands fa-whatsapp"></i> WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem' }} className="layer-3d-float">
                <button 
                  type="button" 
                  onClick={onRegisterClick} 
                  className="btn btn-primary btn-3d-depth" 
                  style={{ width: '100%' }}
                >
                  <i className="fa-solid fa-ticket"></i> Reserve Your Event Pass
                </button>
              </div>
            </div>
          </Interactive3DCard>

        </div>

      </div>
    </section>
  );
}
