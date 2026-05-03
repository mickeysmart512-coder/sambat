'use client';
import { useState, useEffect } from 'react';

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide preloader when window is fully loaded
    const handleLoad = () => setLoading(false);
    
    if (document.readyState === 'complete') {
      setLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
      // Fallback: hide after 3 seconds anyway
      const timer = setTimeout(() => setLoading(false), 3000);
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(timer);
      };
    }
  }, []);

  if (!loading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      transition: 'opacity 0.5s ease',
    }}>
      <div style={{ position: 'relative', width: '100px', height: '100px' }}>
        {/* Animated Rings */}
        <div className="ring" style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '2px solid transparent',
          borderTopColor: 'var(--accent-gold)',
          borderRadius: '50%',
          animation: 'spin 1.5s linear infinite'
        }} />
        <div className="ring" style={{
          position: 'absolute',
          width: '80%',
          height: '80%',
          top: '10%',
          left: '10%',
          border: '2px solid transparent',
          borderTopColor: 'var(--accent-blue)',
          borderRadius: '50%',
          animation: 'spin-reverse 1s linear infinite'
        }} />
        
        {/* The "S" Logo */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '2.5rem',
          fontWeight: 900,
          color: '#fff',
          textShadow: '0 0 20px var(--accent-gold)',
          animation: 'pulse 1s ease-in-out infinite alternate'
        }}>
          S
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes pulse {
          from { transform: translate(-50%, -50%) scale(0.9); opacity: 0.7; }
          to { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
