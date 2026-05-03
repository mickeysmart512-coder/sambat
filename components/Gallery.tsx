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
    <section id="gallery" style={{ padding: 'clamp(2rem, 5vw, 4rem) 0', background: '#050505' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 100%, 350px), 1fr))',
          gap: '1.5rem',
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
