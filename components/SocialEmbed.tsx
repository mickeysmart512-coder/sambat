'use client';
import { useEffect } from 'react';

interface SocialEmbedProps {
  url: string;
}

export default function SocialEmbed({ url }: SocialEmbedProps) {
  useEffect(() => {
    // Process Instagram embeds
    if (url.includes('instagram.com') && (window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
    // Process TikTok embeds
    if (url.includes('tiktok.com')) {
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [url]);

  const isInstagram = url.includes('instagram.com');
  const isTikTok = url.includes('tiktok.com');

  return (
    <div className="glass-card fade-in" style={{ 
      padding: '0', 
      overflow: 'hidden', 
      height: '100%', 
      background: '#000', 
      position: 'relative',
      borderRadius: '16px'
    }}>
      {/* Social Icon Overlay */}
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 10,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          padding: '0.8rem',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.1)',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}
        className="social-hover-btn"
      >
        {isInstagram ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
        )}
      </a>

      {/* Header Hider Overlay (Top) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '60px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
        zIndex: 5,
        pointerEvents: 'none'
      }} />

      {isInstagram ? (
        <iframe
          src={`https://www.instagram.com/p/${url.split('/')[4]}/embed?captioned=0`}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          allowTransparency={true}
          style={{ 
            border: 'none', 
            minHeight: '500px',
            transform: 'scale(1.1)',
            transformOrigin: 'top center'
          }}
        ></iframe>
      ) : isTikTok ? (
        <div style={{ height: '100%', overflow: 'hidden' }}>
          <blockquote 
            className="tiktok-embed" 
            cite={url} 
            data-video-id={url.split('/').pop()?.split('?')[0]} 
            style={{ maxWidth: '100%', height: '100%' }}
          >
            <section></section>
          </blockquote>
        </div>
      ) : (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#666' }}>Media not available</p>
        </div>
      )}

      <style jsx>{`
        .social-hover-btn:hover {
          transform: scale(1.1) rotate(5deg);
          border-color: var(--accent-blue);
          color: var(--accent-blue);
          box-shadow: 0 0 20px rgba(0, 242, 255, 0.4);
        }
      `}</style>
    </div>
  );
}
