'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';


export default function Home() {
  const [tourDates, setTourDates] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/tours')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTourDates(data.slice(0, 4));
        } else {
          console.error('Expected array from /api/tours, got:', data);
          setTourDates([]);
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setTourDates([]);
      });
  }, []);


  return (
    <main>
      <Navigation />
      <Hero />
      
      {/* Tour Section */}
      <section id="tour" style={{ padding: '8rem 0', background: '#000' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
              <h2 className="section-title">Tour <span style={{ color: 'var(--accent-gold)' }}>Dates</span></h2>
              <p style={{ color: '#666' }}>Catch the vibe live in your city.</p>
            </div>
            <Link href="/experiences" style={{ color: 'var(--accent-gold)', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid var(--accent-gold)' }}>VIEW GALLERY</Link>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            {tourDates.map((tour, index) => {
              // Logic for "LIVE" status
              const tourTime = tour.dateTime ? new Date(tour.dateTime).getTime() : 0;
              const currentTime = new Date().getTime();
              const isLive = tourTime > 0 && currentTime >= tourTime && currentTime <= (tourTime + 6 * 60 * 60 * 1000); // 6 hour window
              
              return (
                <div key={index} style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem',
                  padding: '2rem 0',
                  borderBottom: '1px solid var(--glass-border)',
                  alignItems: 'center',
                  transition: 'var(--transition)',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: isLive ? '#4ade80' : 'var(--accent-gold)' }}>
                    {isLive ? '● LIVE NOW' : tour.date}
                  </div>
                  <div style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', fontWeight: 900, letterSpacing: '1px' }}>{tour.city}</div>
                  <div style={{ color: '#888', fontWeight: 500, fontSize: '0.9rem' }}>{tour.venue}</div>
                  <div style={{ textAlign: 'right' }}>
                    <button className={tour.status === "SOLD OUT" ? "btn-secondary" : "btn-primary"} 
                            style={{ 
                              padding: '0.6rem 1.5rem', 
                              fontSize: '0.75rem', 
                              opacity: tour.status === "SOLD OUT" ? 0.5 : 1,
                              background: isLive ? '#4ade80' : '',
                              color: isLive ? '#000' : ''
                            }}>
                      {isLive ? "JOIN VIBE" : tour.status}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      <Gallery />

      {/* About/Vibe Section */}
      <section style={{ padding: '5rem 0', background: 'var(--surface)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}>The <span className="text-gradient">Vibe</span> Controller</h2>
            <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#aaa', marginBottom: '2rem' }}>
              DJ Sambat isn't just a DJ; he's the heartbeat of the party. With an unmatched ability to read the crowd and a voice that commands the room, he transforms every event into a legendary experience. 
              From the biggest clubs in the state to exclusive private galas, Sambat is the name they call when the vibe needs to be perfect.
            </p>
            <button className="btn-secondary" style={{ width: '100%', maxWidth: '200px' }}>Read Full Bio</button>
          </div>
          <div className="glass-card" style={{ height: 'clamp(300px, 50vh, 500px)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
             <div style={{ 
               position: 'absolute', 
               width: '100%', 
               height: '100%', 
               background: 'linear-gradient(45deg, var(--accent-gold) 0%, var(--accent-blue) 100%)',
               opacity: 0.1,
               zIndex: 0
             }} />
             <div style={{ zIndex: 1, textAlign: 'center' }}>
               <h3 style={{ fontSize: '2rem', fontWeight: 900 }}>100+</h3>
               <p style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>SHOWS PER YEAR</p>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>DJ SAMBAT</h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>© 2026 DJ SAMBAT ENTERTAINMENT. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </main>
  );
}
