import React from 'react';

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        
        <div className="section-head">
          <div className="section-tag">
            <i className="fa-solid fa-fire"></i> Welcome to the Vibe
          </div>
          <h2 className="section-h2">EXPERIENCE THE <span className="gradient-text">SUNDOWNER!</span></h2>
          <p className="section-desc">
            A golden hour celebration where sunset hues meet electrifying beats and poolside luxury.
          </p>
        </div>

        <div className="about-grid">
          {/* Main Narrative Card */}
          <div className="about-text-card">
            <p>
              <strong>It's time to take a break, enjoy the sunset and spend an evening filled with fun and entertainment!</strong>
            </p>
            <p>
              Sundowner 2026 brings you an exciting combination of poolside fun, great music, refreshing mocktails and delicious snacks. Enjoy your evening with friends, relax by the pool and get ready to dance to your favourite beats.
            </p>
            <p>
              Whether you want to enjoy the pool or groove to the music, there's something for everyone! Come, celebrate the evening and make memories with us.
            </p>
          </div>

          {/* Clean Feature Column */}
          <div className="about-feature-column">
            <div className="about-feature-item">
              <div className="about-feature-icon"><i className="fa-solid fa-sun"></i></div>
              <div className="about-feature-info">
                <h4>Golden Hour Sunset Atmosphere</h4>
                <p>Scenic poolside backdrop surrounded by natural palm trees at Orchard Resort.</p>
              </div>
            </div>

            <div className="about-feature-item">
              <div className="about-feature-icon"><i className="fa-solid fa-music"></i></div>
              <div className="about-feature-info">
                <h4>Sensational Sound & Beats</h4>
                <p>Curated sound track, bass-thumping audio and an energetic crowd atmosphere.</p>
              </div>
            </div>

            <div className="about-feature-item">
              <div className="about-feature-icon"><i className="fa-solid fa-champagne-glasses"></i></div>
              <div className="about-feature-info">
                <h4>All-Inclusive Refreshments</h4>
                <p>Complimentary high tea, fresh mocktails, hot pakoras & crispy golden fries.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
