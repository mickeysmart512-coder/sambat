'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TourDates() {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tours').then(res => res.json())
      .then(tourData => {
        if (Array.isArray(tourData)) {
          setTours(tourData.slice(0, 5));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section id="tour" className="section-padding ambient-stage" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="badge-live" style={{ marginBottom: '0.8rem' }}>
              <span className="pulse-dot" />
              <span>LIVE SHOW SCHEDULE</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', marginBottom: '0.8rem', letterSpacing: '-0.02em' }}>
              UPCOMING <span className="neon-text-gold">TOUR DATES</span>
            </h2>
            <p style={{ color: '#aaa', fontSize: '1.05rem', maxWidth: '580px' }}>
              Experience the energy live in your city. Catch DJ Sambat headlining clubs, festivals, and arena stages.
            </p>
          </div>
          <Link href="/tour" className="btn-neon-outline">
            VIEW ALL DATES &amp; VENUES →
          </Link>
        </div>

        {/* Tour List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tours.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: '#888', fontSize: '1.1rem' }}>New tour dates are being finalized for this season. Check back shortly!</p>
            </div>
          ) : (
            tours.map((tour, idx) => {
              const isSoldOut = (tour.status || '').toUpperCase() === 'SOLD OUT';
              const isLive = (tour.status || '').toUpperCase() === 'LIVE';

              return (
                <div 
                  key={tour.id || idx} 
                  className="glass-card" 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                    gap: '1.5rem',
                    padding: '2rem 2.5rem',
                    alignItems: 'center',
                    borderLeft: isSoldOut ? '4px solid #555' : isLive ? '4px solid #10B981' : '4px solid var(--accent-gold)'
                  }}
                >
                  <div>
                    <span style={{ 
                      color: isSoldOut ? '#888' : 'var(--accent-gold)', 
                      fontWeight: 900, 
                      fontSize: '1.1rem',
                      letterSpacing: '0.08em'
                    }}>
                      {tour.date}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem' }}>2026 TOUR</div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>{tour.city}</h3>
                    <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.2rem' }}>{tour.venue}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{
                      padding: '0.35rem 0.9rem',
                      borderRadius: '50px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      background: isSoldOut ? 'rgba(255,255,255,0.06)' : isLive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 242, 255, 0.12)',
                      color: isSoldOut ? '#888' : isLive ? '#10B981' : 'var(--accent-blue)',
                      border: isSoldOut ? '1px solid #444' : isLive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(0, 242, 255, 0.3)'
                    }}>
                      {tour.status}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <Link
                      href="/tour"
                      aria-disabled={isSoldOut}
                      className={isSoldOut ? "btn-secondary" : "btn-primary"}
                      style={{ 
                        padding: '0.7rem 2rem', 
                        fontSize: '0.8rem',
                        opacity: isSoldOut ? 0.5 : 1,
                        cursor: isSoldOut ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isSoldOut ? "SOLD OUT" : "GET PASSES"}
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
