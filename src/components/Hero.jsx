import React, { useState, useEffect } from 'react';
import Interactive3DCard from './Interactive3DCard';

const SUNDOWNER_LETTERS = ['S', 'U', 'N', 'D', 'O', 'W', 'N', 'E', 'R'];
const YEAR_DIGITS = ['2', '0', '2', '6'];

export default function Hero({ onOpenTickets }) {
  const [timeLeft, setTimeLeft] = useState({
    days: '08',
    hours: '14',
    mins: '48',
    secs: '24'
  });

  // 3D Falling & Gathering Animation State
  const [animKey, setAnimKey] = useState(0);
  const [isGathered, setIsGathered] = useState(false);

  // Trigger gathering state after falling finishes
  useEffect(() => {
    setIsGathered(false);
    const gatherTimer = setTimeout(() => {
      setIsGathered(true);
    }, 1800);

    return () => clearTimeout(gatherTimer);
  }, [animKey]);

  // Periodic subtle re-gather & light wave every 18 seconds
  useEffect(() => {
    const loopInterval = setInterval(() => {
      setAnimKey(prev => prev + 1);
    }, 18000);
    return () => clearInterval(loopInterval);
  }, []);

  const handleReplayLights = () => {
    setAnimKey(prev => prev + 1);
  };

  useEffect(() => {
    // Target event: 29 November 2026 at 4:00 PM (16:00) IST
    const targetDate = new Date("2026-11-29T16:00:00+05:30").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ days: '00', hours: '00', mins: '00', secs: '00' });
        clearInterval(interval);
        return;
      }

      const pad = (n) => (n < 10 ? '0' + n : String(n));
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: pad(days),
        hours: pad(hours),
        mins: pad(mins),
        secs: pad(secs)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-mockup-section" id="hero">
      {/* Background Media: Desktop Image & Mobile Video */}
      <div className="hero-backdrop-image"></div>
      <div className="hero-backdrop-video-wrap">
        <video 
          className="hero-backdrop-video" 
          src="/assets/10231614-hd_1080_1920_30fps.mp4"
          autoPlay 
          loop 
          muted 
          playsInline
          preload="metadata"
        />
      </div>
      <div className="hero-dark-vignette"></div>

      <div className="hero-main-container">
        
        {/* Left Content Column */}
        <div className="hero-content-column">
          
          {/* Top Date Badge with Subtle Luxury Sheen */}
          <div className="hero-top-badge">
            <i className="fa-regular fa-calendar text-orange"></i>
            <span>29 NOVEMBER 2026 &nbsp;&bull;&nbsp; 4:00 PM – 8:00 PM <span className="hide-on-mobile">&nbsp;&bull;&nbsp; EXCLUSIVE RESORT PARTY</span></span>
          </div>

          {/* Headline Typography: Subtle 3D Falling Lights & Gathering */}
          <div 
            className={`hero-headline-block hero-3d-stage ${isGathered ? 'stage-gathered' : 'stage-falling'}`}
            key={animKey}
            onClick={handleReplayLights}
            title="Click headline to re-ignite subtle 3D lighting"
          >
            {/* SUNDOWNER: Falling Letters in Lights 3D */}
            <h1 className="hero-brand-name hero-3d-letters-container">
              {SUNDOWNER_LETTERS.map((char, index) => {
                const rotVariations = [-14, 10, -8, 12, -10, 8, -12, 10, -6];
                const rot = rotVariations[index % rotVariations.length];
                const delay = 0.06 + index * 0.085;

                return (
                  <span
                    key={`${animKey}-char-${index}`}
                    className="letter-3d-light"
                    style={{
                      '--char-index': index,
                      '--char-rot': `${rot}deg`,
                      '--fall-delay': `${delay.toFixed(3)}s`
                    }}
                  >
                    <span className="letter-inner-glow">{char}</span>
                  </span>
                );
              })}
            </h1>

            {/* 2026: Falling Digits in Warm Sunset Gradient & Gathering */}
            <div className="hero-brand-year-wrapper">
              <div className="hero-brand-year hero-3d-year-container">
                {YEAR_DIGITS.map((digit, index) => {
                  const yearRotVariations = [12, -10, 10, -8];
                  const rot = yearRotVariations[index % yearRotVariations.length];
                  const delay = 0.85 + index * 0.09;

                  return (
                    <span
                      key={`${animKey}-year-${index}`}
                      className="year-digit-3d-light"
                      style={{
                        '--digit-index': index,
                        '--digit-rot': `${rot}deg`,
                        '--fall-delay': `${delay.toFixed(3)}s`
                      }}
                    >
                      <span className="digit-inner-glow">{digit}</span>
                    </span>
                  );
                })}
              </div>
              <div className={`brand-year-glow-streak ${isGathered ? 'streak-ignited' : ''}`}></div>
            </div>
          </div>

          {/* Tagline with Refined Luxury Letter-Spacing */}
          <h2 className="hero-tagline-text">
            THE SUNSET. THE MUSIC. THE VIBE.
          </h2>

          {/* Editorial Narrative Description (Hidden on mobile to let video breathe) */}
          <p className="hero-narrative hide-on-mobile">
            Where golden-hour luxury meets electrifying poolside soundscapes. Escape into an intimate resort sanctuary featuring curated sunset DJ sets, complimentary botanical mocktails, hot high-tea appetizers, and unforgettable dusk memories.
          </p>

          {/* Venue Pill with Refined Glass Border */}
          <div className="hero-venue-pill">
            <i className="fa-solid fa-location-dot text-orange"></i>
            <span><strong>Orchard Resort</strong><span className="hide-on-mobile">, Navge Cross, Chorla Road</span>, Belagavi</span>
          </div>

          {/* Action CTA Buttons */}
          <div className="hero-cta-row">
            <button 
              type="button" 
              className="btn-hero-primary btn-3d-depth" 
              onClick={onOpenTickets}
            >
              <i className="fa-solid fa-ticket"></i> Book Your Pass &bull; &#8377;699
            </button>

            <button 
              type="button" 
              className="btn-hero-secondary btn-3d-depth hide-on-mobile" 
              onClick={() => scrollTo('highlights')}
            >
              <i className="fa-regular fa-compass"></i> View Event Details &nbsp;&rarr;
            </button>
          </div>

          {/* Quick Trust / Feature Chips row (Hidden on mobile) */}
          <div className="hero-trust-chips hide-on-mobile">
            <span className="trust-chip"><i className="fa-solid fa-shield-halved text-orange"></i> Verified Entry Pass</span>
            <span className="trust-chip"><i className="fa-solid fa-qrcode text-orange"></i> Instant WhatsApp QR</span>
            <span className="trust-chip"><i className="fa-solid fa-person-swimming text-orange"></i> Pool Access Included</span>
          </div>

        </div>

        {/* Right Showcase Column: Compact Interactive 3D Countdown & Event Highlights Card */}
        <div className="hero-showcase-column">
          <Interactive3DCard 
            maxTilt={6} 
            depth={15} 
            className="hero-showcase-card-3d"
          >
            <div className="hero-event-showcase-card">
              {/* Card Top Pill */}
              <div className="showcase-card-header layer-3d-float">
                <div className="live-status-pill">
                  <span className="live-dot-pulse"></span>
                  <span>STARTS IN</span>
                </div>
                <span className="showcase-edition-tag">SUNDOWNER 2026</span>
              </div>

              {/* Compact Countdown Digits */}
              <div className="showcase-countdown-wrapper layer-3d-float">
                <div className="sc-cd-col">
                  <span className="sc-digit">{timeLeft.days}</span>
                  <span className="sc-unit">DAYS</span>
                </div>
                <span className="sc-separator">:</span>
                <div className="sc-cd-col">
                  <span className="sc-digit">{timeLeft.hours}</span>
                  <span className="sc-unit">HOURS</span>
                </div>
                <span className="sc-separator">:</span>
                <div className="sc-cd-col">
                  <span className="sc-digit">{timeLeft.mins}</span>
                  <span className="sc-unit">MINS</span>
                </div>
                <span className="sc-separator">:</span>
                <div className="sc-cd-col">
                  <span className="sc-digit">{timeLeft.secs}</span>
                  <span className="sc-unit">SECS</span>
                </div>
              </div>

              {/* Event Key Highlights Mini Pills (Hidden on mobile to keep video visible) */}
              <div className="showcase-perks-compact layer-3d-float hide-on-mobile">
                <div className="sc-perk-pill">
                  <i className="fa-regular fa-clock text-orange"></i>
                  <span>4:00 PM &ndash; 8:00 PM &bull; Pool till 6:30 PM</span>
                </div>
                <div className="sc-perk-pill">
                  <i className="fa-solid fa-martini-glass-citrus text-orange"></i>
                  <span>Free Mocktails & Hot Snacks</span>
                </div>
                <div className="sc-perk-pill">
                  <i className="fa-solid fa-music text-orange"></i>
                  <span>Live Sunset DJ Arena</span>
                </div>
              </div>

              {/* Compact Action Button inside Card */}
              <div className="showcase-action-box layer-3d-float">
                <button 
                  type="button" 
                  className="btn-showcase-book" 
                  onClick={onOpenTickets}
                >
                  <i className="fa-solid fa-ticket"></i>
                  <span>Book Pass &bull; &#8377;699</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
                <div className="showcase-guarantee-note hide-on-mobile">
                  <i className="fa-solid fa-bolt text-orange"></i> Instant WhatsApp QR Pass
                </div>
              </div>

            </div>
          </Interactive3DCard>
        </div>

      </div>

      {/* Glowing Curved Wave Transition along bottom */}
      <div className="hero-bottom-wave-wrapper">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="wave-svg"
        >
          <path 
            d="M0,75 C280,115 540,65 850,90 C1120,112 1320,80 1440,70 L1440,120 L0,120 Z" 
            className="wave-fill-path"
          />
          <path 
            d="M0,75 C280,115 540,65 850,90 C1120,112 1320,80 1440,70" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            filter="url(#neonOrangeGlow)"
            className="wave-neon-line"
          />
          <defs>
            <filter id="neonOrangeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* 5 Bottom Feature Icons Strip (Sleek Refined Luxury Cards) */}
        <div className="hero-feature-icons-strip">
          <div className="feature-icon-item">
            <div className="icon-circle"><i className="fa-solid fa-music"></i></div>
            <div className="icon-label-group">
              <span className="icon-title">Live DJ Music</span>
              <span className="icon-sub">Curated sunset sets</span>
            </div>
          </div>

          <div className="feature-icon-item">
            <div className="icon-circle"><i className="fa-solid fa-water-ladder"></i></div>
            <div className="icon-label-group">
              <span className="icon-title">Poolside Oasis</span>
              <span className="icon-sub">Access till 6:30 PM</span>
            </div>
          </div>

          <div className="feature-icon-item">
            <div className="icon-circle"><i className="fa-solid fa-martini-glass-citrus"></i></div>
            <div className="icon-label-group">
              <span className="icon-title">Complimentary Mocktails</span>
              <span className="icon-sub">Chilled botanical blends</span>
            </div>
          </div>

          <div className="feature-icon-item">
            <div className="icon-circle"><i className="fa-solid fa-utensils"></i></div>
            <div className="icon-label-group">
              <span className="icon-title">Gourmet Snacks</span>
              <span className="icon-sub">Hot pakoras & fries</span>
            </div>
          </div>

          <div className="feature-icon-item">
            <div className="icon-circle"><i className="fa-solid fa-users"></i></div>
            <div className="icon-label-group">
              <span className="icon-title">Sunset Vibe</span>
              <span className="icon-sub">Exclusive resort energy</span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
