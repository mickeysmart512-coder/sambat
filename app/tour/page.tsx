'use client';
import Navigation from '@/components/Navigation';
import { useState, useEffect } from 'react';

export default function TourPage() {
  const [tours, setTours] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/tours')
      .then(res => res.json())
      .then(data => setTours(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#000' }}>
      <Navigation />
      
      <section style={{ padding: '10rem 0 5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 className="section-title">The <span className="text-gradient">Vibe Tour</span> 2026</h2>
            <p style={{ color: '#888', fontSize: '1.2rem' }}>Catch the energy live in a city near you.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tours.length > 0 ? tours.map((tour, index) => (
              <div key={index} className="glass-card" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 2fr 1fr',
                padding: '2.5rem',
                alignItems: 'center',
                transition: 'var(--transition)',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{tour.date}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '1px' }}>{tour.city}</div>
                <div style={{ color: '#888', fontWeight: 500, fontSize: '1.1rem' }}>{tour.venue}</div>
                <div style={{ textAlign: 'right' }}>
                  <button className={tour.status === "SOLD OUT" ? "btn-secondary" : "btn-primary"} 
                          style={{ padding: '0.8rem 2.5rem', fontSize: '0.9rem', opacity: tour.status === "SOLD OUT" ? 0.5 : 1 }}>
                    {tour.status}
                  </button>
                </div>
              </div>
            )) : (
              <p style={{ textAlign: 'center', color: '#444', fontSize: '1.5rem', padding: '5rem' }}>NO UPCOMING DATES ANNOUNCED YET.</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--glass-border)', textAlign: 'center', background: '#000' }}>
        <div className="container">
          <h2 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>DJ SAMBAT</h2>
          <p style={{ color: '#666', fontSize: '0.8rem' }}>© 2026 DJ SAMBAT ENTERTAINMENT. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </main>
  );
}
