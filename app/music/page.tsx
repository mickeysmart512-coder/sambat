'use client';
import Navigation from '@/components/Navigation';
import MusicPlayer from '@/components/MusicPlayer';

export default function MusicPage() {
  return (
    <main style={{ background: '#050505', minHeight: '100vh' }}>
      <Navigation />
      <div style={{ paddingTop: '8rem' }}>
        <MusicPlayer />
      </div>
      
      {/* Featured Drop Section */}
      <section className="section-padding" style={{ background: '#080808' }}>
        <div className="container">
          <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', padding: '4rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>
                CUSTOM <span className="neon-text-blue">DROPS</span> & JINGLES
              </h2>
              <p style={{ color: '#888', marginBottom: '2rem', lineHeight: 1.8 }}>
                Need that signature Sambat energy for your brand or event? I offer professional voice-over drops and energy-charged jingles tailored to your vibe.
              </p>
              <button className="btn-neon-blue">INQUIRE NOW</button>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
              <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                Drop Sample Player Coming Soon...
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
