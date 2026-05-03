'use client';

const mixes = [
  {
    title: "Vibe Controller Vol. 1",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    type: "Youtube"
  },
  {
    title: "Club Shutdown Mix 2024",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    type: "Live Set"
  }
];

export default function MusicPlayer() {
  return (
    <section id="music" className="section-padding">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '1rem' }}>
            LATEST <span className="neon-text-gold">MIXES</span>
          </h2>
          <p style={{ color: '#888' }}>Stream the signature energy of DJ Sambat anywhere, anytime.</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '3rem' 
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
                  src={mix.url}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.1em' }}>{mix.type}</span>
                <h3 style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>{mix.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
