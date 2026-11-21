import React, { useState, useRef } from 'react';
import Interactive3DCard from './Interactive3DCard';

export default function ResortGallery({ onOpenPhoto }) {
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const videos = [
    {
      id: 'pool-pan',
      title: 'Poolside & Lawn Panorama',
      subtitle: 'Crystal swimming pool & tropical coconut groves',
      src: '/assets/resort-pool-overview.mp4',
      badge: '4K Panorama',
      tag: 'Swimming Pool'
    },
    {
      id: 'lawn-tour',
      title: 'Resort Lawn Walkthrough',
      subtitle: 'Walking across manicured lawns and palm canopies',
      src: '/assets/resort-lawn-tour.mp4',
      badge: 'Lawn Tour',
      tag: 'Open Grounds'
    },
    {
      id: 'villa-tour',
      title: 'Villa & Sun Deck Walkthrough',
      subtitle: 'Full HD tour of private villas, poolside deck & cabanas',
      src: '/assets/resort-villa-tour.mp4',
      badge: 'Full Walkthrough',
      tag: 'Villa & Deck'
    },
    {
      id: 'poolside-ambiance',
      title: 'Sunset Poolside Ambiance',
      subtitle: 'Golden hour light reflecting across the pool deck',
      src: '/assets/resort-poolside.mp4',
      badge: 'Evening Vibe',
      tag: 'Pool Deck'
    }
  ];

  const photos = [
    {
      title: 'Crystal Daytime Pool',
      subtitle: 'Clear waters surrounded by tropical flora & palms',
      src: '/assets/resort-pool-day.jpg',
      tag: 'Day View'
    },
    {
      title: 'Dusk Golden Hour',
      subtitle: 'Warm sunset sky casting amber hues across the water',
      src: '/assets/resort-pool-night.jpg',
      tag: 'Sunset View'
    },
    {
      title: 'Illuminated Night Deck',
      subtitle: 'Modern pathway spotlights along the water’s edge',
      src: '/assets/resort-pool-lights.jpg',
      tag: 'Night Ambiance'
    },
    {
      title: 'Sundowner DJ Stage Concept',
      subtitle: 'Official fiery sunset DJ stage visual & sound arena',
      src: '/assets/sundowner-poster.jpg',
      tag: 'Stage Concept'
    }
  ];

  const currentVid = videos[selectedVideoIdx];

  const handleSelectVideo = (idx) => {
    setSelectedVideoIdx(idx);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    }
  };

  return (
    <section className="section" id="showcase">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-head">
          <div className="section-tag">
            <i className="fa-solid fa-film"></i> Resort Visual Experience
          </div>
          <h2 className="section-h2">ORCHARD RESORT <span className="gradient-text">& VENUE TOUR</span></h2>
          <p className="section-desc">
            Explore authentic high-definition video walkthroughs and curated photography of the actual pool, lush lawns, and sunset views.
          </p>
        </div>

        {/* Master Media Theater Card */}
        <div className="showcase-cinema-wrap box-3d-depth">
          
          <div className="cinema-main-grid">
            
            {/* Left: Cinema Video Screen with Ambient Backlight */}
            <div className="cinema-player-col">
              <div className="cinema-screen-container">
                {/* Ambient back-glow reacting to video */}
                <div className="cinema-ambient-glow"></div>

                <div className="cinema-video-frame">
                  <video 
                    ref={videoRef}
                    key={currentVid.src}
                    src={currentVid.src}
                    playsInline
                    autoPlay
                    loop
                    muted={isMuted}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="cinema-video-element"
                  />

                  {/* Top Overlay Badge Bar */}
                  <div className="cinema-overlay-top">
                    <span className="cinema-badge-live">
                      <span className="pulse-dot"></span> 4K RESORT FOOTAGE
                    </span>
                    <span className="cinema-badge-loc">
                      <i className="fa-solid fa-location-dot"></i> Belagavi
                    </span>
                  </div>

                  {/* Sleek Custom Controls Bar */}
                  <div className="cinema-overlay-controls">
                    <div className="cinema-ctrl-left">
                      <button 
                        type="button" 
                        className="cinema-ctrl-btn" 
                        onClick={togglePlay}
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                      </button>

                      <button 
                        type="button" 
                        className="cinema-ctrl-btn" 
                        onClick={toggleMute}
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
                      </button>

                      <div className="cinema-video-info">
                        <span className="cinema-info-title">{currentVid.title}</span>
                        <span className="cinema-info-sub">{currentVid.subtitle}</span>
                      </div>
                    </div>

                    <div className="cinema-ctrl-right">
                      <button 
                        type="button" 
                        className="cinema-ctrl-btn" 
                        onClick={handleFullscreen}
                        title="Fullscreen"
                      >
                        <i className="fa-solid fa-expand"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Selector Rail (Interactive Cards) */}
              <div className="cinema-selector-rail">
                {videos.map((vid, idx) => {
                  const isActive = idx === selectedVideoIdx;
                  return (
                    <button
                      key={vid.id}
                      type="button"
                      className={`cinema-selector-card ${isActive ? 'is-active' : ''}`}
                      onClick={() => handleSelectVideo(idx)}
                    >
                      <div className="sel-card-play-icon">
                        <i className={`fa-solid ${isActive && isPlaying ? 'fa-waveform-lines fa-play' : 'fa-play'}`}></i>
                      </div>
                      <div className="sel-card-info">
                        <span className="sel-card-title">{vid.title}</span>
                        <span className="sel-card-badge">{vid.badge}</span>
                      </div>
                      {isActive && (
                        <div className="sel-active-indicator">
                          <span className="indicator-bar"></span>
                          <span className="indicator-text">Playing</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Curated Photo Lookbook (4 Cards) */}
            <div className="cinema-photo-col">
              <div className="photo-lookbook-header">
                <h3><i className="fa-solid fa-images text-orange"></i> Curated Gallery</h3>
                <span className="photo-lookbook-count">4 Photos &bull; Tap to Expand</span>
              </div>

              <div className="photo-lookbook-grid">
                {photos.map((photo, idx) => (
                  <Interactive3DCard key={idx} maxTilt={8} depth={12} className="lookbook-card-wrap">
                    <div 
                      className="lookbook-photo-card"
                      onClick={() => onOpenPhoto(photo.src)}
                      title={`Click to enlarge ${photo.title}`}
                    >
                      <img src={photo.src} alt={photo.title} loading="lazy" />
                      
                      <div className="lookbook-card-scrim"></div>

                      <div className="lookbook-card-content layer-3d-float">
                        <span className="lookbook-tag">{photo.tag}</span>
                        <h4 className="lookbook-title">{photo.title}</h4>
                        <p className="lookbook-sub">{photo.subtitle}</p>
                      </div>

                      <span className="lookbook-zoom-pill">
                        <i className="fa-solid fa-magnifying-glass-plus"></i> View Full
                      </span>
                    </div>
                  </Interactive3DCard>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
