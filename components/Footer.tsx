'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      padding: '6rem 0 3rem',
      background: '#050505',
      borderTop: '1px solid var(--glass-border)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '4rem',
          marginBottom: '4rem'
        }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1.5rem' }}>
              DJ <span className="neon-text-gold">SAMBAT</span>
            </h2>
            <p style={{ color: '#666', lineHeight: 1.8, maxWidth: '400px' }}>
              Igniting crowds and controlling the vibe across West Africa. The ultimate entertainment experience for your premium events.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>NAVIGATION</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><Link href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>HOME</Link></li>
              <li><Link href="/about" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>BIO</Link></li>
              <li><Link href="/experiences" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>GALLERY</Link></li>
              <li><Link href="/tour" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>TOUR</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>FOLLOW</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><a href="https://instagram.com/dj.sambat" target="_blank" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>INSTAGRAM</a></li>
              <li><a href="https://tiktok.com/@djsambat" target="_blank" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>TIKTOK</a></li>
              <li><a href="#" target="_blank" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>X (TWITTER)</a></li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '2rem',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{ color: '#444', fontSize: '0.75rem' }}>
            © 2026 DJ SAMBAT ENTERTAINMENT. ALL RIGHTS RESERVED.
          </p>
          <p style={{ color: '#444', fontSize: '0.75rem' }}>
            DESIGN BY TECHFROST
          </p>
        </div>
      </div>
    </footer>
  );
}
