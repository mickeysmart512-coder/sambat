import { useState, useEffect } from 'react';
import SocialEmbed from './SocialEmbed';
import Skeleton from './Skeleton';

export default function Gallery() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/catalog')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMedia(data);
      })
      .catch(err => console.error('Gallery fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="gallery" className="section-padding" style={{ background: '#050505' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '1rem' }}>
            LIVE <span className="neon-text-pink">HIGHLIGHTS</span>
          </h2>
          <p style={{ color: '#888' }}>Visual proof of the energy DJ Sambat brings to every stage.</p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(300px, 100%, 400px), 1fr))',
          gap: '2rem',
        }}>
          {loading ? (
            // Skeleton State
            Array(6).fill(0).map((_, i) => (
              <div key={i} style={{ height: '500px' }}>
                <Skeleton height="100%" borderRadius="16px" />
              </div>
            ))
          ) : (
            media.map((item, index) => (
              <div key={item.id || index} className="fade-in" style={{ animationDelay: `${index * 0.15}s`, height: '500px' }}>
                <SocialEmbed url={item.url} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
