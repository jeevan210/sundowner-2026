import React from 'react';
import Interactive3DCard from './Interactive3DCard';

export default function Snapshot() {
  const items = [
    { icon: 'fa-solid fa-ticket', label: 'Event', value: 'Sundowner 2026' },
    { icon: 'fa-solid fa-calendar-day', label: 'Date', value: '29 November 2026' },
    { icon: 'fa-solid fa-clock', label: 'Timings', value: '4:00 PM – 8:00 PM' },
    { icon: 'fa-solid fa-location-dot', label: 'Venue', value: 'Orchard Resort, Belagavi' },
    { icon: 'fa-solid fa-water-ladder', label: 'Pool Access', value: 'Until 6:30 PM (Swimwear mandatory)' },
    { icon: 'fa-solid fa-music', label: 'DJ Arena', value: 'Sunset till 8:00 PM' },
    { icon: 'fa-solid fa-headphones', label: 'DJ Lineup', value: 'Curated Guest Lineup (TBA)' },
    { icon: 'fa-solid fa-martini-glass-citrus', label: 'Complimentary Refreshments', value: 'Mocktails, Assorted Pakoras & French Fries' }
  ];

  return (
    <section className="section" id="snapshot">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-head">
          <div className="section-tag">
            <i className="fa-solid fa-clipboard-list"></i> Event Brief
          </div>
          <h2 className="section-h2">EVENT <span className="gradient-text">SNAPSHOT</span></h2>
          <p className="section-desc">
            All key timings, schedule, refreshments, and essentials organized in one clean overview.
          </p>
        </div>

        <div className="snapshot-clean-grid">
          {items.map((item, idx) => (
            <Interactive3DCard key={idx} maxTilt={8} depth={12} className="snap-3d-wrap">
              <div className="snap-card">
                <div className="snap-icon layer-3d-float">
                  <i className={item.icon}></i>
                </div>
                <div className="snap-info layer-3d-float">
                  <h4>{item.label}</h4>
                  <p>{item.value}</p>
                </div>
              </div>
            </Interactive3DCard>
          ))}

          <Interactive3DCard maxTilt={6} depth={12} className="snap-3d-wrap" style={{ gridColumn: '1 / -1' }}>
            <div className="snap-card snap-card-coord">
              <div className="snap-icon layer-3d-float">
                <i className="fa-solid fa-users"></i>
              </div>
              <div className="snap-info layer-3d-float">
                <h4>Event Coordination Team</h4>
                <p className="text-gold">
                  Sonika (+91 81510 90944) &nbsp;&bull;&nbsp; Arzoo (+91 6362-172106) &nbsp;&bull;&nbsp; Krupa (+91 74834 01240) &nbsp;&bull;&nbsp; Kuber (+91 78998 24069)
                </p>
              </div>
            </div>
          </Interactive3DCard>
        </div>

      </div>
    </section>
  );
}
