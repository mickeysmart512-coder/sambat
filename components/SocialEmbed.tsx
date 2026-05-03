'use client';
import { useEffect, useRef } from 'react';

interface SocialEmbedProps {
  url: string;
}

export default function SocialEmbed({ url }: SocialEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Process Instagram embeds
    if (url.includes('instagram.com') && (window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
    // Process TikTok embeds
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up if needed
    };
  }, [url]);

  if (url.includes('instagram.com')) {
    const reelId = url.split('/')[4];
    return (
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden', height: '100%', background: '#000', position: 'relative' }}>
        <iframe
          src={`https://www.instagram.com/p/${reelId}/embed?captioned=0`}
          width="100%"
          height="120%"
          frameBorder="0"
          scrolling="no"
          allowTransparency={true}
          style={{ 
            border: 'none', 
            minHeight: '500px',
            marginTop: '-54px',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        ></iframe>
      </div>
    );
  }

  if (url.includes('tiktok.com')) {
    const tiktokId = url.split('/').pop()?.split('?')[0];
    return (
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden', height: '100%', background: '#000' }}>
        <blockquote 
          className="tiktok-embed" 
          cite={url} 
          data-video-id={tiktokId} 
          style={{ maxWidth: '605px', minWidth: '325px', height: '100%' }}
        >
          <section></section>
        </blockquote>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
      <p style={{ color: '#666' }}>Media not available</p>
    </div>
  );
}
