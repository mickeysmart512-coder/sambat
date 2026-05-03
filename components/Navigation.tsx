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
      top: 0,
      width: '100%',
      zIndex: 1000,
      padding: '1rem 0',
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%)',
      backdropFilter: 'blur(15px)',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
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
            display: 'block',
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            zIndex: 1001,
            padding: '0.5rem'
          }}
          className="mobile-only"
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
          <Link href="/about" onClick={() => setIsOpen(false)} style={{ fontWeight: 600, fontSize: '0.85rem' }}>ABOUT</Link>
          <Link href="/tour" onClick={() => setIsOpen(false)} style={{ fontWeight: 600, fontSize: '0.85rem' }}>TOUR</Link>
          {user && <Link href="/dashboard" onClick={() => setIsOpen(false)} style={{ fontWeight: 600, fontSize: '0.85rem' }}>DASHBOARD</Link>}
          
          <div style={{ 
            display: 'flex', 
            gap: '1.2rem', 
            alignItems: 'center', 
            borderLeft: '1px solid var(--glass-border)', 
            paddingLeft: '1.5rem' 
          }} className="nav-socials">
            <a href="#" target="_blank" title="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" target="_blank" title="X (Twitter)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M13.232 10.768l6.768 -6.768"></path></svg>
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
            <Link href="/auth" onClick={() => setIsOpen(false)} className="btn-nav" style={{ 
              background: 'var(--accent-gold)', 
              color: '#000', 
              padding: '0.5rem 1.2rem', 
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.8rem'
            }}>LOGIN</Link>
          )}
        </div>
      </div>

      <style jsx>{`
        .mobile-only { display: none; }
        @media (max-width: 991px) {
          .mobile-only { display: block; }
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
