import React, { useRef, useState } from 'react';

/**
 * Interactive3DCard
 * Provides realistic 60fps 3D mouse tilt physics, depth layering,
 * and a dynamic specular glare reflection following cursor movement.
 */
export default function Interactive3DCard({ 
  children, 
  className = '', 
  style = {}, 
  maxTilt = 10, 
  depth = 15, 
  glare = true,
  onClick,
  ...props 
}) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(${depth}px)`
    );

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: 0.32,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 65%)`
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
    setGlareStyle({ opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`interactive-3d-card ${className} ${isHovered ? 'card-3d-active' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        ...style,
        transform: transformStyle || undefined,
        transformStyle: 'preserve-3d',
        transition: isHovered 
          ? 'transform 0.08s ease-out, box-shadow 0.2s ease, border-color 0.2s ease' 
          : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease, border-color 0.3s ease'
      }}
      {...props}
    >
      {glare && (
        <div 
          className="card-3d-glare" 
          style={{
            ...glareStyle,
            transition: isHovered ? 'opacity 0.15s ease' : 'opacity 0.4s ease'
          }} 
        />
      )}
      <div className="card-3d-inner">
        {children}
      </div>
    </div>
  );
}

