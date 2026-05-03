'use client';
import SocialEmbed from './SocialEmbed';

export default function Gallery() {
  const media = [
    "https://www.instagram.com/reel/DWWif0_DCER/",
    "https://www.instagram.com/p/DVKJG2ljNvN/",
    "https://www.instagram.com/reel/DUhU6RfDKg8/",
    "https://www.instagram.com/p/DPSmZg3CICt/",
    "https://www.instagram.com/reel/DO2JfcACDtA/",
    "https://www.tiktok.com/@djsambat/video/7621578137352228116"
  ];

  return (
    <section id="gallery" style={{ padding: 'clamp(2rem, 5vw, 4rem) 0', background: '#050505' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 100%, 350px), 1fr))',
          gap: '1.5rem',
        }}>
          {media.map((url, index) => (
            <div key={index} className="fade-in" style={{ animationDelay: `${index * 0.15}s`, height: '500px' }}>
              <SocialEmbed url={url} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
