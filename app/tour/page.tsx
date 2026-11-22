'use client';
import Navigation from '@/components/Navigation';
import { useState, useEffect } from 'react';
import TicketCheckout from '@/components/TicketCheckout';

export default function TourPage() {
  const [tours, setTours] = useState<any[]>([]);
  const [selectedTour, setSelectedTour] = useState<any>(null);

  useEffect(() => {
    fetch('/api/tours')
      .then(res => res.json())
      .then(data => setTours(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

  }, []);

  const handleTicketClick = (tour: any) => {
    if (tour.status === 'SOLD OUT') return;
    setSelectedTour(tour);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#000' }}>
      <Navigation />
      
      <section style={{ padding: '10rem 0 5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 className="section-title">The <span className="text-gradient">Vibe Tour</span> 2026</h2>
            <p style={{ color: '#888', fontSize: '1.2rem' }}>Catch the energy live in a city near you. VIP passes & guest lists.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {tours.length > 0 ? tours.map((tour, index) => {
              const isSoldOut = tour.status === 'SOLD OUT';
              return (
                <div key={index} className="glass-card" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1.5rem',
                  padding: '2.5rem',
                  alignItems: 'center',
                  transition: 'var(--transition)',
                  borderLeft: isSoldOut ? '3px solid #666' : '3px solid var(--accent-gold)'
                }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-gold)' }}>{tour.date}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '1px' }}>{tour.city}</div>
                  <div style={{ color: '#aaa', fontWeight: 500, fontSize: '1.1rem' }}>{tour.venue}</div>
                  <div style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => handleTicketClick(tour)}
                      disabled={isSoldOut}
                      className={isSoldOut ? "btn-secondary" : "btn-primary"} 
                      style={{ 
                        padding: '0.8rem 2.5rem', 
                        fontSize: '0.9rem', 
                        opacity: isSoldOut ? 0.5 : 1,
                        cursor: isSoldOut ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isSoldOut ? 'SOLD OUT' : 'GET TICKETS'}
                    </button>
                  </div>
                </div>
              );
            }) : (
              <p style={{ textAlign: 'center', color: '#666', fontSize: '1.3rem', padding: '5rem' }}>NO UPCOMING DATES ANNOUNCED YET. CHECK BACK SOON!</p>
            )}
          </div>
        </div>
      </section>

      {selectedTour && <TicketCheckout tour={selectedTour} onClose={() => setSelectedTour(null)} />}
      {/* Footer */}
      <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--glass-border)', textAlign: 'center', background: '#000' }}>
        <div className="container">
          <h2 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', fontWeight: 900 }}>DJ SAMBAT</h2>
          <p style={{ color: '#666', fontSize: '0.8rem' }}>© 2026 DJ SAMBAT ENTERTAINMENT. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </main>
  );
}
