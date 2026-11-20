'use client';
import Navigation from '@/components/Navigation';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ExperiencesPage() {
  return (
    <main style={{ background: '#070709', minHeight: '100vh', color: '#fff' }}>
      <Navigation />
      <div style={{ paddingTop: '8rem' }}>
        <Gallery />
      </div>

      <section className="section-padding" style={{ background: '#0a0a0f', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="badge-live" style={{ marginBottom: '1rem' }}>
              <span>PROVEN STAGE EXPERIENCE</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900 }}>
              EVENT <span className="neon-text-gold">PORTFOLIO</span>
            </h2>
            <p style={{ color: '#888', maxWidth: '600px', margin: '0.8rem auto 0' }}>
              Select a category to view expected energy levels or reserve your date.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {[
              { id: "club", name: "CLUB NIGHTS & SHUTDOWNS", desc: "Non-stop bangers & hyped crowd synchronization", img: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=2070&auto=format&fit=crop" },
              { id: "wedding", name: "LUXURY WEDDINGS", desc: "Grand bridal entrance & classy high-energy reception", img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop" },
              { id: "corporate", name: "CONCERTS & FESTIVALS", desc: "Stadium audience control & mainstage hosting", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop" },
              { id: "birthday", name: "PRIVATE VIP PARTIES", desc: "Exclusive intimate celebrations & celebrity turnups", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop" }
            ].map((cat, i) => (
              <Link 
                key={i} 
                href={`/booking?eventType=${cat.id}`}
                className="glass-card" 
                style={{ 
                  position: 'relative', 
                  height: '320px', 
                  borderRadius: '20px', 
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '2rem',
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    opacity: 0.45,
                    transition: 'transform 0.5s ease',
                    zIndex: 0
                  }} 
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to top, rgba(7,7,9,0.95) 15%, transparent 80%)',
                  zIndex: 1
                }} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    EXPERIENCE FORMAT
                  </span>
                  <h3 style={{ 
                    color: '#fff',
                    fontWeight: 900, 
                    fontSize: '1.25rem',
                    letterSpacing: '0.04em',
                    margin: '0.3rem 0 0.4rem'
                  }}>{cat.name}</h3>
                  <p style={{ color: '#bbb', fontSize: '0.85rem', marginBottom: '1rem' }}>{cat.desc}</p>
                  <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 800 }}>BOOK THIS FORMAT →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
