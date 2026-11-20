'use client';
import { useState } from 'react';

const mixes = [
  {
    title: "Vibe Controller Vol. 1 (Afro & Amapiano Shutdown)",
    embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    type: "Club Set",
    duration: "45 Mins"
  },
  {
    title: "Street Luxury Festival Live Experience",
    embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    type: "Live Festival",
    duration: "60 Mins"
  }
];

const sampleDrops = [
  { label: "SAMBAT IN THE BUILDING", tag: "Signature Intro", freq: 440 },
  { label: "PULL UP DAT!", tag: "Hype Shout", freq: 587 },
  { label: "MAXIMUM ENERGY", tag: "Transition Drop", freq: 659 },
  { label: "VIBE CONTROLLER", tag: "Crowd Ignite", freq: 880 }
];

export default function MusicPlayer() {
  const [playingDrop, setPlayingDrop] = useState<string | null>(null);

  const playDropSound = (label: string, freq: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);

      setPlayingDrop(label);
      setTimeout(() => setPlayingDrop(null), 500);
    } catch (e) {
      console.warn('AudioContext unavailable');
    }
  };

  return (
    <section id="music" className="section-padding">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '1rem' }}>
            LATEST <span className="neon-text-gold">SETS & MIXES</span>
          </h2>
          <p style={{ color: '#888' }}>Stream the signature sound and high-octane live sets from DJ Sambat.</p>
        </div>

        {/* Mixes Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
          gap: '2.5rem',
          marginBottom: '5rem'
        }}>
          {mixes.map((mix, i) => (
            <div key={i} className="glass-card fade-in" style={{ padding: '1rem', animationDelay: `${i * 0.2}s` }}>
              <div style={{ 
                position: 'relative', 
                paddingBottom: '56.25%', 
                height: 0, 
                borderRadius: '12px', 
                overflow: 'hidden',
                background: '#111'
              }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  src={mix.embedUrl}
                  title={mix.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.1em' }}>{mix.type}</span>
                  <h3 style={{ fontSize: '1.1rem', marginTop: '0.3rem', fontWeight: 800 }}>{mix.title}</h3>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 700 }}>{mix.duration}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Soundboard Preview */}
        <div className="glass-card" style={{ padding: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              INTERACTIVE <span className="neon-text-blue">HYPE SOUNDBOARD</span>
            </h3>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Tap the sample soundbites below to experience Sambat's trademark crowd drops.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {sampleDrops.map((drop, idx) => {
              const isPlaying = playingDrop === drop.label;
              return (
                <button
                  key={idx}
                  onClick={() => playDropSound(drop.label, drop.freq)}
                  style={{
                    background: isPlaying ? 'rgba(0, 242, 255, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: isPlaying ? '1px solid var(--accent-blue)' : '1px solid var(--glass-border)',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isPlaying ? '0 0 25px rgba(0, 242, 255, 0.4)' : 'none',
                    transform: isPlaying ? 'scale(1.03)' : 'scale(1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800 }}>{drop.tag}</span>
                    <span style={{ fontSize: '1.2rem' }}>{isPlaying ? '🔊' : '▶'}</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '0.5px' }}>{drop.label}</h4>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
