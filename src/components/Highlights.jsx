import React from 'react';
import Interactive3DCard from './Interactive3DCard';

export default function Highlights({ onOpenPhoto }) {
  const highlights = [
    {
      id: 'pool',
      image: '/assets/resort-pool-day.jpg',
      badge: '4:00 PM – 6:30 PM',
      icon: 'fa-solid fa-person-swimming',
      title: 'CRYSTAL POOLSIDE OASIS',
      desc: 'Immerse yourself in Orchard Resort’s pristine, crystal-clear swimming pool enveloped by lush coconut palms and tropical breezes.',
      bullets: [
        { icon: 'fa-solid fa-clock', text: 'Pool access open till 6:30 PM' },
        { icon: 'fa-solid fa-shield-halved', text: 'Swimwear strictly compulsory' }
      ]
    },
    {
      id: 'dj',
      image: '/assets/sundowner-poster.jpg',
      badge: 'Sunset till 8:00 PM',
      icon: 'fa-solid fa-compact-disc',
      title: 'ELECTRIFYING DJ ARENA',
      desc: 'Dance from golden dusk into the twilight stars. Bass-thumping drops, high-energy festival sound, and an open-air poolside dance floor.',
      bullets: [
        { icon: 'fa-solid fa-headphones', text: 'Curated DJ sets all evening' },
        { icon: 'fa-solid fa-fire', text: 'Non-stop music till 8:00 PM' }
      ]
    },
    {
      id: 'mocktails',
      image: '/assets/resort-pool-night.jpg',
      badge: '100% Complimentary',
      icon: 'fa-solid fa-martini-glass-citrus',
      title: 'FREE-FLOW MOCKTAILS',
      desc: 'Sip on handcrafted botanical infusions and chilled tropical fruit coolers served unlimited throughout the evening to keep you refreshed.',
      bullets: [
        { icon: 'fa-solid fa-circle-check', text: 'Included with every pass' },
        { icon: 'fa-solid fa-glass-water', text: 'Served chilled all evening' }
      ]
    },
    {
      id: 'snacks',
      image: '/assets/resort-pool-lights.jpg',
      badge: 'Fresh & Unlimited',
      icon: 'fa-solid fa-utensils',
      title: 'HIGH TEA & HOT SNACKS',
      desc: 'Feast on complimentary poolside high tea accompanied by mouthwatering evening snacks prepared sizzling hot for all guests.',
      bullets: [
        { icon: 'fa-solid fa-bowl-food', text: 'Sizzling hot assorted pakoras' },
        { icon: 'fa-solid fa-check', text: 'Crispy golden French fries' }
      ]
    }
  ];

  return (
    <section className="section" id="highlights">
      <div className="container">
        
        {/* Section Head */}
        <div className="section-head">
          <div className="section-tag">
            <i className="fa-solid fa-sparkles"></i> Curated Experience
          </div>
          <h2 className="section-h2">SIGNATURE EVENT <span className="gradient-text">HIGHLIGHTS</span></h2>
          <p className="section-desc">
            Crafted for sun-seekers, dance music lovers, and unforgettable poolside golden-hour memories.
          </p>
        </div>

        {/* 4 Balanced Cards with Media Header & Sleek Typography */}
        <div className="highlights-grid">
          {highlights.map((item) => (
            <Interactive3DCard key={item.id} maxTilt={8} depth={15} className="hl-card-3d-wrap">
              <div className="hl-card">
                
                {/* Media Banner with Scrim & Click to Zoom */}
                <div 
                  className="hl-card-media" 
                  onClick={() => onOpenPhoto(item.image)}
                  title="Click to view full photo"
                >
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div className="hl-media-scrim"></div>
                  <span className="hl-media-badge">
                    <i className="fa-solid fa-sparkle"></i> {item.badge}
                  </span>
                  <span className="hl-media-zoom-btn">
                    <i className="fa-solid fa-expand"></i>
                  </span>
                </div>

                {/* Card Body */}
                <div className="hl-card-body">
                  <div className="hl-card-icon layer-3d-float">
                    <i className={item.icon}></i>
                  </div>
                  
                  <h3 className="hl-card-title layer-3d-float">{item.title}</h3>
                  <p className="hl-card-desc">{item.desc}</p>
                  
                  <ul className="hl-bullets layer-3d-float">
                    {item.bullets.map((b, idx) => (
                      <li key={idx}>
                        <i className={`${b.icon} text-orange`}></i>
                        <span>{b.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </Interactive3DCard>
          ))}
        </div>

      </div>
    </section>
  );
}
