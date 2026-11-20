'use client';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import Services from '@/components/Services';
import TourDates from '@/components/TourDates';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ background: '#070709', color: '#fff' }}>
      <Navigation />
      <Hero />
      <Services />
      <Gallery />
      <TourDates />
      
      {/* Booking Call-To-Action Banner */}
      <section className="section-padding" style={{ background: 'linear-gradient(to bottom, #070709 0%, #0d0e14 100%)', position: 'relative' }}>
        <div className="container">
          <div className="glass-card" style={{ 
            padding: '5rem 2.5rem', 
            textAlign: 'center', 
            position: 'relative', 
            overflow: 'hidden',
            border: '1px solid rgba(0, 242, 255, 0.25)',
            boxShadow: '0 0 50px rgba(0, 242, 255, 0.15)'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at center, rgba(0, 242, 255, 0.1) 0%, transparent 70%)',
              zIndex: 0
            }} />
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '750px', margin: '0 auto' }}>
              <div className="badge-live" style={{ marginBottom: '1.5rem' }}>
                <span className="pulse-dot" />
                <span>LET'S MAKE HISTORY AT YOUR NEXT SHOW</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2.5rem, 6.5vw, 4.5rem)', fontWeight: 900, marginBottom: '1.2rem', lineHeight: 1 }}>
                READY TO <span className="neon-text-blue">IGNITE</span> YOUR <span className="text-gradient">EVENT?</span>
              </h2>
              <p style={{ color: '#ccc', fontSize: '1.15rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
                Don't settle for regular entertainment. Bring Nigeria's premier hypeman &amp; vibe controller to your wedding, concert, or festival stage.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/booking" className="btn-neon-blue" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
                  ⚡ GET INSTANT QUOTE &amp; BOOK
                </Link>
                <Link href="/tour" className="btn-neon-outline" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
                  🎟 VIEW TOUR SCHEDULE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
