'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Navigation() {
  const [user, setUser] = useState<any>(null);
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
      padding: '1.5rem 0',
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{
          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
          fontWeight: 900,
          letterSpacing: '2px',
          color: 'var(--accent-gold)',
          whiteSpace: 'nowrap'
        }}>
          DJ SAMBAT
        </Link>
        
        <div style={{
          display: 'flex',
          gap: 'clamp(1rem, 3vw, 2.5rem)',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}>
          <Link href="/about" style={{ fontWeight: 600, fontSize: '0.8rem' }}>ABOUT</Link>
          <Link href="/tour" style={{ fontWeight: 600, fontSize: '0.8rem' }}>TOUR</Link>
          {user && <Link href="/dashboard" style={{ fontWeight: 600, fontSize: '0.8rem' }}>DASHBOARD</Link>}
          
          <div className="nav-socials" style={{ 
            display: 'flex', 
            gap: '0.8rem', 
            alignItems: 'center', 
            borderLeft: '1px solid var(--glass-border)', 
            paddingLeft: '1rem' 
          }}>
            <a href="#" target="_blank" title="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" target="_blank" title="X (Twitter)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M13.232 10.768l6.768 -6.768"></path></svg>
            </a>
          </div>

          {user ? (
            <button 
              onClick={handleLogout}
              style={{ 
                background: 'rgba(255,255,255,0.05)', 
                color: '#fff', 
                padding: '0.4rem 1rem', 
                borderRadius: '4px',
                border: '1px solid var(--glass-border)',
                fontWeight: 800,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}>LOGOUT</button>
          ) : (
            <Link href="/auth" style={{ 
              background: 'var(--accent-gold)', 
              color: '#000', 
              padding: '0.4rem 1rem', 
              borderRadius: '4px',
              fontWeight: 800,
              fontSize: '0.75rem'
            }}>LOGIN</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
