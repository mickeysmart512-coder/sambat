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
      top: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '95%',
      maxWidth: '1100px',
      padding: '0.6rem 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      background: 'rgba(10, 10, 10, 0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '100px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* Logo */}
      <Link href="/" style={{
        fontSize: '1.2rem',
        fontWeight: 900,
        letterSpacing: '1px',
        color: '#fff',
        marginLeft: '1.5rem',
        zIndex: 1001
      }}>
        DJ <span style={{ color: 'var(--accent-gold)' }}>SAMBAT</span>
      </Link>

      {/* Desktop Links */}
      <div style={{
        display: 'flex',
        gap: '2.5rem',
        alignItems: 'center',
      }} className="nav-links-desktop">
        <Link href="/" className="nav-link" style={{ fontSize: '0.7rem' }}>HOME</Link>
        <Link href="/about" className="nav-link" style={{ fontSize: '0.7rem' }}>BIO</Link>
        <Link href="/experiences" className="nav-link" style={{ fontSize: '0.7rem' }}>GALLERY</Link>
        <Link href="/tour" className="nav-link" style={{ fontSize: '0.7rem' }}>TOUR</Link>
        
        <div style={{ 
          display: 'flex', 
          gap: '1.2rem', 
          alignItems: 'center', 
          borderLeft: '1px solid rgba(255,255,255,0.1)', 
          paddingLeft: '1.5rem',
          marginRight: '0.5rem'
        }}>
          <a href="https://instagram.com/dj.sambat" target="_blank" className="nav-link" style={{ opacity: 0.8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="https://tiktok.com/@djsambat" target="_blank" className="nav-link" style={{ opacity: 0.8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
          </a>
        </div>

        {user ? (
          <button 
            onClick={handleLogout}
            className="btn-secondary"
            style={{ 
              padding: '0.6rem 1.5rem', 
              borderRadius: '50px',
              fontSize: '0.7rem',
              fontWeight: 800,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>LOGOUT</button>
        ) : (
          <Link href="/auth" className="btn-neon-blue" style={{ 
            padding: '0.7rem 1.8rem', 
            fontSize: '0.75rem',
            borderRadius: '50px',
            boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)'
          }}>BOOK NOW</Link>
        )}
      </div>

      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          display: 'none',
          marginRight: '1rem'
        }}
        className="hamburger-btn"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
        </svg>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: '5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          background: 'rgba(10,10,10,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          border: '1px solid rgba(255,255,255,0.1)',
          zIndex: 999
        }}>
          <Link href="/" onClick={() => setIsOpen(false)} className="nav-link">HOME</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="nav-link">BIO</Link>
          <Link href="/experiences" onClick={() => setIsOpen(false)} className="nav-link">GALLERY</Link>
          <Link href="/tour" onClick={() => setIsOpen(false)} className="nav-link">TOUR</Link>
          <Link href="/auth" onClick={() => setIsOpen(false)} className="btn-neon-blue" style={{ textAlign: 'center' }}>BOOK NOW</Link>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 991px) {
          .nav-links-desktop { display: none; }
          .hamburger-btn { display: block; }
        }
      `}</style>
    </nav>
  );
}
