'use client';
import Link from 'next/link';

export default function Hero() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 75% 25%, rgba(0, 242, 255, 0.12) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.08) 0%, transparent 60%), #070709',
      paddingTop: '6rem'
    }}>
      {/* Background Lighting & Image Effects */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `linear-gradient(to bottom, rgba(7, 7, 9, 0.4) 0%, rgba(7, 7, 9, 0.85) 60%, #070709 100%), url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        opacity: 0.55,
        zIndex: 1
      }} />

      {/* Grid Pattern Mesh */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2, padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '960px' }}>
          
          {/* Status & Availability Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <div className="badge-live">
              <span className="pulse-dot" />
              <span>Available For 2026/2027 Bookings</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              • Nigeria & Destination Events
            </span>
          </div>

          {/* Main Stage Heading */}
          <h1 style={{
            fontSize: 'clamp(3rem, 8.5vw, 7.5rem)',
            lineHeight: 0.95,
            marginBottom: '1.8rem',
            letterSpacing: '-0.03em'
          }}>
            THE ULTIMATE <br />
            <span className="text-gradient">HYPEMAN</span> &amp; <span className="neon-text-blue">MC</span>
          </h1>

          {/* Tagline & Elevator Pitch */}
          <p style={{
            fontSize: 'clamp(1.1rem, 2.2vw, 1.4rem)',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            maxWidth: '680px',
            lineHeight: 1.7,
            fontWeight: 400
          }}>
            Meet <strong style={{ color: '#fff', fontWeight: 800 }}>DJ Sambat</strong> — the official vibe controller transforming weddings, festivals, club shutdowns, and VIP celebrations into unforgettable, high-octane spectacles.
          </p>

          {/* Event Quick Tags */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {[
              "✨ Luxury Weddings", 
              "🔥 Club Nights", 
              "🎤 Concerts & Festivals", 
              "🍸 Corporate Galas", 
              "🎉 Campus Rallies"
            ].map((tag, idx) => (
              <span key={idx} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.4rem 1rem',
                borderRadius: '50px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#ddd'
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Main Action CTAs */}
          <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/booking" className="btn-neon-blue">
              <span>⚡ BOOK FOR YOUR EVENT</span>
            </Link>
            <Link href="/tour" className="btn-neon-outline">
              <span>🎟 GET TOUR TICKETS</span>
            </Link>
            <Link href="/music" style={{
              color: 'var(--accent-gold)',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textDecoration: 'none',
              marginLeft: '0.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <span>PLAY MIXES &amp; DROPS →</span>
            </Link>
          </div>
        </div>

        {/* Social Proof & Numbers Bar */}
        <div style={{
          marginTop: '5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem',
          paddingTop: '2.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {[
            { stat: "500+", label: "EVENTS POWERED", color: "var(--accent-blue)" },
            { stat: "15+", label: "STATES VISITED", color: "var(--accent-gold)" },
            { stat: "50K+", label: "CROWDS ENERGIZED", color: "var(--accent-pink)" },
            { stat: "100%", label: "TURNUP GUARANTEE", color: "#10B981" }
          ].map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '2.4rem', color: item.color, marginBottom: '0.3rem', fontWeight: 900 }}>
                {item.stat}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#999', fontWeight: 700, letterSpacing: '0.08em' }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
