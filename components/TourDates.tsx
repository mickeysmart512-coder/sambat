'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TourDates() {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tours')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTours(data.slice(0, 5));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section id="tour" className="section-padding" style={{ background: '#000' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5rem' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '1rem' }}>
              UPCOMING <span className="neon-text-gold">TOUR DATES</span>
            </h2>
            <p style={{ color: '#888' }}>Catch the energy live in your city. Premium club nights and festivals.</p>
          </div>
          <Link href="/tour" className="btn-neon-outline" style={{ padding: '0.8rem 1.5rem', fontSize: '0.7rem' }}>VIEW ALL DATES</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {tours.map((tour, idx) => (
            <div key={idx} className="fade-in" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '2rem',
              padding: '2.5rem 0',
              borderBottom: '1px solid var(--glass-border)',
              alignItems: 'center',
              animationDelay: `${idx * 0.1}s`
            }}>
              <div>
                <span style={{ 
                  color: 'var(--accent-gold)', 
                  fontWeight: 900, 
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em'
                }}>{tour.date}</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{tour.city}</h3>
                <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.3rem' }}>{tour.venue}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Link 
                  href={tour.ticketLink || "#"} 
                  className={tour.status === "SOLD OUT" ? "btn-secondary" : "btn-primary"}
                  style={{ 
                    padding: '0.6rem 1.8rem', 
                    fontSize: '0.75rem',
                    opacity: tour.status === "SOLD OUT" ? 0.5 : 1,
                    pointerEvents: tour.status === "SOLD OUT" ? 'none' : 'auto'
                  }}
                >
                  {tour.status === "SOLD OUT" ? "SOLD OUT" : "GET TICKETS"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
