'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function Hero() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    checkUser();
  }, []);

  return (
    <section style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      overflow: 'hidden',
      background: '#000'
    }}>
      {/* Cinematic Background Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 1
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '900px' }}>
          <p className="fade-in neon-text-blue" style={{ fontWeight: 800, letterSpacing: '0.3em', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            THE STATE'S FINEST
          </p>
          <h1 className="fade-in" style={{ 
            fontSize: 'clamp(3.5rem, 10vw, 8rem)', 
            lineHeight: 0.9, 
            marginBottom: '2rem',
            fontWeight: 900
          }}>
            DJ <span className="neon-text-gold">SAMBAT</span>
          </h1>
          <p className="fade-in" style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.5rem)', 
            color: '#ccc', 
            marginBottom: '3rem',
            maxWidth: '600px',
            lineHeight: 1.6
          }}>
            Hypeman • Party Viber • Vibe Controller.<br/>
            <span style={{ color: '#fff', fontWeight: 600 }}>Bringing the heat to every stage, every club, every moment.</span>
          </p>
          
          <div className="fade-in" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href={user ? "/booking" : "/auth"} className="btn-neon-blue">BOOK THE EXPERIENCE</Link>
            <Link href="/experiences" className="btn-neon-outline">WATCH LIVE</Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="fade-in" style={{ 
          marginTop: '6rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '3rem',
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '3rem'
        }}>
          <div>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>100+</h3>
            <p style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600, letterSpacing: '0.1em' }}>SHOWS PER YEAR</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>15+</h3>
            <p style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600, letterSpacing: '0.1em' }}>CITIES VISITED</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-pink)', marginBottom: '0.5rem' }}>50K+</h3>
            <p style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600, letterSpacing: '0.1em' }}>FANS ENERGIZED</p>
          </div>
        </div>
      </div>
    </section>
  );
}
