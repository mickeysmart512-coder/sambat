'use client';
export default function Gallery() {
  const images = [
    { src: "/hero-bg.png", alt: "DJ Sambat Hero" },
    { src: "/gallery-1.png", alt: "Crowd Energy" },
    { src: "/gallery-2.png", alt: "Pro Decks" },
  ];

  return (
    <section id="gallery" style={{ padding: '8rem 0', background: '#050505' }}>
      <div className="container">
        <h2 className="section-title">The <span className="text-gradient">Experience</span></h2>
        <p style={{ color: '#888', marginBottom: '4rem', fontSize: '1.2rem' }}>Visuals from some of the most electric nights with DJ Sambat.</p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem',
        }}>
          {images.map((img, index) => (
            <div key={index} className={`glass-card fade-in`} style={{
              padding: '0',
              overflow: 'hidden',
              height: '400px',
              position: 'relative',
              transition: 'var(--transition)',
              cursor: 'pointer',
              animationDelay: `${index * 0.2}s`
            }}>
              <img 
                src={img.src} 
                alt={img.alt} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                padding: '2rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                opacity: 0,
                transition: 'var(--transition)'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '0'}
              >
                <h4 style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>{img.alt}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
