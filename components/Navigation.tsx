'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Navigation() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav style={{
      position: 'fixed',
      top: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '1200px',
      padding: '0.8rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      background: 'rgba(5, 5, 5, 0.6)',
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      border: '1px solid var(--glass-border)',
      borderRadius: '50px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{
        display: 'contents'
      }}>
        <Link href="/" style={{
          fontSize: '1.25rem',
          fontWeight: 900,
          letterSpacing: '2px',
          color: 'var(--accent-gold)',
          zIndex: 1001
        }}>
          DJ SAMBAT
        </Link>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            zIndex: 1001,
            padding: '0.5rem',
          }}
          className="hamburger-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>}
          </svg>
        </button>
        
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
          transition: 'transform 0.3s ease',
        }} className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link href="/" onClick={() => setIsOpen(false)} className="nav-link" style={{ fontSize: '0.75rem' }}>HOME</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="nav-link" style={{ fontSize: '0.75rem' }}>BIO</Link>
          <Link href="/experiences" onClick={() => setIsOpen(false)} className="nav-link" style={{ fontSize: '0.75rem' }}>GALLERY</Link>
          <Link href="/music" onClick={() => setIsOpen(false)} className="nav-link" style={{ fontSize: '0.75rem' }}>MUSIC</Link>
          <Link href="/tour" onClick={() => setIsOpen(false)} className="nav-link" style={{ fontSize: '0.75rem' }}>TOUR</Link>
          
          <div style={{ 
            display: 'flex', 
            gap: '1.2rem', 
            alignItems: 'center', 
            borderLeft: '1px solid var(--glass-border)', 
            paddingLeft: '1.5rem' 
          }} className="nav-socials">
            <a href="https://www.instagram.com/dj.sambat?igsh=MWhnNWRneWZzdDhpOA==" target="_blank" title="Instagram" style={{ color: 'inherit' }} className="nav-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://www.tiktok.com/@djsambat?is_from_webapp=1&sender_device=pc" target="_blank" title="TikTok" style={{ color: 'inherit' }} className="nav-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
            </a>
          </div>

          {user ? (
            <button 
              onClick={() => { handleLogout(); setIsOpen(false); }}
              className="btn-nav"
              style={{ 
                background: 'rgba(255,255,255,0.05)', 
                color: '#fff', 
                padding: '0.5rem 1.2rem', 
                borderRadius: '6px',
                border: '1px solid var(--glass-border)',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}>LOGOUT</button>
          ) : (
            <Link href="/auth" onClick={() => setIsOpen(false)} className="btn-neon-blue" style={{ 
              padding: '0.6rem 1.2rem', 
              fontSize: '0.75rem',
              borderRadius: '50px'
            }}>BOOK NOW</Link>
          )}
        </div>
      </div>

      <style jsx>{`
        .hamburger-btn { display: none; }
        @media (max-width: 991px) {
          .hamburger-btn { display: block; }
          .nav-links {
            position: fixed;
            top: 0;
            right: 0;
            width: 80%;
            height: 100vh;
            background: #000;
            flex-direction: column;
            justify-content: center;
            transform: translateX(100%);
            z-index: 1000;
            padding: 2rem;
          }
          .nav-links.active {
            transform: translateX(0);
          }
          .nav-socials {
            border-left: none !important;
            padding-left: 0 !important;
            margin: 1rem 0;
          }
          .btn-nav {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

    </nav>
  );
}
