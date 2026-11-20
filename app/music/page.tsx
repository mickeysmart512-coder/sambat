'use client';
import Navigation from '@/components/Navigation';
import MusicPlayer from '@/components/MusicPlayer';
import Link from 'next/link';

export default function MusicPage() {
  const handleDropsInquiry = () => {
    const text = encodeURIComponent("Hi Sambat, I'm interested in ordering custom hype drops and jingles for my brand/event.");
    window.open(`https://wa.me/2348000000000?text=${text}`, '_blank');
  };

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
                Need that signature Sambat energy for your brand, mixtape, podcast, or event? Get custom high-impact voice drops, radio jingles, and energy-charged event announcements recorded directly from the studio.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={handleDropsInquiry} className="btn-neon-blue">
                  INQUIRE VIA WHATSAPP
                </button>
                <Link href="/booking" className="btn-secondary" style={{ padding: '0.8rem 1.8rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
                  BOOK LIVE PERFORMANCE
                </Link>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', fontWeight: 900 }}>WHAT'S INCLUDED:</h4>
              <ul style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 2, paddingLeft: '1.2rem' }}>
                <li>Studio Quality HQ WAV & MP3 Master</li>
                <li>Dry & Wet FX (Reverb, Delay, Laser Stabs)</li>
                <li>Turnaround within 48 Hours</li>
                <li>Exclusive License for Broadcast / Commercial Use</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
