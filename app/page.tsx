'use client';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import Services from '@/components/Services';
import MusicPlayer from '@/components/MusicPlayer';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main style={{ background: '#050505', color: '#fff' }}>
      <Navigation />
      <Hero />
      <Services />
      <Gallery />
      <MusicPlayer />
      
      {/* Booking CTA Section */}
      <section className="section-padding" style={{ background: '#080808' }}>
        <div className="container">
          <div className="glass-card" style={{ padding: '5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at center, rgba(0, 242, 255, 0.05) 0%, transparent 70%)',
              zIndex: 0
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, marginBottom: '1.5rem' }}>
                IGNITE YOUR <span className="neon-text-blue">EVENT</span>
              </h2>
              <p style={{ color: '#ccc', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                Ready to take your party to the next level? Book the ultimate hypeman and vibe controller for an unforgettable experience.
              </p>
              <a href="/auth" className="btn-neon-blue">INQUIRE NOW</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
