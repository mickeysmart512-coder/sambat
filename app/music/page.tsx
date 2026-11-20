'use client';
import Navigation from '@/components/Navigation';
import MusicPlayer from '@/components/MusicPlayer';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function MusicPage() {
  const handleDropsInquiry = () => {
    const text = encodeURIComponent("Hi Sambat, I'm interested in ordering custom hype drops and jingles for my brand/event.");
    window.open(`https://wa.me/2348000000000?text=${text}`, '_blank');
  };

  return (
    <main style={{ background: '#070709', minHeight: '100vh', color: '#fff' }}>
      <Navigation />
      <div style={{ paddingTop: '8rem' }}>
        <MusicPlayer />
      </div>
      
      {/* Featured Drop Section */}
      <section className="section-padding" style={{ background: '#0a0a0f', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', padding: '4rem', alignItems: 'center' }}>
            <div>
              <div className="badge-live" style={{ marginBottom: '1rem' }}>
                <span>STUDIO AUDIO PRODUCTION</span>
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.2rem' }}>
                CUSTOM <span className="neon-text-blue">DROPS</span> &amp; JINGLES
              </h2>
              <p style={{ color: '#aaa', marginBottom: '2rem', lineHeight: 1.8, fontSize: '1rem' }}>
                Need that signature Sambat energy for your brand, mixtape, podcast, or event? Get custom high-impact voice drops, radio jingles, and energy-charged event announcements recorded directly in studio quality.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={handleDropsInquiry} className="btn-neon-blue">
                  💬 INQUIRE VIA WHATSAPP
                </button>
                <Link href="/booking" className="btn-secondary" style={{ padding: '0.8rem 1.8rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
                  BOOK LIVE PERFORMANCE
                </Link>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1.2rem', fontWeight: 900 }}>WHAT'S INCLUDED:</h4>
              <ul style={{ color: '#ccc', fontSize: '0.95rem', lineHeight: 2.2, paddingLeft: '1.2rem' }}>
                <li>Studio Quality 24-bit WAV &amp; 320kbps MP3 Masters</li>
                <li>Dry Vocal Stems &amp; Wet FX (Laser Stabs, Delay, Reverb)</li>
                <li>Fast Turnaround within 48 Hours</li>
                <li>Full Exclusive Commercial &amp; Broadcast Rights</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
