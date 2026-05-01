import Navigation from '@/components/Navigation';

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#000' }}>
      <Navigation />
      
      <section style={{ padding: '8rem 0 5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <h2 className="section-title">The Legend <br/> <span className="text-gradient">DJ SAMBAT</span></h2>
              <div style={{ fontSize: '1rem', lineHeight: '1.8', color: '#aaa' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  Born in the heart of the state, DJ Sambat has risen to become the undisputed "Vibe Controller" of the region. With over a decade of experience behind the decks and on the mic, he has redefined what it means to be a modern entertainer.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  His unique style blends seamless transitions with high-octane hypeman energy, creating an atmosphere that is both luxury and high-vibe. Whether it's a 5,000-person concert or an exclusive private wedding, Sambat ensures every guest feels the rhythm.
                </p>
              </div>
              
              <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-gold)' }}>500+</h4>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#666' }}>EVENTS COMPLETED</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-gold)' }}>1M+</h4>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#666' }}>FANS REACHED</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card" style={{ height: 'clamp(300px, 60vh, 600px)', padding: '0', overflow: 'hidden' }}>
              <img src="/hero-bg.png" alt="DJ Sambat" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
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
