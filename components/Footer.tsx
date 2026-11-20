'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      padding: '6rem 0 3rem',
      background: '#040406',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'relative'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3.5rem',
          marginBottom: '4rem'
        }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <Link href="/" style={{ fontSize: '2rem', fontWeight: 900, textDecoration: 'none', color: '#fff', letterSpacing: '1px' }}>
              DJ <span className="neon-text-gold">SAMBAT</span>
            </Link>
            <p style={{ color: '#888', lineHeight: 1.8, maxWidth: '420px', marginTop: '1rem', fontSize: '0.95rem' }}>
              Official Website of DJ Sambat — The Hypeman &amp; Vibe Controller. Igniting stages, luxury weddings, and arena concerts across Nigeria and West Africa.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <Link href="/booking" className="btn-neon-blue" style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}>
                BOOK EVENT NOW
              </Link>
              <Link href="/tour" className="btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}>
                GET TOUR TICKETS
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>EXPLORE</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><Link href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>HOME</Link></li>
              <li><Link href="/about" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>BIOGRAPHY</Link></li>
              <li><Link href="/music" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>MIXES &amp; DROPS</Link></li>
              <li><Link href="/experiences" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>LIVE GALLERY</Link></li>
              <li><Link href="/tour" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>TOUR &amp; TICKETS</Link></li>
              <li><Link href="/booking" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700 }}>BOOK AN EVENT</Link></li>
            </ul>
          </div>

          {/* Portal Links */}
          <div>
            <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>PORTALS &amp; SOCIAL</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><Link href="/dashboard" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>CLIENT DASHBOARD</Link></li>
              <li><Link href="/studio-sambat-hq" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700 }}>ADMIN HQ COMMAND</Link></li>
              <li><a href="https://instagram.com/dj.sambat" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>INSTAGRAM REELS</a></li>
              <li><a href="https://tiktok.com/@djsambat" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>TIKTOK MOMENTS</a></li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{ color: '#666', fontSize: '0.8rem' }}>
            © 2026 DJ SAMBAT ENTERTAINMENT. ALL RIGHTS RESERVED.
          </p>
          <p style={{ color: '#666', fontSize: '0.8rem' }}>
            ENGINEERED &amp; BRANDED BY <strong style={{ color: '#fff' }}>TECHFROST</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
